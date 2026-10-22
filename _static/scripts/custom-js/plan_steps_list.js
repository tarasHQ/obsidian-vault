/** Renders a phase's automatically discovered steps through Obsidian CustomJS and Dataview. */
class PlanStepsList {
    /** Keeps document conventions, presentation, and optional views in one editable place. */
    config = {
        stepsFolder: "steps",
        filenamePattern: /^(\d+(?:\.\d+)?)-(.+)\.md$/,
        stepIdentifierPattern: /^\d+(?:\.\d+)?$/,
        properties: {
            status: "status",
            state: "state",
            reviewedAtStep: "reviewedAtStep",
        },
        statuses: {
            order: ["postponed", "waiting", "implemented"],
            labels: { postponed: "Postponed", waiting: "Waiting", implemented: "Implemented" },
            waiting: "waiting",
            implemented: "implemented",
        },
        states: ["placeholder", "high-level", "full", "condensed"],
        views: { overview: true, details: true },
        headings: {
            overview: "Overview",
            details: "Details",
            description: "Description",
            sectionLevel: 3,
            groupLevel: 4,
            stepLevel: 4,
            descriptionLevel: 5,
        },
        description: { sourceHeading: "Description", sourceLevel: 2, loadBatchSize: 8 },
        columns: ["Step", "State", "Reviewed at step"],
        minorTitleWords: ["a", "an", "the", "and", "but", "or", "nor", "for", "so", "yet", "as", "at", "by", "in", "of", "on", "per", "to", "up", "via", "with", "from", "into", "onto", "over", "than"],
        text: {
            titleSeparator: " — ",
            metadataSeparator: " — ",
            missingReview: "—",
            empty: "No steps found",
        },
        styles: `
            .plan-steps-list { min-width: 0; }
            .plan-steps-list .step-section-heading { margin: 16px 0 8px; }
            .plan-steps-list .step-group-heading { margin: 12px 0 6px; }
            .plan-steps-list .step-description-heading { margin: 10px 0 4px; }
            .plan-steps-list .step-table-wrapper { overflow-x: auto; }
            .plan-steps-list table { width: 100%; margin: 0; border-collapse: collapse; font-size: 0.9rem; }
            .plan-steps-list th, .plan-steps-list td { padding: 4px 8px; text-align: left; vertical-align: top; }
            .plan-steps-list th { color: var(--text-muted); font-weight: normal; }
            .plan-steps-list th:first-child, .plan-steps-list td:first-child { width: 100%; overflow-wrap: anywhere; }
            .plan-steps-list th:not(:first-child), .plan-steps-list td:not(:first-child) { white-space: nowrap; }
            .plan-steps-list tr.is-next > td { background: var(--background-modifier-hover); }
            .plan-steps-list tr.is-next > td:first-child { border-left: 3px solid var(--interactive-accent); }
            .plan-steps-list .step-separator { margin: 0; height: 0; border: 0; border-top: 1px solid var(--background-modifier-border); }
            .plan-steps-list .step-block { margin: 16px 0; padding: 6px 10px; border-left: 3px solid transparent; }
            .plan-steps-list .step-block.is-next { border-left-color: var(--interactive-accent); background: var(--background-modifier-hover); }
            .plan-steps-list .step-title { margin: 0 0 4px; overflow-wrap: anywhere; }
            .plan-steps-list .step-metadata, .plan-steps-list .step-empty { margin: 0; color: var(--text-muted); font-size: 0.85rem; }
            .plan-steps-list .step-description > :first-child { margin-top: 0; font-size: 0.9rem;}
            .plan-steps-list .step-description > :last-child { margin-bottom: 0; }
        `,
    };

    /** Creates DOM nodes without interpreting filenames or metadata as HTML. */
    createElement(parent, tag, text, className) {
        const element = parent.ownerDocument.createElement(tag);
        if (text !== undefined) element.textContent = text;
        if (className) element.className = className;
        parent.appendChild(element);
        return element;
    }

    /** Preserves filename authority while applying simple, configurable title-case rules. */
    formatTitle(slug) {
        const words = slug.split("-").filter(Boolean);
        const minorWords = new Set(this.config.minorTitleWords);
        return words.map((word, index) => {
            const lowercase = word.toLowerCase();
            const isInterior = index > 0 && index < words.length - 1;
            return isInterior && minorWords.has(lowercase)
                ? lowercase
                : lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
        }).join(" ");
    }

