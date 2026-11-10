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

// src/marker.ts
var FOLD_MARKER = "%% fold %%";
var FOLD_MARKER_REGEX = /(?:\s*%%\s*fold\s*%%)+\s*$/;
function isHeadingLine(line) {
  return /^#{1,6}(\s|$)/.test(line);
}
var LIST_ITEM_RE = /^\s*(?:[-*+]|\d+[.)])\s/;
function isPersistableLine(line) {
  return isHeadingLine(line) || LIST_ITEM_RE.test(line);
}
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
function parseMarkedLines(content) {
  const lines = content.split("\n");
  const folded = /* @__PURE__ */ new Set();
  for (let i = 0; i < lines.length; i++) {
    if (isPersistableLine(lines[i]) && hasFoldMarker(lines[i])) {
      folded.add(i);
    }
  }
  return folded;
}
function collectLineEdits(lines, pending) {
  const edits = [];
  for (const [lineNum, folded] of pending) {
    const line = lines[lineNum];
    if (line === void 0 || !isPersistableLine(line)) continue;
    const newLine = folded ? addFoldMarker(line) : removeFoldMarker(line);
    if (newLine === line) continue;
    edits.push({ line: lineNum, text: newLine });
  }
  return edits.sort((a, b) => a.line - b.line);
}

