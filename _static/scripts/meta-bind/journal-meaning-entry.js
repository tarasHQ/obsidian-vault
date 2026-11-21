// Prompt for meaning and pride before adding a timestamped journal entry.
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
const meaningEmojis = ["⚫", "🔴", "🟡", "🟢", "🌟"];
const prideChoices = [
  { emoji: "👑", label: "Prideful" },
  { emoji: "🤷‍♂️", label: "Unsure" },
  { emoji: "🙏", label: "Humble" },
];

// Capture the visible button before the modal takes focus.
const viewEl = app.workspace.activeLeaf?.view?.containerEl;
const buttonCandidates = viewEl
  ? Array.from(viewEl.querySelectorAll(".mb-button-inner")).filter((element) =>
      element.textContent.trim() === "Awareness Check" && element.getClientRects().length > 0
    )
  : [];
const buttonRect = buttonCandidates.length === 1
  ? buttonCandidates[0].getBoundingClientRect()
  : null;

// A custom modal keeps the question and choices compact and centered.
const selection = await new Promise((resolve) => {
  class AwarenessModal extends obsidian.Modal {
    onOpen() {
      this.modalEl.style.width = "fit-content";
      this.modalEl.style.maxWidth = "calc(100vw - 16px)";
      this.modalEl.style.padding = "12px";
      this.modalEl.style.paddingTop = "6px";
      this.contentEl.style.padding = "0";
      // The backdrop and Escape already dismiss the modal, so save the header space.
      const closeButton = this.modalEl.querySelector(".modal-header-button.mod-raised.clickable-icon");
      if (closeButton) closeButton.style.display = "none";

      const selected = { meaning: null, pride: null };
      const addRow = (questionText, key, options) => {
        const question = this.contentEl.createEl("h2", { text: questionText });
        question.style.textAlign = "center";
        question.style.margin = key === "meaning" ? "0 0 12px" : "16px 0 12px";
        question.style.padding = "0";
        question.style.fontSize = "1em";

        const choices = this.contentEl.createDiv();
        choices.style.display = "flex";
        choices.style.justifyContent = "center";
        choices.style.flexWrap = "wrap";
        choices.style.gap = "12px";

        const buttons = options.map((option) => {
          const button = choices.createEl("button", { text: option.emoji });
          button.style.fontSize = "1.3em";
          button.style.padding = "4px 8px";
          button.setAttribute("aria-label", option.label);
          button.setAttribute("title", option.label);
          button.setAttribute("aria-pressed", "false");
          button.addEventListener("click", () => {
            selected[key] = option.emoji;
            buttons.forEach((other) => {
              const isSelected = other === button;
              other.setAttribute("aria-pressed", String(isSelected));
              other.style.outline = isSelected ? "2px solid var(--interactive-accent)" : "";
              other.style.outlineOffset = isSelected ? "2px" : "";
            });
            if (selected.meaning !== null && selected.pride !== null) {
              resolve({ ...selected });
              this.close();
            }
          });
          return button;
        });
      };

      addRow("Are you doing something wrong?", "meaning", meaningEmojis.map((emoji) => ({
        emoji,
        label: emoji,
      })));
      addRow("Are you prideful?", "pride", prideChoices);

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

  new AwarenessModal(app).open();
});

// Dismissal or an incomplete selection must not insert anything.
if (!selection) return;
if (
  !meaningEmojis.includes(selection.meaning) ||
  !prideChoices.some((choice) => choice.emoji === selection.pride)
) {
  new Notice("Invalid awareness selection; entry was not inserted");
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
const text = `- ###### ${now} | MEANING:${selection.meaning} | PRIDE:${selection.pride}\n\t- `;

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
