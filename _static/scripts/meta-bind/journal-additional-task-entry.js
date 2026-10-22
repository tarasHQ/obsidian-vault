const editor = app.workspace.activeEditor?.editor;
if (!editor) return;

const pos = context.buttonContext?.position;
if (!pos) {
  new Notice("Button position not found");
  return;
}
const text = `\t- [ ] `;

// Insert one line after the button (lineEnd is the last line of the code block)
const insertLine = pos.lineEnd + 2;
const insertPos = { line: insertLine, ch: 0 };
editor.replaceRange(text + "\n", insertPos);

// Cursor on the empty child bullet
const cursorPos = { line: insertLine, ch: 3 };
editor.setCursor(cursorPos);
editor.focus();