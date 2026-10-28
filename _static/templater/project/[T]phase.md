<%*
// ============================================================================
// TEMPLATE One-shot phase generator
//
// LLM RULE:
// DON'T USE <> TAGS in comments. It breaks further rendering of markdown in obsidian. 
//
// How it works:
// 1. Checks that you are in a fresh, empty tab (Ctrl+N).
// 2. Discovers your project and calculates the next phase number (e.g. 004).
// 3. Creates the phase folder and standard subfolders for the starter notes.
// 4. Turns your current empty tab into the new phase's _plan_<NNN>.md (avoids stray tabs).
//    The plan note embeds the phase number (e.g. _plan_004.md) so its title is
//    unique across the whole vault.
// 5. Inserts the new phase under "## Phases" in _project.md with stable spacing.
// 6. Silently creates ideas/parking.md, _reflections/initial-reflection.md, and the
//    deterministic steps/00-start.md + steps/99-end.md from their dedicated templates
//    ([T]ideas, [T]reflections, [T]step-start, [T]step-end). The phase plan remains
//    focused; starter steps do not open additional tabs.
// 7. Ships the phase's SSOT copies from the internal-templates folder:
//    - `_step-template.md` at the phase root (|PHASE_NUMBER| pre-substituted) — the
//      single source that both [T]step and the LLM flow copy new steps from.
//      PLANNING.md is no longer parsed for the step template.
//    - `artifacts/_exploration.md`.
// ============================================================================

// ============================================================================
// 0. CONFIG — the single place to adjust names / paths / template references.
//    SHARED VALUES (keep in sync with the other templates' CFG blocks):
//      - CFG.autoPlanFlag    : must equal CFG.autoPlanFlag in [T]plan.md
//                              (they share the flag through `window`).
//      - CFG.autoCaptureContext : must match [T]ideas.md and [T]reflections.md;
//                                 only the specified child file uses automatic mode.
//      - CFG.reflectionFolderSuffix / ideasDirName / stepsDirName / planFileNamePrefix :
//                              must match the same keys in the other templates.
// ============================================================================
const CFG = {
    // --- Safety gate ------------------------------------------------------------
    untitledPrefix: "Untitled",             // a fresh empty tab is titled with this prefix
    selfTemplateName: "[T]phase",           // this template's own file name (fallback lookup)

    // --- Project & phase layout ---------------------------------------------------
    projectFileName: "_project.md",
    promptSelectProject: "Select Project:",
    phasesDirName: "phases",
    phaseNumberDigits: 3,                   // phase folders are zero-padded, e.g. 004

    // --- Subfolders created inside every new phase ----------------------------------
    reflectionFolderSuffix: "_reflections",
    ideasDirName: "ideas",
    artifactsDirName: "artifacts",
    stepsDirName: "steps",

    // --- Phase plan note & template ---------------------------------------------------
    planFileNamePrefix: "_plan",            // plan note is named `${planFileNamePrefix}_${phaseNumber}`
                                            // (no extension), e.g. phases/004/_plan_004.md
    planTemplateName: "[T]plan",            // template rendered into the phase plan note
    autoPlanFlag: "__phasePlanAuto",        // window flag telling [T]plan to skip interactive prompts

    // --- Starter notes (filenames without extensions) ------------------------------
    parkingFileName: "parking",
    ideasTemplateName: "[T]ideas",
    initialReflectionFileName: "initial-reflection",
    reflectionTemplateName: "[T]reflections",
    autoCaptureContext: "__phaseCaptureAuto", // exact-path-scoped context shared with capture templates

    // --- Deterministic start/end step notes (created once at phase birth) ----------
    // Content lives in dedicated templates ([T]step-start / [T]step-end) which are
    // hard-guarded against manual invocation; [T]phase.md is the only allowed caller.
    stepStartFileName: "00-start",
    stepEndFileName: "99-end",
    stepStartTemplateName: "[T]step-start",
    stepEndTemplateName: "[T]step-end",

    // --- Phase SSOT copies from internal-templates (plain markdown, no Templater code) ---
    // `_step-template.md` replaces the old runtime extraction of the step template from
    // PLANNING.md: both the LLM flow and [T]step read this per-phase copy.
    stepTemplateFileName: "_step-template",   // created at the phase root
    stepTemplateSourceName: "=step-xx",       // internal template it is copied from
    phasePlaceholder: "|PHASE_NUMBER|",       // substituted with the phase number in the copy
    explorationFileName: "_exploration",      // created inside artifacts/
    explorationSourceName: "=_exploration",   // internal template it is copied from

    // --- _project.md index update ------------------------------------------------
    projectPhasesHeader: "## Phases",       // header under which new phase entries are inserted
    phaseEntryPlaceholder: "UNTITLED_PHASE",
};

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Internal templates live in a subfolder next to the project templates; tp.file.find_tfile
// depends on Templater's configured folders, so fall back to a vault-wide name lookup.
const findInternalTemplate = (name) =>
    tp.file.find_tfile(name) ??
    app.vault.getMarkdownFiles().find(f => f.name === `${name}.md`) ??
    null;
