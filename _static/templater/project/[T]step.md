<%*
// ================================================================
// TEMPLATE: Execution Step Note Generator
//
// LLM RULE:
// DON'T USE <> TAGS in comments. It breaks further rendering of markdown in obsidian.
//
// WHAT THIS DOES:
// Creates a new execution step note inside a phase's "steps/" folder.
//
// SINGLE SOURCE OF TRUTH (SSOT):
// The step note content is NOT hardcoded here and PLANNING.md is NO LONGER parsed.
// It is read from the phase's own `_step-template.md` file, which the phase creation
// script ([T]phase.md) copies from the internal template `=step-xx` with the phase
// number already substituted. The LLM flow reads the very same file, so both
// creation paths (manual Templater / LLM) can never drift apart.
// The template is copied VERBATIM, including its frontmatter (status/state/reviewedAtStep)
// and all fill-in markers (|TEXT|, |TASK_NUMBER|, ...). This template adds nothing.
//
// HOW IT WORKS:
// 1. Prompts you to pick the Project and the Phase.
//    (No auto-mode: this template always needs project/phase context. LLM-created
//    steps bypass Templater entirely by design.)
// 2. Reads the phase's `_step-template.md`. If it is missing (e.g. the phase was
//    created before this flow existed), it is recreated once from the internal
//    template `=step-xx` so the phase stays self-contained going forward.
// 3. Safety net: substitutes |PHASE_NUMBER| if the copy still contains it.
// 4. Ensures the "steps/" folder exists in that phase.
// 5. Finds a safe unique name (untitled_step, untitled_step_2, etc.).
// 6. Moves the file to phases/NNN/steps/ and triggers the inline title rename box.
// ================================================================

// ================================================================
// 0. CONFIG — the single place to adjust names / paths / prompts.
//    NOTE: Other templates have their own CFG block; if a SHARED value changes
//    (projectFileName, phasesDirName, stepsDirName, ...), update it there as well.
// ================================================================
const CFG = {
    // --- Project & phase discovery -------------------------------------------
    projectFileName: "_project.md",
    promptSelectProject: "Select Project:",
    phasesDirName: "phases",
    promptSelectPhase: "Select Phase:",

    // --- SSOT step template -------------------------------------------------------
    stepTemplateFileName: "_step-template",  // per-phase copy created by [T]phase.md
    stepTemplateSourceName: "=step-xx",      // internal template used as fallback source
    phasePlaceholder: "|PHASE_NUMBER|",      // substituted with the selected phase number if still present

    // --- Target folder ------------------------------------------------------------
    stepsDirName: "steps",

    // --- Default note naming (collision-safe: "..._2", "..._3", ...) ----------------
    defaultNoteName: "untitled_step",
    counterSeparator: "_",

    // --- UX / environment --------------------------------------------------------------
    titleEditCommand: "workspace:edit-file-title",
    titleEditDelayMs: 200,
};

// Internal templates live in a subfolder next to the project templates; tp.file.find_tfile
// depends on Templater's configured folders, so fall back to a vault-wide name lookup.
const findInternalTemplate = (name) =>
    tp.file.find_tfile(name) ??
    app.vault.getMarkdownFiles().find(f => f.name === `${name}.md`) ??
    null;

// ================================================================
// 1. Select Project (auto-select if only 1 project exists)
// ================================================================
const projectFiles = app.vault.getMarkdownFiles()
    .filter(f => f.name === CFG.projectFileName);

if (projectFiles.length === 0) {
    new Notice(`No '${CFG.projectFileName}' found in vault!`);
    return;
}

let selectedProjectFile = projectFiles[0];
if (projectFiles.length > 1) {
    selectedProjectFile = await tp.system.suggester(
        projectFiles.map(f => f.parent ? f.parent.path : f.path),
        projectFiles,
        false,
        CFG.promptSelectProject
    );
    if (!selectedProjectFile) return; // User pressed Escape
}

const projectRoot = selectedProjectFile.parent ? selectedProjectFile.parent.path : "";
const phasesDirPath = projectRoot ? `${projectRoot}/${CFG.phasesDirName}` : CFG.phasesDirName;

// ================================================================
// 2. Select Phase (newest first, e.g. 004, 003, ...)
// ================================================================
const allFolders = app.vault.getAllLoadedFiles().filter(f => f.children);
const phaseFolders = allFolders
    .filter(f => f.path.startsWith(phasesDirPath) && f.path !== phasesDirPath && f.parent && f.parent.path === phasesDirPath)
    .sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));

if (phaseFolders.length === 0) {
    new Notice(`No phases found under ${phasesDirPath}!`);
    return;
}

const selectedPhase = await tp.system.suggester(
    phaseFolders.map(f => f.name),
    phaseFolders,
    false,
    CFG.promptSelectPhase
);
if (!selectedPhase) return;

// ================================================================
// 3. Read the phase's _step-template.md — SSOT for step content
// ================================================================
const stepTemplatePath = `${selectedPhase.path}/${CFG.stepTemplateFileName}.md`;
let stepTemplateFile = app.vault.getAbstractFileByPath(stepTemplatePath);

if (!stepTemplateFile) {
    // Phases created before this flow (or manually) lack the copy — recreate it once
    // from the internal template so the phase stays self-contained going forward.
    const stepTemplateSource = findInternalTemplate(CFG.stepTemplateSourceName);
    if (!stepTemplateSource) {
        new Notice(`'${CFG.stepTemplateFileName}.md' not found in '${selectedPhase.path}' and internal template '${CFG.stepTemplateSourceName}' not found! Aborted.`);
        return;
    }
    let sourceContent = await app.vault.read(stepTemplateSource);
    sourceContent = sourceContent.split(CFG.phasePlaceholder).join(selectedPhase.name);
    await app.vault.create(stepTemplatePath, sourceContent);
    stepTemplateFile = app.vault.getAbstractFileByPath(stepTemplatePath);
    if (!stepTemplateFile) {
        new Notice(`Could not create '${stepTemplatePath}'! Aborted.`);
        return;
    }
}

const stepNote = await app.vault.read(stepTemplateFile);

// Safety net: a copy may still carry the placeholder (e.g. created before the
// substitution existed) — resolve it so the backlink always points at the real plan.
if (stepNote.includes(CFG.phasePlaceholder)) {
    stepNote = stepNote.split(CFG.phasePlaceholder).join(selectedPhase.name);
}

// ================================================================
// 5. Ensure target 'steps' folder exists
// ================================================================
const stepsPath = `${selectedPhase.path}/${CFG.stepsDirName}`;
if (!app.vault.getAbstractFileByPath(stepsPath)) {
    await app.vault.createFolder(stepsPath);
}

// ================================================================
// 6. Collision-safe default name (e.g. untitled_step, untitled_step_2)
// ================================================================
let finalName = CFG.defaultNoteName;
let counter = 1;
while (app.vault.getAbstractFileByPath(`${stepsPath}/${finalName}.md`)) {
    counter++;
    finalName = `${CFG.defaultNoteName}${CFG.counterSeparator}${counter}`;
}

// ================================================================
// 7. Move file into place, then focus the title for editing
// ================================================================
await tp.file.move(`${stepsPath}/${finalName}`);

setTimeout(() => {
    app.commands.executeCommandById(CFG.titleEditCommand);
}, CFG.titleEditDelayMs);
-%>
<% stepNote %>