    /** Validates one indexed note so malformed steps cannot silently disappear from the phase. */
    normalizeStep(page) {
        const filename = `${page.file.name}.md`;
        const match = filename.match(this.config.filenamePattern);
        if (!match || !this.formatTitle(match[2])) {
            throw new Error(`Invalid step filename "${page.file.path}": expected NUMBER-title.md, for example 01.5-review-sync.md.`);
        }

        const number = Number(match[1]);
        if (!Number.isFinite(number)) {
            throw new Error(`Invalid step number in "${page.file.path}".`);
        }

        const properties = this.config.properties;
        const status = page[properties.status];
        const state = page[properties.state];
        if (!this.config.statuses.order.includes(status)) {
            throw new Error(`Invalid ${properties.status} in "${page.file.path}": expected ${this.config.statuses.order.join(", ")}.`);
        }
        if (!this.config.states.includes(state)) {
            throw new Error(`Invalid ${properties.state} in "${page.file.path}": expected ${this.config.states.join(", ")}.`);
        }

        const reviewValue = page[properties.reviewedAtStep];
        let reviewedAtStep = this.config.text.missingReview;
        if (reviewValue !== undefined && reviewValue !== null && reviewValue !== "") {
            if ((typeof reviewValue !== "string" && typeof reviewValue !== "number")
                || !this.config.stepIdentifierPattern.test(String(reviewValue))) {
                throw new Error(`Invalid ${properties.reviewedAtStep} in "${page.file.path}": expected a quoted step number or an empty value.`);
            }
            reviewedAtStep = String(reviewValue);
        }

        return {
            path: page.file.path,
            identifier: match[1],
            number,
            title: this.formatTitle(match[2]),
            status,
            state,
            reviewedAtStep,
            description: "",
        };
    }

    /** Restricts discovery to this phase's direct step notes and rejects ambiguous numerical order. */
    discoverSteps(dv) {
        const currentFile = dv.current()?.file;
        if (!currentFile?.path) {
            throw new Error("PlanStepsList must be invoked from a phase-plan note.");
        }
        const folder = currentFile.folder
            ? `${currentFile.folder}/${this.config.stepsFolder}`
            : this.config.stepsFolder;
        const pages = Array.from(dv.pages(JSON.stringify(folder)));
        const steps = pages
            .filter(page => page.file.folder === folder)
            .map(page => this.normalizeStep(page));
        const numbers = new Map();
        for (const step of steps) {
            if (numbers.has(step.number)) {
                throw new Error(`Duplicate numeric step identifier: "${numbers.get(step.number)}" and "${step.path}".`);
            }
            numbers.set(step.number, step.path);
        }
        return steps.sort((left, right) => right.number - left.number);
    }

    /** Finds the earliest waiting step even when later steps were implemented out of order. */
    findNextStep(steps) {
        let next = null;
        for (const step of steps) {
            if (step.status === this.config.statuses.waiting && (!next || step.number < next.number)) {
                next = step;
            }
        }
        return next?.path ?? null;
    }