const phaseSubfolders = [
    CFG.reflectionFolderSuffix,
    CFG.ideasDirName,
    CFG.artifactsDirName,
    CFG.stepsDirName,
];

// Create a separate starter note without prompts or opening another tab.
// Exact-path scoping and finally cleanup keep manual capture unaffected, even on failure.
async function createCaptureNote(template, folderPath, fileName) {
    const targetPath = `${folderPath}/${fileName}.md`;
    if (app.vault.getAbstractFileByPath(targetPath)) {
        throw new Error(`Starter note '${targetPath}' already exists; refusing to overwrite it.`);
    }

    const folder = app.vault.getAbstractFileByPath(folderPath);
    if (!folder?.children) {
        throw new Error(`Starter note folder '${folderPath}' was not found.`);
    }

    const previousContext = window[CFG.autoCaptureContext];
    window[CFG.autoCaptureContext] = { targetPath };
    try {
        const createdFile = await tp.file.create_new(template, fileName, false, folder);
        if (!createdFile || createdFile.path !== targetPath) {
            throw new Error(`Could not create starter note '${targetPath}'.`);
        }
        return createdFile;
    } finally {
        if (previousContext === undefined) {
            delete window[CFG.autoCaptureContext];
        } else {
            window[CFG.autoCaptureContext] = previousContext;
        }
    }
}

// Create a note by copying a static internal template verbatim, then applying simple
// string replacements. Internal templates contain no Templater code, so create_new copies
// them as-is and any placeholder substitution happens as a plain post-write edit.
async function createStaticNote(template, folderPath, fileName, replacements) {
    const targetPath = `${folderPath}/${fileName}.md`;
    if (app.vault.getAbstractFileByPath(targetPath)) {
        throw new Error(`Starter note '${targetPath}' already exists; refusing to overwrite it.`);
    }

    const folder = app.vault.getAbstractFileByPath(folderPath);
    if (!folder?.children) {
        throw new Error(`Starter note folder '${folderPath}' was not found.`);
    }

    const createdFile = await tp.file.create_new(template, fileName, false, folder);
    if (!createdFile || createdFile.path !== targetPath) {
        throw new Error(`Could not create starter note '${targetPath}'.`);
    }

    if (replacements && Object.keys(replacements).length > 0) {
        let content = await app.vault.read(createdFile);
        for (const [needle, value] of Object.entries(replacements)) {
            content = content.split(needle).join(value);
        }
        await app.vault.modify(createdFile, content);
    }
    return createdFile;
}

// 0. Safety gate: Only run from a fresh, empty tab to avoid overwriting real notes.
const triggerFile = tp.config.target_file;
let isFreshTab = false;
if (triggerFile && triggerFile.basename.startsWith(CFG.untitledPrefix)) {
    const selfTFile = tp.config.template_file ?? tp.file.find_tfile(CFG.selfTemplateName);
    const selfRaw = selfTFile ? await app.vault.read(selfTFile) : null;
    const hostRaw = await app.vault.read(triggerFile);
    isFreshTab = hostRaw.trim() === "" || (selfRaw !== null && hostRaw === selfRaw);
}

