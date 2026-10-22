/** Renders compact phase-document lists through Obsidian CustomJS and Dataview. */
class RenderReflectionHelpers {
    /** Minimum column width in pixels; narrower containers wrap columns onto new rows. */
    minimumColumnWidth = 220;

    /** Escapes note metadata before inserting it into HTML text or attributes. */
    escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
    }

    /** Keeps links compact and bullet-free, with optional dimming for integrated notes. */
    buildClickableList(pages, { dimmed = false } = {}) {
        if (!pages || pages.length === 0) {
            return "<p style='color: var(--text-muted); font-style: italic; margin: 0; font-size: 0.9rem;'>No files found</p>";
        }

        const linksHtml = pages
            .map(page => {
                const path = this.escapeHtml(page.file.path);
                const name = this.escapeHtml(page.file.name);
                return `<li style="list-style: none; margin: 0; padding: 0; line-height: 1.4; overflow-wrap: anywhere;"><a class="internal-link" data-href="${path}" href="${path}">${name}</a></li>`;
            })
            .join("");

        return `<ul class="dataview list-view-list" style="list-style: none; margin: 0; padding: 0; font-size: 0.9rem;${dimmed ? " opacity: 0.6;" : ""}">${linksHtml}</ul>`;
    }

    /** Partitions already-sorted notes without letting malformed flags hide unresolved insights. */
    groupByIntegration(pages) {
        const unintegrated = [];
        const integrated = [];

        for (const page of pages) {
            const flag = page.isIntegrated;
            if (flag !== undefined && typeof flag !== "boolean") {
                throw new Error(
                    `Invalid isIntegrated in "${page.file.path}": expected a boolean or an omitted property.`
                );
            }

            if (flag === true) {
                integrated.push(page);
            } else {
                unintegrated.push(page);
            }
        }

        return { unintegrated, integrated };
    }

    /** Separates unresolved and integrated notes only when both groups contain links. */
    buildIntegrationList(pages) {
        const { unintegrated, integrated } = this.groupByIntegration(pages);
        const groups = [];

        if (unintegrated.length > 0) {
            groups.push(this.buildClickableList(unintegrated));
        }
        if (integrated.length > 0) {
            groups.push(this.buildClickableList(integrated, { dimmed: true }));
        }
        if (groups.length === 0) {
            return this.buildClickableList([]);
        }

        const separator = '<div style="border-top: 1px solid var(--background-modifier-border); margin: 8px 0;"></div>';
        return groups.join(separator);
    }

    /** Lets columns share available width while wrapping before their minimum width is violated. */
    buildColumn(title, content) {
        return `
            <div style="flex: 1 1 ${this.minimumColumnWidth}px; min-width: ${this.minimumColumnWidth}px; box-sizing: border-box;">
                <h3 style="margin: 0 0 8px; border-bottom: 1px solid var(--background-modifier-border); padding-bottom: 6px; text-align: center;">${this.escapeHtml(title)}</h3>
                ${content}
            </div>
        `;
    }

    /** Queries folders relative to the current note, preserving newest-first order within each group. */
    async renderColumns(dv, container) {
        const currentFolder = dv.current()?.file?.folder ?? "";
        const prefix = currentFolder ? `${currentFolder}/` : "";
        const columns = [
            { title: "Reflections", folder: "_reflections", groupByIntegration: true },
            { title: "Ideas", folder: "ideas", groupByIntegration: true },
            { title: "Artifacts", folder: "artifacts", groupByIntegration: false },
        ];

        const columnsHtml = columns
            .map(column => {
                const pages = dv.pages(JSON.stringify(`${prefix}${column.folder}`))
                    .sort(page => page.file.ctime, "desc");
                const content = column.groupByIntegration
                    ? this.buildIntegrationList(pages)
                    : this.buildClickableList(pages);
                return this.buildColumn(column.title, content);
            })
            .join("");

        container.innerHTML = `
            <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-start; box-sizing: border-box;">
                ${columnsHtml}
            </div>
        `;
    }
}