    /** Extracts an ATX-heading section without treating headings inside fenced code as boundaries. */
    extractDescription(markdown) {
        const lines = markdown.split(/\r?\n/);
        const source = this.config.description;
        let start = null;
        let fence = null;
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            if (fence) {
                const closing = line.match(/^ {0,3}(`+|~+)[ \t]*$/);
                if (closing && closing[1][0] === fence.character && closing[1].length >= fence.length) {
                    fence = null;
                }
                continue;
            }
            const opening = line.match(/^ {0,3}(`{3,}|~{3,})/);
            if (opening) {
                fence = { character: opening[1][0], length: opening[1].length };
                continue;
            }
            const heading = line.match(/^ {0,3}(#{1,6})(?:[ \t]+(.*)|[ \t]*)$/);
            if (!heading) continue;
            const level = heading[1].length;
            const title = (heading[2] ?? "").replace(/[ \t]+#+[ \t]*$/, "").trim();
            if (start !== null && level <= source.sourceLevel) {
                return lines.slice(start, index).join("\n").trim();
            }
            if (start === null && level === source.sourceLevel
                && title.toLowerCase() === source.sourceHeading.toLowerCase()) {
                start = index + 1;
            }
        }
        return start === null ? "" : lines.slice(start).join("\n").trim();
    }

    /** Bounds concurrent file reads and avoids loading bodies when only the overview is enabled. */
    async loadDescriptions(dv, steps) {
        const batchSize = this.config.description.loadBatchSize;
        if (!Number.isInteger(batchSize) || batchSize < 1) {
            throw new Error("description.loadBatchSize must be a positive integer.");
        }
        for (let index = 0; index < steps.length; index += batchSize) {
            await Promise.all(steps.slice(index, index + batchSize).map(async step => {
                const markdown = await dv.io.load(step.path);
                if (typeof markdown !== "string") {
                    throw new Error(`Cannot load step description from "${step.path}".`);
                }
                step.description = this.extractDescription(markdown);
            }));
        }
    }

    /** Retains Obsidian's internal-link behavior while keeping display titles derived from filenames. */
    appendStepLink(parent, step, includeReview = false) {
        const link = this.createElement(parent, "a");
        link.className = "internal-link";
        link.setAttribute("href", step.path);
        link.setAttribute("data-href", step.path);
        link.textContent = `${step.identifier}${this.config.text.titleSeparator}${step.title}`
            + (includeReview ? ` [${step.reviewedAtStep}]` : "");
        return link;
    }

    /** Shows only populated status groups; each group inherits the shared descending step order. */
    renderOverview(parent, steps, nextPath) {
        const headings = this.config.headings;
        this.createElement(parent, `h${headings.sectionLevel}`, headings.overview, "step-section-heading");
        for (const status of this.config.statuses.order) {
            const group = steps.filter(step => step.status === status);
            if (group.length === 0) continue;
            this.createElement(parent, `h${headings.groupLevel}`, this.config.statuses.labels[status], "step-group-heading");
            const wrapper = this.createElement(parent, "div", undefined, "step-table-wrapper");
            const table = this.createElement(wrapper, "table");
            const header = this.createElement(this.createElement(table, "thead"), "tr");
            for (const column of this.config.columns) this.createElement(header, "th", column);
            const body = this.createElement(table, "tbody");
            for (const step of group) {
                const row = this.createElement(body, "tr", undefined, step.path === nextPath ? "is-next" : "");
                this.appendStepLink(this.createElement(row, "td"), step);
                this.createElement(row, "td", step.state);
                this.createElement(row, "td", step.reviewedAtStep);
            }
        }
    }

    /** Uses Dataview Markdown rendering and theme-native strike markup, with step-local link resolution. */
    renderDetails(dv, parent, steps, nextPath) {
        const headings = this.config.headings;
        this.createElement(parent, `h${headings.sectionLevel}`, headings.details, "step-section-heading");
        for (const [index, step] of steps.entries()) {
            if (index > 0) this.createElement(parent, "hr", undefined, "step-separator");
            const block = this.createElement(parent, "div", undefined,
                `step-block${step.path === nextPath ? " is-next" : ""}`);
            const heading = this.createElement(block, `h${headings.stepLevel}`, undefined, "step-title");
            const titleParent = step.status === this.config.statuses.implemented
                ? this.createElement(heading, "del")
                : heading;
            this.appendStepLink(titleParent, step, true);
            this.createElement(block, "p", `${step.status}${this.config.text.metadataSeparator}${step.state}`, "step-metadata");
            if (step.description) {
                this.createElement(block, `h${headings.descriptionLevel}`, headings.description, "step-description-heading");
                // A scoped receiver preserves relative links without mutating the plan's Dataview context.
                const stepView = Object.create(dv);
                stepView.container = block;
                stepView.currentFilePath = step.path;
                stepView.el("div", step.description, { cls: "step-description" });
            }
        }
    }

    /** Single CustomJS entry point; builds both views from one discovery pass without mutating notes. */
    async renderSteps(dv, container) {
        const steps = this.discoverSteps(dv);
        const nextPath = this.findNextStep(steps);
        if (this.config.views.details) await this.loadDescriptions(dv, steps);

        const root = container.ownerDocument.createElement("div");
        root.className = "plan-steps-list";
        this.createElement(root, "style", this.config.styles);
        // Markdown rendering starts only after its target is attached to the note.
        container.replaceChildren(root);
        if (steps.length === 0) {
            this.createElement(root, "p", this.config.text.empty, "step-empty");
        } else {
            if (this.config.views.overview) this.renderOverview(root, steps, nextPath);
            if (this.config.views.details) this.renderDetails(dv, root, steps, nextPath);
        }
    }
}