if (!isFreshTab) {
    new Notice(`Run ${CFG.selfTemplateName} from a fresh tab (Ctrl+N) — that tab becomes the phase plan.`);
    return;
}

// 1. Find the project note in the vault
const projectFiles = app.vault.getMarkdownFiles()
    .filter(f => f.name === CFG.projectFileName);

if (projectFiles.length === 0) {
    new Notice(`No '${CFG.projectFileName}' found in vault!`);
    return;
}

// If multiple projects exist, prompt user to select one; otherwise auto-select
let selectedProjectFile = projectFiles[0];
if (projectFiles.length > 1) {
    selectedProjectFile = await tp.system.suggester(
        projectFiles.map(f => f.parent ? f.parent.path : f.path),
        projectFiles,
        false,
        CFG.promptSelectProject
    );
    if (!selectedProjectFile) return;
}

const projectRoot = selectedProjectFile.parent ? selectedProjectFile.parent.path : "";
const phasesDirPath = projectRoot ? `${projectRoot}/${CFG.phasesDirName}` : CFG.phasesDirName;

// 2. Scan existing phases to find the highest number, then suggest the next (e.g. 003 -> 004)
const allFolders = app.vault.getAllLoadedFiles().filter(f => f.children);
const phaseFolders = allFolders
    .filter(f => f.path.startsWith(phasesDirPath) && f.path !== phasesDirPath && f.parent && f.parent.path === phasesDirPath);

let highestNum = 0;
phaseFolders.forEach(folder => {
    const num = parseInt(folder.name, 10);
    if (!isNaN(num) && num > highestNum) highestNum = num;
});
const nextPhaseSuggested = String(highestNum + 1).padStart(CFG.phaseNumberDigits, "0");

// 3. Prompt user for phase number (defaults to the suggested number)
const inputNum = await tp.system.prompt(`Enter Phase Number (${CFG.phaseNumberDigits} digits):`, nextPhaseSuggested);
if (!inputNum) return;

const phaseNumber = inputNum.trim().padStart(CFG.phaseNumberDigits, "0");
// Plan note name embeds the phase number so plan titles stay unique vault-wide.
const planNoteName = `${CFG.planFileNamePrefix}_${phaseNumber}`;
const targetPhaseDir = `${phasesDirPath}/${phaseNumber}`;
const existingFolderObj = app.vault.getAbstractFileByPath(targetPhaseDir);

// Validate all required templates before creating a phase with missing starter notes.
const planTemplate = tp.file.find_tfile(CFG.planTemplateName);
const ideasTemplate = tp.file.find_tfile(CFG.ideasTemplateName);
const reflectionTemplate = tp.file.find_tfile(CFG.reflectionTemplateName);
const stepStartTemplate = tp.file.find_tfile(CFG.stepStartTemplateName);
const stepEndTemplate = tp.file.find_tfile(CFG.stepEndTemplateName);
const stepTemplateSource = findInternalTemplate(CFG.stepTemplateSourceName);
const explorationSource = findInternalTemplate(CFG.explorationSourceName);
for (const [name, template] of [
    [CFG.planTemplateName, planTemplate],
    [CFG.ideasTemplateName, ideasTemplate],
    [CFG.reflectionTemplateName, reflectionTemplate],
    [CFG.stepStartTemplateName, stepStartTemplate],
    [CFG.stepEndTemplateName, stepEndTemplate],
    [CFG.stepTemplateSourceName, stepTemplateSource],
    [CFG.explorationSourceName, explorationSource],
]) {
    if (!template) {
        new Notice(`Template '${name}' not found!`);
        return;
    }
}

