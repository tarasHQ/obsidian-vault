// Remove the first top-level time-log bullet and its indented children.
const editor = app.workspace.activeEditor?.editor;
if (!editor) {
  new Notice("No active editor found");
  return;
}

const buttonId = "journal-remove-last-entry";
const groupLines = [];
for (let line = 0; line < editor.lineCount(); line++) {
  const groups = editor.getLine(line).matchAll(/`BUTTON\[([^\]]+)\]`/g);
  for (const group of groups) {
    if (group[1].split(",").some((id) => id.trim() === buttonId)) {
      groupLines.push(line);
    }
  }
}
if (groupLines.length !== 1) {
  new Notice(`Expected one button group containing ${buttonId}; found ${groupLines.length}`);
  return;
}

const sectionBoundary = /^\s{0,3}(?:#{1,6}\s|(?:---+|\*\*\*+|___+)\s*$)/;
let start = -1;
for (let line = groupLines[0] + 1; line < editor.lineCount(); line++) {
  const text = editor.getLine(line);
  if (/^-(?:\s|$)/.test(text)) {
    start = line;
    break;
  }
  if (sectionBoundary.test(text)) break;
}
if (start === -1 || /^-\s*$/.test(editor.getLine(start))) {
  new Notice("No time log entry to remove");
  return;
}

// Blank lines are included only when followed by another indented child.
let end = start;
for (let line = start + 1; line < editor.lineCount(); line++) {
  const text = editor.getLine(line);
  if (/^\s*$/.test(text)) continue;
  if (/^(?:\t| {2,})\S/.test(text)) {
    end = line;
    continue;
  }
  break;
}

// Preserve an anchor for the existing entry buttons when this was the last bullet.
let anotherBullet = false;
for (let line = end + 1; line < editor.lineCount(); line++) {
  const text = editor.getLine(line);
  if (/^-(?:\s|$)/.test(text)) {
    anotherBullet = true;
    break;
  }
  if (sectionBoundary.test(text)) break;
}

if (end + 1 < editor.lineCount()) {
  editor.replaceRange(anotherBullet ? "" : "- \n", { line: start, ch: 0 }, { line: end + 1, ch: 0 });
} else {
  editor.replaceRange(anotherBullet ? "" : "- ", { line: start, ch: 0 }, {
    line: end,
    ch: editor.getLine(end).length,
  });
}
editor.focus();
