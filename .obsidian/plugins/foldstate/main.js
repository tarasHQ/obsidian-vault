"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => CollapsiblePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var import_language2 = require("@codemirror/language");

// src/fold-extension.ts
var import_view = require("@codemirror/view");
var import_language = require("@codemirror/language");
function iterFoldedRanges(rangeSet, lineAt) {
  const lines = /* @__PURE__ */ new Set();
  if (!rangeSet) return lines;
  const cursor = rangeSet.iter();
  while (cursor.value !== null) {
    lines.add(lineAt(cursor.from).number - 1);
    cursor.next();
  }
  return lines;
}
function getFoldedLines(state) {
  return iterFoldedRanges((0, import_language.foldedRanges)(state), (pos) => state.doc.lineAt(pos));
}
function getFoldRangeMap(state) {
  const map = /* @__PURE__ */ new Map();
  const ranges = (0, import_language.foldedRanges)(state);
  if (!ranges) return map;
  const cursor = ranges.iter();
  while (cursor.value !== null) {
    const lineNum = state.doc.lineAt(cursor.from).number - 1;
    map.set(lineNum, { from: cursor.from, to: cursor.to });
    cursor.next();
  }
  return map;
}
function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const v of a) {
    if (!b.has(v)) return false;
  }
  return true;
}
function buildFoldExtension(onFoldChange) {
  return import_view.ViewPlugin.fromClass(
    class {
      prevFolds = /* @__PURE__ */ new Set();
      update(update) {
        const current = getFoldedLines(update.state);
        if (!setsEqual(current, this.prevFolds)) {
          const added = [...current].filter((l) => !this.prevFolds.has(l));
          const removed = [...this.prevFolds].filter((l) => !current.has(l));
          added.forEach((l) => onFoldChange(l, true));
          removed.forEach((l) => onFoldChange(l, false));
          this.prevFolds = current;
        }
      }
    }
  );
}

// src/hide-extension.ts
var import_view2 = require("@codemirror/view");
var import_state = require("@codemirror/state");
var FOLD_MARKER_RE = /\s*%%\s*fold\s*%%\s*$/;
function buildDecorations(view) {
  const builder = new import_state.RangeSetBuilder();
  const selection = view.state.selection;
  for (const { from, to } of view.visibleRanges) {
    let pos = from;
    while (pos <= to) {
      const line = view.state.doc.lineAt(pos);
      const match = FOLD_MARKER_RE.exec(line.text);
      if (match) {
        const cursorOnLine = selection.ranges.some(
          (r) => r.from >= line.from && r.from <= line.to
        );
        if (!cursorOnLine) {
          const matchFrom = line.from + line.text.length - match[0].length;
          builder.add(matchFrom, line.to, import_view2.Decoration.replace({}));
        }
      }
      pos = line.to + 1;
    }
  }
  return builder.finish();
}
function buildMarkerHideExtension() {
  return import_view2.ViewPlugin.fromClass(
    class {
      decorations;
      constructor(view) {
        this.decorations = buildDecorations(view);
      }
      update(update) {
        if (update.docChanged || update.viewportChanged || update.selectionSet) {
          this.decorations = buildDecorations(update.view);
        }
      }
    },
    { decorations: (v) => v.decorations }
  );
}

// src/marker.ts
var FOLD_MARKER = "%% fold %%";
var FOLD_MARKER_REGEX = /\s*%%\s*fold\s*%%\s*$/;
function hasFoldMarker(line) {
  return FOLD_MARKER_REGEX.test(line);
}
function addFoldMarker(line) {
  if (hasFoldMarker(line)) return line;
  return `${line} ${FOLD_MARKER}`;
}
function removeFoldMarker(line) {
  return line.replace(FOLD_MARKER_REGEX, "");
}
function parseFoldedHeadings(content) {
  const lines = content.split("\n");
  const folded = /* @__PURE__ */ new Set();
  for (let i = 0; i < lines.length; i++) {
    if (hasFoldMarker(lines[i])) {
      folded.add(i);
    }
  }
  return folded;
}
function updateFoldMarker(content, lineIndex, folded) {
  const lines = content.split("\n");
  if (lineIndex < 0 || lineIndex >= lines.length) return content;
  lines[lineIndex] = folded ? addFoldMarker(lines[lineIndex]) : removeFoldMarker(lines[lineIndex]);
  return lines.join("\n");
}

// src/main.ts
var CollapsiblePlugin = class extends import_obsidian.Plugin {
  isSyncing = false;
  onload() {
    this.registerEditorExtension([
      buildFoldExtension((lineNum, folded) => void this.handleFoldChange(lineNum, folded)),
      buildMarkerHideExtension()
    ]);
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        if (!leaf || !(leaf.view instanceof import_obsidian.MarkdownView)) return;
        void this.applyFoldState(leaf.view.file);
      })
    );
    this.registerEvent(
      this.app.vault.on("modify", (abstractFile) => {
        if (!(abstractFile instanceof import_obsidian.TFile)) return;
        void this.syncFoldStateFromFile(abstractFile);
      })
    );
  }
  async handleFoldChange(lineNum, folded) {
    if (this.isSyncing) return;
    const file = this.app.workspace.getActiveFile();
    if (!file) return;
    this.isSyncing = true;
    try {
      await this.app.vault.process(
        file,
        (content) => updateFoldMarker(content, lineNum, folded)
      );
    } finally {
      this.isSyncing = false;
    }
  }
  async syncFoldStateFromFile(file) {
    if (this.isSyncing) return;
    const view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    if (!view || view.file?.path !== file.path) return;
    const cm = view.editor.cm;
    if (!cm) return;
    const content = await this.app.vault.read(file);
    const markedLines = parseFoldedHeadings(content);
    const currentFoldMap = getFoldRangeMap(cm.state);
    const currentLines = new Set(currentFoldMap.keys());
    if (setsEqual(markedLines, currentLines)) return;
    const effects = [];
    for (const lineNum of markedLines) {
      if (!currentLines.has(lineNum)) {
        const line = cm.state.doc.line(lineNum + 1);
        const range = (0, import_language2.foldable)(cm.state, line.from, line.to);
        if (range) effects.push(import_language2.foldEffect.of(range));
      }
    }
    for (const [lineNum, range] of currentFoldMap) {
      if (!markedLines.has(lineNum)) {
        effects.push(import_language2.unfoldEffect.of(range));
      }
    }
    if (effects.length) {
      this.isSyncing = true;
      cm.dispatch({ effects });
      this.isSyncing = false;
    }
  }
  async applyFoldState(file) {
    if (!file || file.extension !== "md") return;
    const content = await this.app.vault.read(file);
    const foldedLines = parseFoldedHeadings(content);
    if (foldedLines.size === 0) return;
    await new Promise((resolve) => setTimeout(resolve, 0));
    const view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    if (!view || view.file?.path !== file.path) return;
    const cm = view.editor.cm;
    if (!cm) return;
    (0, import_language2.ensureSyntaxTree)(cm.state, cm.state.doc.length, 500);
    const effects = [];
    for (const lineNum of foldedLines) {
      const line = cm.state.doc.line(lineNum + 1);
      const range = (0, import_language2.foldable)(cm.state, line.from, line.to);
      if (range) effects.push(import_language2.foldEffect.of(range));
    }
    if (effects.length) {
      this.isSyncing = true;
      cm.dispatch({ effects });
      this.isSyncing = false;
    }
  }
};

/* nosourcemap */