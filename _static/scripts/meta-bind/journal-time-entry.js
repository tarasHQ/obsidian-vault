// Add a timestamped entry beneath the shared inline journal buttons.
const editor = app.workspace.activeEditor?.editor;
if (!editor) {
  new Notice("No active editor found");
  return;
}

// Inline button groups do not reliably provide a document position.
const buttonId = "journal-time";
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

// Reveal the nearest TIME LOG heading before adding the entry.
for (let line = groupLines[0] - 1; line >= 0; line--) {
  if (/^##\s+TIME LOG\s*$/i.test(editor.getLine(line))) {
    editor.scrollIntoView({ from: { line, ch: 0 }, to: { line, ch: 0 } }, false);
    // CodeMirror's scroll container allows top alignment when available.
    const cm = editor.cm;
    const scroller = cm?.scrollDOM;
    const coords = cm?.coordsAtPos(cm.state.doc.line(line + 1).from);
    if (scroller && coords) {
      scroller.scrollTop += coords.top - scroller.getBoundingClientRect().top;
    }
    break;
  }
}

// Find the shared log anchor without crossing into another section.
let insertLine = -1;
for (let line = groupLines[0] + 1; line < editor.lineCount(); line++) {
  const text = editor.getLine(line);
  if (/^-(?:\s|$)/.test(text)) {
    insertLine = line;
    break;
  }
  if (/^\s{0,3}(?:#{1,6}\s|(?:---+|\*\*\*+|___+)\s*$)/.test(text)) break;
}

if (insertLine === -1) {
  new Notice("Time log bullet not found below the button");
  return;
}

const now = window.moment().format("HH:mm");
const text = `- ###### ${now}\n\t- `;
// Replace an empty placeholder; preserve existing entries below new ones.
const anchor = editor.getLine(insertLine);
if (/^-\s*$/.test(anchor)) {
  editor.replaceRange(text, { line: insertLine, ch: 0 }, {
    line: insertLine,
    ch: anchor.length,
  });
} else {
  editor.replaceRange(text + "\n", { line: insertLine, ch: 0 });
}

// Cursor on the empty child bullet
const cursorPos = { line: insertLine + 1, ch: 3 };
editor.setCursor(cursorPos);
editor.focus();