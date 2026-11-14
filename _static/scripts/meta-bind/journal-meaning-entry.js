// Prompt for a meaning score before adding a timestamped journal entry.
const editor = app.workspace.activeEditor?.editor;
const file = app.workspace.getActiveFile();

if (!editor || !file) {
  new Notice("No active editor or file found");
  return;
}

// Inline button groups do not reliably provide a document position.
const buttonId = "journal-meaning";
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

// Reveal the nearest TIME LOG heading before opening the prompt.
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

// A line position is not a persistent anchor if the document changes.
const originalContent = editor.getValue();
const emojis = ["⚫", "🔴", "🟡", "🟢", "🌟"];

// Capture the visible button before the modal takes focus.
const viewEl = app.workspace.activeLeaf?.view?.containerEl;
const buttonCandidates = viewEl
  ? Array.from(viewEl.querySelectorAll(".mb-button-inner")).filter((element) =>
      element.textContent.trim() === "Meaning Check" && element.getClientRects().length > 0
    )
  : [];
const buttonRect = buttonCandidates.length === 1
  ? buttonCandidates[0].getBoundingClientRect()
  : null;

// A custom modal keeps the question and choices compact and centered.
const score = await new Promise((resolve) => {
  class MeaningModal extends obsidian.Modal {
    onOpen() {
      this.modalEl.style.width = "fit-content";
      this.modalEl.style.maxWidth = "calc(100vw - 16px)";
      this.modalEl.style.padding = "12px";
      this.modalEl.style.paddingTop = "6px";
      this.contentEl.style.padding = "0";
      // The backdrop and Escape already dismiss the modal, so save the header space.
      const closeButton = this.modalEl.querySelector(".modal-header-button.mod-raised.clickable-icon");
      if (closeButton) closeButton.style.display = "none";

      const question = this.contentEl.createEl("h2", {
        text: "Are you doing something wrong?",
      });
      question.style.textAlign = "center";
      question.style.margin = "0 0 12px";
      question.style.padding = "0";
      question.style.fontSize = "1em";

      const choices = this.contentEl.createDiv();
      choices.style.display = "flex";
      choices.style.justifyContent = "center";
      choices.style.flexWrap = "wrap";
      choices.style.gap = "12px";

      emojis.forEach((emoji, index) => {
        const button = choices.createEl("button", { text: emoji });
        button.style.fontSize = "1.3em";
        button.style.padding = "4px 8px";
        button.addEventListener("click", () => {
          resolve(index);
          this.close();
        });
      });

      // Keep the popup near the button without letting it leave the window.
      if (buttonRect) {
        const win = this.modalEl.ownerDocument.defaultView;
        const modalRect = this.modalEl.getBoundingClientRect();
        const margin = 8;
        const below = buttonRect.bottom + margin;
        const above = buttonRect.top - modalRect.height - margin;
        const top = above >= margin ? above : below;
        const left = buttonRect.left + buttonRect.width / 2 - modalRect.width / 2;
        this.modalEl.style.position = "fixed";
        this.modalEl.style.left = `${Math.max(margin, Math.min(left, win.innerWidth - modalRect.width - margin))}px`;
        this.modalEl.style.top = `${Math.max(margin, Math.min(top, win.innerHeight - modalRect.height - margin))}px`;
        this.modalEl.style.margin = "0";
      }
    }

    onClose() {
      this.contentEl.empty();
      resolve(undefined);
    }
  }

  new MeaningModal(app).open();
});

// Dismissal must not insert anything; index zero is the first choice.
if (score === undefined || score === null) return;
if (!Number.isInteger(score) || score < 0 || score >= emojis.length) {
  new Notice("Invalid meaning score; entry was not inserted");
  return;
}

if (
  app.workspace.activeEditor?.editor !== editor ||
  app.workspace.getActiveFile() !== file ||
  editor.getValue() !== originalContent
) {
  new Notice("The note or active editor changed; entry was not inserted");
  return;
}

const now = window.moment().format("HH:mm");
const text = `- ###### ${now} | MEANING: ${emojis[score]}\n\t- `;

// Replace an empty placeholder; preserve existing entries below new ones.
const anchor = editor.getLine(insertLine);
if (/^-\s*$/.test(anchor)) {
  editor.replaceRange(text, { line: insertLine, ch: 0 }, {
    line: insertLine,
    ch: anchor.length,
  });
} else {
  editor.replaceRange(`${text}\n`, { line: insertLine, ch: 0 });
}

editor.setCursor({ line: insertLine + 1, ch: 3 });
editor.focus();