// 4. Folder collision check: abort if the folder exists and already has files
if (existingFolderObj) {
    if (existingFolderObj.children && existingFolderObj.children.length > 0) {
        new Notice(`Phase ${phaseNumber} already exists and contains files! Aborted.`);
        return;
    }
} else {
    await app.vault.createFolder(targetPhaseDir);
}

// 5. Ensure standard phase subfolders exist before creating their starter notes.
for (const sub of phaseSubfolders) {
    const subPath = `${targetPhaseDir}/${sub}`;
    if (!app.vault.getAbstractFileByPath(subPath)) {
        await app.vault.createFolder(subPath);
    }
}

// 6. Required templates were resolved above before folder creation.

// 7. Move current blank tab to <phase>/_plan_<NNN>, then render the plan template into it.
//    window[autoPlanFlag] tells the plan template to skip interactive prompts.
await tp.file.move(`${targetPhaseDir}/${planNoteName}`);
window[CFG.autoPlanFlag] = true;
let finalOutput;
try {
    finalOutput = await tp.file.include(planTemplate);
} finally {
    window[CFG.autoPlanFlag] = false;
}

// 8. Insert new phase link under the configured header in _project.md.
//    The regex consumes any existing empty lines under the header so spacing never grows.
try {
    const projectContent = await app.vault.read(selectedProjectFile);
    // Entry inserted into _project.md — relative link is written from the project root.
    const newPhaseEntry = `### Phase ${phaseNumber} - ${CFG.phaseEntryPlaceholder} [open](./${CFG.phasesDirName}/${phaseNumber}/${planNoteName}.md)`;

    if (!projectContent.includes(newPhaseEntry)) {
        // Matches the header line plus any following empty lines
        const phasesHeaderRegex = new RegExp(
            `(${escapeRegExp(CFG.projectPhasesHeader)}[ \\t]*\\r?\\n)(?:\\r?\\n)*`,
            "i"
        );

        if (phasesHeaderRegex.test(projectContent)) {
            // $1 is the header line, followed by 1 blank line (\n), then the entry and \n
            const updatedProjectContent = projectContent.replace(
                phasesHeaderRegex,
                `$1\n${newPhaseEntry}\n\n`
            );
            await app.vault.modify(selectedProjectFile, updatedProjectContent);
        }
    }
} catch (err) {
    console.error(`Failed to auto-update ${CFG.projectFileName}:`, err);
}

// 9. Create starter notes, then the deterministic start/end step notes, then the phase's
// SSOT copies (_step-template.md at the phase root and artifacts/_exploration.md).
// Start/end steps are born with the phase and are never created manually or by an LLM.
// A child failure must not prevent the rendered plan from being written to the starting note.
let initialReflectionFile;
try {
    await createCaptureNote(
        ideasTemplate,
        `${targetPhaseDir}/${CFG.ideasDirName}`,
        CFG.parkingFileName
    );
    initialReflectionFile = await createCaptureNote(
        reflectionTemplate,
        `${targetPhaseDir}/${CFG.reflectionFolderSuffix}`,
        CFG.initialReflectionFileName
    );
    await createCaptureNote(
        stepStartTemplate,
        `${targetPhaseDir}/${CFG.stepsDirName}`,
        CFG.stepStartFileName
    );
    await createCaptureNote(
        stepEndTemplate,
        `${targetPhaseDir}/${CFG.stepsDirName}`,
        CFG.stepEndFileName
    );
    await createStaticNote(
        stepTemplateSource,
        targetPhaseDir,
        CFG.stepTemplateFileName,
        { [CFG.phasePlaceholder]: phaseNumber }
    );
    await createStaticNote(
        explorationSource,
        `${targetPhaseDir}/${CFG.artifactsDirName}`,
        CFG.explorationFileName
    );
} catch (err) {
    console.error(`Failed to create starter notes for phase ${phaseNumber}:`, err);
    new Notice(`Phase ${phaseNumber} was only partially created. Check its folders and the console before retrying.`);
}

if (initialReflectionFile) {
    new Notice(`Phase ${phaseNumber} created successfully!`);
}
-%><% finalOutput %>



