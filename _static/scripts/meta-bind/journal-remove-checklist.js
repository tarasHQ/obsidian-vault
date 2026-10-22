/*
 * Shared Meta Bind action: removes the clicked button and the checklist below it.
 * Supports morning/night bullet headings and legacy checkbox titles.
 * Removes the title and indented children in one undoable edit, preserving following sections.
 * Night only: also removes exactly one empty line followed by an exact "---" line
 * immediately after the final bullet. Other trailing whitespace/separators are preserved.
 * Requires an active editor; invalid button positions or headings leave the note unchanged.
 */

// Remove the clicked Meta Bind button and its following checklist in one undoable edit.
const editor = app.workspace.activeEditor?.editor;
if (!editor) {
    new Notice("Open this note in editing mode to remove a checklist.");
    return;
}

const position = context.buttonContext?.position;
if (!position) {
    new Notice("Button position not found");
    return;
}

const { lineStart, lineEnd } = position;
const lineCount = editor.lineCount();

// Refuse stale or unexpected positions rather than risk deleting unrelated content.
if (
    !Number.isInteger(lineStart) ||
    !Number.isInteger(lineEnd) ||
    lineStart < 0 ||
    lineEnd <= lineStart ||
    lineEnd >= lineCount ||
    !/^ {0,3}`{3,}meta-bind-button\s*$/.test(editor.getLine(lineStart)) ||
    !/^ {0,3}`{3,}\s*$/.test(editor.getLine(lineEnd))
) {
    new Notice("Could not locate this checklist button. Nothing was removed.");
    return;
}

let headingLine = lineEnd + 1;
while (headingLine < lineCount && editor.getLine(headingLine).trim() === "") {
    headingLine++;
}

const heading = headingLine < lineCount ? editor.getLine(headingLine) : "";
// Keep buttons in existing notes working after changing the template's title format.
const headerMatch = heading.match(
    /^[ \t]*-[ \t]+#####[ \t]+(MORNING|NIGHT) CHECKLIST[ \t]*$/,
);
const legacyMatch = heading.match(
    /^[ \t]*-[ \t]+\[[ xX]\][ \t]+\*\*(MORNING|NIGHT) CHECKLIST\*\*[ \t]*$/,
);
const checklistMatch = headerMatch || legacyMatch;
if (!checklistMatch) {
    new Notice(
        "No morning or night checklist found below this button. Nothing was removed.",
    );
    return;
}

// Count tabs as four spaces to support the template's tab-indented child items.
function indentationWidth(line) {
    return line.match(/^[ \t]*/)[0].replace(/\t/g, "    ").length;
}

const headingIndent = indentationWidth(heading);
let lastChecklistLine = headingLine;
let scanLine = headingLine + 1;

// Allow internal blank lines without absorbing whitespace after the checklist.
while (scanLine < lineCount) {
    const line = editor.getLine(scanLine);
    if (line.trim() !== "") {
        if (indentationWidth(line) <= headingIndent) {
            break;
        }
        lastChecklistLine = scanLine;
    }
    scanLine++;
}

let endLine = lastChecklistLine + 1;

// Only night checklists own an exact empty-line + "---" suffix after a bullet.
// Whitespace-only lines, extra blank lines, and spaced separators must be preserved.
if (
    checklistMatch[1] === "NIGHT" &&
    /^[ \t]*-[ \t]+/.test(editor.getLine(lastChecklistLine)) &&
    lastChecklistLine + 2 < lineCount &&
    editor.getLine(lastChecklistLine + 1) === "" &&
    editor.getLine(lastChecklistLine + 2) === "---"
) {
    endLine = lastChecklistLine + 3;
}

const endPosition =
    endLine < lineCount
        ? { line: endLine, ch: 0 }
        : { line: lineCount - 1, ch: editor.getLine(lineCount - 1).length };

editor.replaceRange("", { line: lineStart - 1, ch: 0 }, endPosition);
editor.focus();