// src/list-outline.ts
function indentation(whitespace) {
  let column = 0;
  for (const char of whitespace) {
    column += char === "	" ? 4 - column % 4 : 1;
  }
  return column;
}
function isStructural(content) {
  const text = removeFoldMarker(content).trim().replace(/^\[[^\]\r\n]\][ \t]+/, "");
  return /^#{1,6}(?:[ \t]+|$)/.test(text) || /^\*\*(?!\s)(?:(?!\*\*).)+?(?<!\s)\*\*$/.test(text) || /^__(?!\s)(?:(?!__).)+?(?<!\s)__$/.test(text);
}
function getOutlineTargets(content, fold) {
  const lines = content.split("\n");
  const nodes = [];
  const stack = [];
  let inFrontmatter = lines[0]?.trim() === "---";
  let fence = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (inFrontmatter) {
      if (i > 0 && /^(?:---|\.\.\.)[ \t]*$/.test(line))
        inFrontmatter = false;
      continue;
    }
    const fenceMatch = /^[ \t]*(`{3,}|~{3,})(.*)$/.exec(line);
    if (fence) {
      if (fenceMatch && fenceMatch[1][0] === fence.char && fenceMatch[1].length >= fence.length && !fenceMatch[2].trim()) {
        fence = null;
      }
      continue;
    }
    if (fenceMatch) {
      const indent2 = indentation(/^[ \t]*/.exec(line)[0]);
      while (stack.length && indent2 <= stack[stack.length - 1].indent)
        stack.pop();
      for (const ancestor of stack) ancestor.hasNestedContent = true;
      fence = { char: fenceMatch[1][0], length: fenceMatch[1].length };
      continue;
    }
    if (!line.trim()) continue;
    const match = /^([ \t]*)(?:[-*+]|\d{1,9}[.)])[ \t]+(.*)$/.exec(line);
    const indent = indentation(/^[ \t]*/.exec(line)[0]);
    while (stack.length && indent <= stack[stack.length - 1].indent)
      stack.pop();
    if (!match) {
      for (const ancestor of stack) ancestor.hasNestedContent = true;
      continue;
    }
    if (!stack.length && indent >= 4) continue;
    const structural = isStructural(match[2]);
    for (const ancestor of stack) {
      ancestor.hasNestedContent = true;
      if (structural) ancestor.hasStructuralDescendant = true;
    }
    const node = {
      line: i,
      indent,
      structural,
      hasNestedContent: false,
      hasStructuralDescendant: false
    };
    nodes.push(node);
    stack.push(node);
  }
  const targets = /* @__PURE__ */ new Map();
  for (const node of nodes) {
    if (!node.structural) continue;
    if (!fold || node.hasStructuralDescendant)
      targets.set(node.line, false);
    else if (node.hasNestedContent) targets.set(node.line, true);
  }
  return targets;
}
function getOutlineEdits(content, targets) {
  return collectLineEdits(content.split("\n"), targets);
}

// src/main.ts
var import_language2 = require("@codemirror/language");

// src/fold-extension.ts
var import_view = require("@codemirror/view");
var import_language = require("@codemirror/language");
function iterFoldedRanges(rangeSet, lineAt) {
  const lines = /* @__PURE__ */ new Set();
  if (!rangeSet) return lines;
  const cursor = rangeSet.iter();
  while (cursor.value !== null) {
    const line = lineAt(cursor.from);
    if (isPersistableLine(line.text)) lines.add(line.number - 1);
    cursor.next();
  }
  return lines;
}
function getFoldedLines(state) {
  return iterFoldedRanges(
    (0, import_language.foldedRanges)(state),
    (pos) => state.doc.lineAt(pos)
  );
}
function getFoldRangeMap(state) {
  const map = /* @__PURE__ */ new Map();
  const ranges = (0, import_language.foldedRanges)(state);
  if (!ranges) return map;
  const cursor = ranges.iter();
  while (cursor.value !== null) {
    const line = state.doc.lineAt(cursor.from);
    if (isPersistableLine(line.text)) {
      map.set(line.number - 1, { from: cursor.from, to: cursor.to });
    }
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
      constructor(view) {
        this.view = view;
      }
      view;
      prevFolds = /* @__PURE__ */ new Set();
      update(update) {
        if (update.docChanged) {
          this.prevFolds = getFoldedLines(update.state);
          return;
        }
        const current = getFoldedLines(update.state);
        if (!setsEqual(current, this.prevFolds)) {
          const added = [...current].filter(
            (l) => !this.prevFolds.has(l)
          );
          const removed = [...this.prevFolds].filter(
            (l) => !current.has(l)
          );
          added.forEach((l) => onFoldChange(this.view, l, true));
          removed.forEach((l) => onFoldChange(this.view, l, false));
          this.prevFolds = current;
        }
      }
    }
  );
}

// src/hide-extension.ts
var import_view2 = require("@codemirror/view");
var import_state = require("@codemirror/state");
var FOLD_MARKER_RE = /(?:\s*%%\s*fold\s*%%)+\s*$/;
function buildDecorations(view) {
  const builder = new import_state.RangeSetBuilder();
  const selection = view.state.selection;
  for (const { from, to } of view.visibleRanges) {
    let pos = from;
    while (pos <= to) {
      const line = view.state.doc.lineAt(pos);
      const match = FOLD_MARKER_RE.exec(line.text);
      if (match) {
        const matchFrom = line.from + line.text.length - match[0].length;
        const markerStart = matchFrom + match[0].indexOf("%%");
        const cursorInMarker = selection.ranges.some(
          (r) => r.head >= markerStart && r.head <= line.to
        );
        if (!cursorInMarker) {
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

// src/main.ts
var EDITOR_CHANGE_DEBOUNCE_MS = 300;
var STALE_RETRY_DELAYS_MS = [500, 1e3, 2e3];
function getCm(editor) {
  const cm = editor?.cm;
  return cm ?? null;
}
var CollapsiblePlugin = class extends import_obsidian.Plugin {
  isSyncing = false;
  /** Per-view pending marker edits, keyed by the editor they belong to. */
  pendingByView = /* @__PURE__ */ new WeakMap();
  /** Debounce timers for editor-change reconciles, keyed by editor. */
  reconcileTimers = /* @__PURE__ */ new WeakMap();
  onload() {
    this.addCommand({
      id: "fold-list-outline",
      name: "Fold list outline",
      editorCallback: (editor) => {
        const cm = getCm(editor);
        if (cm) this.applyListOutline(cm, true);
      }
    });
    this.addCommand({
      id: "unfold-list-outline",
      name: "Unfold list outline",
      editorCallback: (editor) => {
        const cm = getCm(editor);
        if (cm) this.applyListOutline(cm, false);
      }
    });
    this.registerEditorExtension([
      buildFoldExtension(
        (view, lineNum, folded) => this.handleFoldChange(view, lineNum, folded)
      ),
      buildMarkerHideExtension()
    ]);
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        if (!leaf || !(leaf.view instanceof import_obsidian.MarkdownView)) return;
        void this.applyFoldState(leaf.view.file);
      })
    );
    this.registerEvent(
      this.app.workspace.on("editor-change", (editor) => {
        if (this.isSyncing) return;
        const cm = getCm(editor);
        if (!cm) return;
        this.scheduleReconcile(cm, EDITOR_CHANGE_DEBOUNCE_MS);
      })
    );
    this.registerEvent(
      this.app.vault.on("modify", (abstractFile) => {
        if (!(abstractFile instanceof import_obsidian.TFile)) return;
        if (abstractFile.extension !== "md") return;
        void this.syncFoldStateFromFile(abstractFile);
      })
    );
  }
  /** Update only outline markers, then reconcile those lines immediately. */
  applyListOutline(cm, fold) {
    this.flushPendingEdits(cm);
    const doc = cm.state.doc;
    const content = doc.toString();
    const targets = getOutlineTargets(content, fold);
    const edits = getOutlineEdits(content, targets);
    if (edits.length) {
      cm.dispatch({
        changes: edits.map(({ line, text }) => {
          const current = doc.line(line + 1);
          return { from: current.from, to: current.to, insert: text };
        })
      });
    }
    (0, import_language2.ensureSyntaxTree)(cm.state, cm.state.doc.length, 500);
    this.reconcileEditor(cm, new Set(targets.keys()));
  }
  /** Debounced reconcile for one editor; later calls reset the timer. */
  scheduleReconcile(cm, delayMs) {
    const prev = this.reconcileTimers.get(cm);
    if (prev !== void 0) window.clearTimeout(prev);
    const timer = window.setTimeout(() => {
      this.reconcileTimers.delete(cm);
      this.reconcileEditor(cm);
    }, delayMs);
    this.reconcileTimers.set(cm, timer);
  }
  /**
   * Makes the editor's folds match the markers in the editor's own buffer.
   *
   * Both sides come from the same document, so this is immune to line
   * shifts caused by inserting text above a folded line — the marker
   * travels with its line in the buffer. (The previous implementation
   * compared marker line numbers parsed from the on-disk file against fold
   * line numbers from the live buffer; whenever those two snapshots
   * disagreed — stale buffer, unsaved local edits — correctly-folded lines
   * were unfolded, and the fold extension then deleted the matching
   * markers from the file, making the loss permanent.)
   *
   * When the buffer is stale relative to disk this is a harmless no-op,
   * which is what makes the retry-based fallback below safe.
   */
  reconcileEditor(cm, onlyLines) {
    if (this.isSyncing) return;
    const markedLines = parseMarkedLines(cm.state.doc.toString());
    const currentFoldMap = getFoldRangeMap(cm.state);
    const currentLines = new Set(currentFoldMap.keys());
    if (setsEqual(markedLines, currentLines)) return;
    const effects = [];
    for (const lineNum of markedLines) {
      if ((!onlyLines || onlyLines.has(lineNum)) && !currentLines.has(lineNum)) {
        const line = cm.state.doc.line(lineNum + 1);
        const range = (0, import_language2.foldable)(cm.state, line.from, line.to);
        if (range) effects.push(import_language2.foldEffect.of(range));
      }
    }
    for (const [lineNum, range] of currentFoldMap) {
      if ((!onlyLines || onlyLines.has(lineNum)) && !markedLines.has(lineNum)) {
        effects.push(import_language2.unfoldEffect.of(range));
      }
    }
    if (effects.length) {
      this.isSyncing = true;
      cm.dispatch({ effects });
      this.isSyncing = false;
    }
  }
  /**
   * Fallback reconcile path triggered by vault.on("modify").
   *
   * Reads the file only to answer one question: has the external change
   * reached the open editor's buffer yet? Until it has, reconciliation is
   * skipped (a stale-buffer reconcile would be a no-op anyway, but the
   * disk read is cheap and the retries are bounded). Once disk and buffer
   * agree, reconciliation happens inside the buffer.
   */
  async syncFoldStateFromFile(file, attempt = 0) {
    if (this.isSyncing) return;
    const view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    if (!view || view.file?.path !== file.path) return;
    const cm = getCm(view.editor);
    if (!cm) return;
    const content = await this.app.vault.read(file);
    if (content !== cm.state.doc.toString()) {
      const delay = STALE_RETRY_DELAYS_MS[attempt];
      if (delay !== void 0) {
        window.setTimeout(() => {
          void this.syncFoldStateFromFile(file, attempt + 1);
        }, delay);
      }
      return;
    }
    this.reconcileEditor(cm);
  }
  /**
   * Queues a fold change for persistence.
   *
   * Edits go through the editor (not vault.process) so they never clobber
   * unsaved buffer content or trigger "modified externally" merges — see the
   * plugin guideline: prefer the Editor API for the active note. The dispatch
   * is deferred out of the ViewPlugin update cycle, because a view plugin
   * must not make document changes while a CodeMirror update is in progress.
   */
  handleFoldChange(cm, lineNum, folded) {
    if (this.isSyncing) return;
    const lineInfo = cm.state.doc.line(lineNum + 1);
    if (!isPersistableLine(lineInfo.text)) return;
    let pending = this.pendingByView.get(cm);
    if (!pending) {
      pending = { edits: /* @__PURE__ */ new Map(), scheduled: false };
      this.pendingByView.set(cm, pending);
    }
    pending.edits.set(lineNum, folded);
    if (!pending.scheduled) {
      pending.scheduled = true;
      window.setTimeout(() => this.flushPendingEdits(cm), 0);
    }
  }
  /** Writes all queued marker edits of one editor as a single transaction. */
  flushPendingEdits(cm) {
    const pending = this.pendingByView.get(cm);
    if (!pending) return;
    pending.scheduled = false;
    const queued = pending.edits;
    pending.edits = /* @__PURE__ */ new Map();
    if (queued.size === 0) return;
    const doc = cm.state.doc;
    const lines = Array.from(
      { length: doc.lines },
      (_, i) => doc.line(i + 1).text
    );
    const lineEdits = collectLineEdits(lines, queued);
    if (lineEdits.length === 0) return;
    const changes = lineEdits.map(({ line, text }) => {
      const li = doc.line(line + 1);
      return { from: li.from, to: li.to, insert: text };
    });
    try {
      cm.dispatch({ changes });
    } catch {
      this.pendingByView.delete(cm);
    }
  }
  async applyFoldState(file) {
    if (!file || file.extension !== "md") return;
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    const view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    if (!view || view.file?.path !== file.path) return;
    const cm = getCm(view.editor);
    if (!cm) return;
    (0, import_language2.ensureSyntaxTree)(cm.state, cm.state.doc.length, 500);
    const foldedLines = parseMarkedLines(cm.state.doc.toString());
    if (foldedLines.size === 0) return;
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
