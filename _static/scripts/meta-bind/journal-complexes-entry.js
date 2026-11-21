// Insert a timestamped time-log entry for one selected voice.
const editor = app.workspace.activeEditor?.editor;
const file = app.workspace.getActiveFile();
if (!editor || !file) {
  new Notice("No active editor or file found");
  return;
}

const buttonId = "journal-complexes";
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

// Reveal the time log, as the other journal buttons do.
for (let line = groupLines[0] - 1; line >= 0; line--) {
  if (/^##\s+TIME LOG\s*$/i.test(editor.getLine(line))) {
    editor.scrollIntoView({ from: { line, ch: 0 }, to: { line, ch: 0 } }, false);
    const cm = editor.cm;
    const scroller = cm?.scrollDOM;
    const coords = cm?.coordsAtPos(cm.state.doc.line(line + 1).from);
    if (scroller && coords) {
      scroller.scrollTop += coords.top - scroller.getBoundingClientRect().top;
    }
    break;
  }
}

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

const originalContent = editor.getValue();
// Capture the visible button before the modal takes focus.
const viewEl = app.workspace.activeLeaf?.view?.containerEl;
const buttonCandidates = viewEl
  ? Array.from(viewEl.querySelectorAll(".mb-button-inner")).filter((element) =>
      element.textContent.trim() === "Complexes Talk" && element.getClientRects().length > 0
    )
  : [];
const buttonRect = buttonCandidates.length === 1
  ? buttonCandidates[0].getBoundingClientRect()
  : null;

const voices = [
  "🕸️ The Devouring Mother",
  "🪁 The Puer Aeternus",
  "🪦 The Sick Théoden",
];

const voice = await new Promise((resolve) => {
  class ComplexesModal extends obsidian.Modal {
    onOpen() {
      this.modalEl.style.width = "fit-content";
      this.modalEl.style.maxWidth = "calc(100vw - 16px)";
      this.modalEl.style.padding = "12px";
      this.modalEl.style.paddingTop = "6px";
      this.contentEl.style.padding = "0";
      const closeButton = this.modalEl.querySelector(".modal-header-button.mod-raised.clickable-icon");
      if (closeButton) closeButton.style.display = "none";
      const heading = this.contentEl.createEl("h2", { text: "Choose a voice" });
      heading.style.textAlign = "center";
      heading.style.margin = "0 0 12px";
      heading.style.padding = "0";
      heading.style.fontSize = "1em";

      const choices = this.contentEl.createDiv();
      choices.style.display = "flex";
      choices.style.flexDirection = "column";
      choices.style.gap = "8px";
      voices.forEach((name) => {
        const button = choices.createEl("button", { text: name });
        button.addEventListener("click", () => {
          resolve(name);
          this.close();
        });
      });

      // Prefer above the button, falling below if there is not enough room.
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

      const win = this.modalEl.ownerDocument.defaultView;
      if (win && !win.matchMedia("(prefers-reduced-motion: reduce)").matches && this.modalEl.animate) {
        this.modalEl.animate(
          [
            { opacity: 0, transform: "translateY(6px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 180, easing: "ease-out" }
        );
      }
    }

    onClose() {
      this.contentEl.empty();
      resolve(undefined);
    }
  }
  new ComplexesModal(app).open();
});

if (!voice) return;
if (!voices.includes(voice)) {
  new Notice("Invalid voice; entry was not inserted");
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
const text = `- ###### ${now}\n\t- ${voice}:\n\t\t- `;
const anchor = editor.getLine(insertLine);
if (/^-\s*$/.test(anchor)) {
  editor.replaceRange(text, { line: insertLine, ch: 0 }, {
    line: insertLine,
    ch: anchor.length,
  });
} else {
  editor.replaceRange(`${text}\n`, { line: insertLine, ch: 0 });
}
editor.setCursor({ line: insertLine + 2, ch: 4 });
editor.focus();
