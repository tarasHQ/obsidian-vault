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

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => AVIFicatorPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var import_node_child_process = require("node:child_process");
var import_promises = require("node:fs/promises");
var import_node_path2 = require("node:path");
var import_node_util = require("node:util");

// dropped-files.ts
var import_node_path = require("node:path");
var import_node_url = require("node:url");
function parseFileUriList(uriList) {
  const uris = uriList.split(/\r?\n/).map((line) => line.trim()).filter((line) => line !== "" && !line.startsWith("#")).flatMap((line) => line.split(/(?=file:\/\/)/i));
  if (uris.length === 0) return null;
  const paths = [];
  for (const uri of uris) {
    if (!uri.toLowerCase().startsWith("file:")) return null;
    try {
      paths.push((0, import_node_url.fileURLToPath)(uri));
    } catch {
      return null;
    }
  }
  return paths;
}
function dropInsertsAddresses(uriList, plainText) {
  if (!plainText) return true;
  const uris = uriList.toLowerCase();
  const text = plainText.toLowerCase();
  if (uris === text) return false;
  try {
    return decodeURIComponent(uris) !== text;
  } catch {
    return true;
  }
}
function vaultRelativePath(basePath, filePath) {
  const relativePath = (0, import_node_path.relative)(basePath, filePath);
  if (relativePath === "" || relativePath === ".." || relativePath.startsWith(`..${import_node_path.sep}`) || (0, import_node_path.isAbsolute)(relativePath)) {
    return null;
  }
  return relativePath.split(import_node_path.sep).join("/");
}

// insert-window.ts
var InsertWindow = class {
  constructor(durationMs, maxDurationMs) {
    this.notePath = null;
    this.fileCount = 0;
    this.until = 0;
    this.limit = 0;
    this.durationMs = durationMs;
    this.maxDurationMs = maxDurationMs;
  }
  // An earlier paste into the same note may still be saving its files.
  open(notePath, fileCount, now) {
    const isOpen = now < this.until && this.fileCount > 0;
    this.fileCount = isOpen && this.notePath === notePath ? this.fileCount + fileCount : fileCount;
    this.notePath = notePath;
    this.until = now + this.durationMs;
    this.limit = now + this.maxDurationMs;
  }
  // The note for the next expected image, or null once all have come or the
  // wait is over. Each image extends the wait, up to the limit.
  take(now) {
    if (now >= this.until || this.fileCount === 0) return null;
    this.fileCount -= 1;
    this.until = Math.min(now + this.durationMs, this.limit);
    return this.notePath;
  }
};
function dropFileCount(data) {
  const files = Array.from(data.items).filter((item) => item.kind === "file").length;
  const embeddedImages = data.getData("text/html").split("data:image/").length - 1;
  return files + embeddedImages;
}
function pasteFileCount(data) {
  const count = dropFileCount(data);
  return count === 0 && !data.getData("text/plain") ? 1 : count;
}

// file-name.ts
var DEFAULT_FILE_NAME_TEMPLATE = "{title}-{date:YYYYMMDDHHmmssSSS}{counter}";
var VARIABLE_PATTERN = /\{([^{}]*)\}/g;
var DEFAULT_DATE_FORMAT = "YYYY-MM-DD";
var FORBIDDEN_CHARACTERS = /[\\/:*?"<>|#^[\]]/g;
var MAX_VALUE_BYTES = 100;
function cutToBytes(value, maxBytes) {
  const encoder = new TextEncoder();
  let result = "";
  let byteCount = 0;
  for (const character of value) {
    byteCount += encoder.encode(character).length;
    if (byteCount > maxBytes) break;
    result += character;
  }
  return result;
}
var EMOJI_MARKS = /[\p{Me}\u{FE00}-\u{FE0F}\u{E0100}-\u{E01EF}]/gu;
function sanitizeFileStem(value, replaceSpaces) {
  const separator = replaceSpaces ? "_" : " ";
  const sanitized = cutToBytes(value, MAX_VALUE_BYTES).replace(EMOJI_MARKS, "").replace(/[^\p{L}\p{M}\p{N}._-]+/gu, separator).replace(replaceSpaces ? /_+/g : / +/g, separator).replace(/^[._ -]+|[._ -]+$/g, "");
  return sanitized || "Untitled";
}
function buildFileStem(template, values, options) {
  const { attempt, replaceSpaces } = options;
  const rendered = template.replace(VARIABLE_PATTERN, (variable, name) => {
    if (name === "title") return sanitizeFileStem(values.title, replaceSpaces);
    if (name === "original") return sanitizeFileStem(values.original, replaceSpaces);
    if (name === "counter") return attempt.toString().padStart(3, "0");
    if (name === "date") return values.formatDate(DEFAULT_DATE_FORMAT);
    if (name.startsWith("date:")) {
      return values.formatDate(name.slice("date:".length) || DEFAULT_DATE_FORMAT);
    }
    return variable;
  });
  const suffix = attempt > 0 && !template.includes("{counter}") ? ` ${attempt}` : "";
  const stem = (rendered + suffix).replace(FORBIDDEN_CHARACTERS, "-").replace(/^[\s.]+|[\s.]+$/g, "");
  return (replaceSpaces ? stem.replace(/\s+/g, "_") : stem) || "Untitled";
}
function keepFileStem(stem, attempt) {
  return attempt > 0 ? `${stem} ${attempt}` : stem;
}
var VARIABLE_OR_UNCLOSED_PATTERN = /\{([^{}]*)(\})?/g;
function findUnknownVariable(template) {
  for (const [variable, name = "", closing] of template.matchAll(
    VARIABLE_OR_UNCLOSED_PATTERN
  )) {
    const isKnown = closing !== void 0 && (["title", "original", "counter", "date"].includes(name) || name.startsWith("date:"));
    if (!isKnown) return variable;
  }
  return null;
}
var SUGGESTED_DATE_FORMATS = ["YYYYMMDDHHmmssSSS", "YYYY-MM-DD", "YYYY-MM-DD HH-mm"];
function templateSuggestions(formatDate) {
  return [
    { variable: "{title}", description: "Note title" },
    { variable: "{original}", description: "Original file name" },
    {
      variable: "{counter}",
      description: "000, or 001, 002, and so on if the name is taken"
    },
    ...SUGGESTED_DATE_FORMATS.map((format) => ({
      variable: `{date:${format}}`,
      description: formatDate(format)
    }))
  ];
}
function filterTemplateSuggestions(suggestions, query) {
  const prefix = `{${query}`.toLowerCase();
  return suggestions.filter(
    (suggestion) => suggestion.variable.toLowerCase().startsWith(prefix)
  );
}
function findPartialVariable(value, cursor) {
  if (cursor === 0) return null;
  const start = value.lastIndexOf("{", cursor - 1);
  if (start === -1) return null;
  const query = value.slice(start + 1, cursor);
  return query.includes("}") ? null : { start, query };
}
function insertVariable(value, partial, cursor, variable) {
  const closing = value.indexOf("}", cursor);
  const nextOpening = value.indexOf("{", cursor);
  const end = closing !== -1 && (nextOpening === -1 || closing < nextOpening) ? closing + 1 : cursor;
  return {
    value: value.slice(0, partial.start) + variable + value.slice(end),
    cursor: partial.start + variable.length
  };
}

// link-utils.ts
var WIKI_IMAGE_EMBED_PATTERN = /!\[\[((?:[^\]\n]|\](?!\]))+)\]\]/g;
var MARKDOWN_IMAGE_EMBED_PATTERN = /!\[([^\]\n]*)\]\((<[^>\n]+>|(?:\\.|[^()\s\\]|\((?:\\.|[^()\s\\])*\))+)([ \t]+(?:"[^"\n]*"|'[^'\n]*'|\([^)\n]*\)))?\)/g;
function replaceImageEmbedLinks(content, outputFileName, isOriginalTarget) {
  let replacementCount = 0;
  const withWikiLinks = content.replace(
    WIKI_IMAGE_EMBED_PATTERN,
    (fullMatch, innerLink) => {
      const aliasIndex = innerLink.indexOf("|");
      const target = aliasIndex === -1 ? innerLink : innerLink.slice(0, aliasIndex);
      const alias = aliasIndex === -1 ? "" : innerLink.slice(aliasIndex);
      if (!isOriginalTarget(target.trim())) return fullMatch;
      replacementCount += 1;
      return `![[${replaceTrimmedTarget(target, outputFileName, false)}${alias}]]`;
    }
  );
  const withMarkdownLinks = withWikiLinks.replace(
    MARKDOWN_IMAGE_EMBED_PATTERN,
    (fullMatch, altText, rawTarget, title) => {
      const isEnclosed = rawTarget.startsWith("<") && rawTarget.endsWith(">");
      const target = isEnclosed ? rawTarget.slice(1, -1) : rawTarget;
      if (!isOriginalTarget(decodeMarkdownTarget(target))) return fullMatch;
      replacementCount += 1;
      const replacementTarget = replaceTargetBasename(target, outputFileName, true);
      const formattedTarget = isEnclosed ? `<${replacementTarget}>` : replacementTarget;
      return `![${altText}](${formattedTarget}${title ?? ""})`;
    }
  );
  return {
    content: withMarkdownLinks,
    replacementCount
  };
}
var WIKI_LINK_PATTERN = new RegExp(`!?${WIKI_IMAGE_EMBED_PATTERN.source.slice(1)}`, "g");
var MARKDOWN_LINK_PATTERN = new RegExp(`!?${MARKDOWN_IMAGE_EMBED_PATTERN.source.slice(1)}`, "g");
function findLinkTargets(content, isTarget) {
  const targets = /* @__PURE__ */ new Set();
  const add = (target) => {
    if (isTarget(target)) targets.add(target);
  };
  for (const [, innerLink = ""] of content.matchAll(WIKI_LINK_PATTERN)) {
    const aliasIndex = innerLink.indexOf("|");
    add((aliasIndex === -1 ? innerLink : innerLink.slice(0, aliasIndex)).trim());
  }
  for (const [, , rawTarget = ""] of content.matchAll(MARKDOWN_LINK_PATTERN)) {
    const isEnclosed = rawTarget.startsWith("<") && rawTarget.endsWith(">");
    add(decodeMarkdownTarget(isEnclosed ? rawTarget.slice(1, -1) : rawTarget));
  }
  return targets;
}
function findImageEmbedTargets(content, isTarget) {
  const targets = /* @__PURE__ */ new Set();
  replaceImageEmbedLinks(content, "", (target) => {
    if (isTarget(target)) targets.add(target);
    return false;
  });
  return targets;
}
function decodeMarkdownTarget(target) {
  try {
    return decodeURI(target);
  } catch {
    return target;
  }
}
function isFileNameTaken(fileName, paths) {
  const lowerCased = fileName.toLowerCase();
  return paths.some(
    (path) => path.slice(path.lastIndexOf("/") + 1).toLowerCase() === lowerCased
  );
}
function replaceTrimmedTarget(target, outputFileName, encodeOutput) {
  const trimmedTarget = target.trim();
  const startIndex = target.indexOf(trimmedTarget);
  const prefix = target.slice(0, startIndex);
  const suffix = target.slice(startIndex + trimmedTarget.length);
  return prefix + replaceTargetBasename(trimmedTarget, outputFileName, encodeOutput) + suffix;
}
function replaceTargetBasename(target, outputFileName, encodeOutput) {
  const subpathIndex = target.indexOf("#");
  const path = subpathIndex === -1 ? target : target.slice(0, subpathIndex);
  const subpath = subpathIndex === -1 ? "" : target.slice(subpathIndex);
  const separatorIndex = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
  const encodedOutputFileName = encodeOutput ? encodeMarkdownPathSegment(outputFileName) : outputFileName;
  return path.slice(0, separatorIndex + 1) + encodedOutputFileName + subpath;
}
function encodeMarkdownPathSegment(value) {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

// formats.ts
var IMAGE_FORMATS = [
  "PNG",
  "JPEG",
  "WEBP",
  "HEIC",
  "GIF",
  "BMP",
  "TIFF",
  "JXL",
  "AVIF"
];
var FORMAT_EXTENSIONS = {
  PNG: ["png"],
  JPEG: ["jpg", "jpeg", "jfif"],
  WEBP: ["webp"],
  HEIC: ["heic", "heif"],
  GIF: ["gif"],
  BMP: ["bmp"],
  TIFF: ["tif", "tiff"],
  JXL: ["jxl"],
  AVIF: ["avif"]
};
function canConvert(format) {
  return format !== "AVIF";
}
function multiFrameKind(format, frameCount) {
  if (frameCount <= 1) return null;
  return format === "TIFF" ? "pages" : "animated";
}
function formatForExtension(extension) {
  const lowerCased = extension.toLowerCase();
  return IMAGE_FORMATS.find((format) => FORMAT_EXTENSIONS[format].includes(lowerCased)) ?? null;
}
var PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];
function isAnimatedPng(bytes) {
  if (!PNG_SIGNATURE.every((byte, index) => bytes[index] === byte)) return false;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = PNG_SIGNATURE.length;
  while (offset + 8 <= bytes.length) {
    const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));
    if (type === "acTL") return true;
    if (type === "IDAT") return false;
    offset += 4 + 4 + view.getUint32(offset) + 4;
  }
  return false;
}

// magick-args.ts
function buildConvertArgs(inputPath, options) {
  const metadataArgs = options.stripMetadata ? ["+profile", "!icc,*"] : [];
  const sizeArgs = options.limitImageSize ? ["-resize", `${options.maxImageSize}x${options.maxImageSize}>`] : [];
  return [
    inputPath,
    // Rotates the pixels as the EXIF orientation says, so the image stays
    // upright without it: older ImageMagick versions don't carry it over to
    // AVIF, and removing metadata drops it.
    "-auto-orient",
    ...metadataArgs,
    ...sizeArgs,
    "-quality",
    options.quality.toString(),
    // The AV1 encoder's speed, 6 by default in ImageMagick.
    "-define",
    `heic:speed=${options.encodingSpeed}`,
    "avif:-"
  ];
}
function buildFrameCountArgs(inputPath) {
  return ["-ping", inputPath, "-print", "%n\n", "null:"];
}

// quote-embeds.ts
var import_state = require("@codemirror/state");
var EMBED_AND_BLANK_LINE = /^!\[[^\n]+\n\n$/;
var QUOTE_MARKS = /^[ \t]*(?:>[ \t]?)+/;
var keepEmbedsInQuotes = import_state.EditorState.transactionFilter.of(
  (tr) => {
    if (!tr.docChanged) return tr;
    const changed = [];
    tr.changes.iterChanges((fromA, _toA, _fromB, toB, inserted) => {
      changed.push({ from: fromA, end: toB, inserted: inserted.toString() });
    });
    const [only] = changed;
    if (changed.length !== 1 || !only || !EMBED_AND_BLANK_LINE.test(only.inserted)) return tr;
    const line = tr.startState.doc.lineAt(only.from);
    const quote = QUOTE_MARKS.exec(line.text)?.[0];
    if (!quote || only.from - line.from < quote.length) return tr;
    const bareQuote = quote.trimEnd();
    const changes = [
      { from: only.end - 1, insert: bareQuote },
      { from: only.end, insert: quote }
    ];
    const selection = tr.newSelection.main;
    const cursorAfter = selection.empty && selection.head === only.end;
    return [
      tr,
      {
        changes,
        sequential: true,
        selection: cursorAfter ? { anchor: only.end + bareQuote.length + quote.length } : void 0
      }
    ];
  }
);

// magick-support.ts
var FORMAT_LINE = /^\s*([A-Z0-9_-]+)\*?\s+(?:\S+\s+)?([r-])([w-])[+-](?:\s|$)/i;
function parseFormatList(output) {
  const formats = /* @__PURE__ */ new Map();
  for (const line of output.split("\n")) {
    const [, name, read, write] = FORMAT_LINE.exec(line) ?? [];
    if (name) {
      formats.set(name.toUpperCase(), { read: read === "r", write: write === "w" });
    }
  }
  return formats;
}
function describeMagickSupport(versionOutput, formats, inputFormats) {
  const version = /ImageMagick (\S+)/.exec(versionOutput)?.[1];
  if (!version && formats.size === 0) {
    return [{ text: "The program at this path doesn't look like ImageMagick.", ok: false }];
  }
  const canWriteAvif = formats.get("AVIF")?.write ?? false;
  const readable = inputFormats.filter((format) => formats.get(format)?.read);
  const unreadable = inputFormats.filter((format) => !formats.get(format)?.read);
  const lines = [
    {
      text: `${version ? `ImageMagick ${version}` : "ImageMagick"}: AVIF ${canWriteAvif ? "supported" : "not supported"}.`,
      ok: canWriteAvif
    }
  ];
  if (!canWriteAvif) lines.push({ text: "Images can't be converted.", ok: false });
  if (readable.length > 0) {
    lines.push({ text: `Can read ${readable.join(", ")}.`, ok: true });
  }
  if (unreadable.length > 0) {
    lines.push({ text: `Can't read ${unreadable.join(", ")}.`, ok: false });
  }
  return lines;
}
function parseFrameCount(output) {
  const count = Number.parseInt(output, 10);
  return Number.isNaN(count) ? null : count;
}
function isMagickReadError(error) {
  return error instanceof Error && "code" in error && typeof error.code === "number";
}
function describeMagickError(error) {
  if (error instanceof Error && "code" in error && error.code === "ENOENT") {
    return [{ text: "ImageMagick not found at this path.", ok: false }];
  }
  const message = error instanceof Error ? error.message : String(error);
  return [{ text: `Could not run ImageMagick: ${message.split("\n")[0]}`, ok: false }];
}

// settings.ts
var MODES = ["convert", "rename", "off"];
var ENCODING_SPEEDS = [8, 6, 4];
var ANIMATED_IMAGE_ACTIONS = ["ask", "rename", "skip"];
var DEFAULT_SETTINGS = {
  mode: "convert",
  quality: 80,
  encodingSpeed: 8,
  magickPath: "magick",
  stripMetadata: false,
  limitImageSize: false,
  maxImageSize: 2e3,
  animatedImageAction: "ask",
  formats: allFormatActions(),
  fileNameTemplate: DEFAULT_FILE_NAME_TEMPLATE,
  replaceSpaces: true,
  importDroppedFileLinks: true,
  showStatusBar: true
};
function allFormatActions() {
  return Object.fromEntries(
    IMAGE_FORMATS.map((format) => [format, { rename: true, convert: canConvert(format) }])
  );
}
function isMode(value) {
  return MODES.some((mode) => mode === value);
}
function effectiveActions(mode, actions) {
  return {
    rename: mode !== "off" && actions.rename,
    convert: mode === "convert" && actions.convert
  };
}
function isAnimatedImageAction(value) {
  return ANIMATED_IMAGE_ACTIONS.some((action) => action === value);
}
function validateQuality(value) {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > 100) {
    return null;
  }
  return value;
}
function isEncodingSpeed(value) {
  return ENCODING_SPEEDS.some((speed) => speed === value);
}
function validateMaxImageSize(value) {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    return null;
  }
  return value;
}
function normalizeFileNameTemplate(value) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || DEFAULT_SETTINGS.fileNameTemplate;
}
function parseFileNameTemplate(value) {
  const template = normalizeFileNameTemplate(value);
  return findUnknownVariable(template) ? DEFAULT_SETTINGS.fileNameTemplate : template;
}
function normalizeMagickPath(value) {
  const trimmed = typeof value === "string" ? value.trim().replace(/^(["'])(.*)\1$/, "$2").trim() : "";
  return trimmed || DEFAULT_SETTINGS.magickPath;
}
function parseSettings(storedData) {
  const stored = typeof storedData === "object" && storedData !== null ? storedData : {};
  return {
    mode: isMode(stored.mode) ? stored.mode : DEFAULT_SETTINGS.mode,
    quality: validateQuality(stored.quality) ?? DEFAULT_SETTINGS.quality,
    encodingSpeed: isEncodingSpeed(stored.encodingSpeed) ? stored.encodingSpeed : DEFAULT_SETTINGS.encodingSpeed,
    magickPath: normalizeMagickPath(stored.magickPath),
    stripMetadata: typeof stored.stripMetadata === "boolean" ? stored.stripMetadata : DEFAULT_SETTINGS.stripMetadata,
    limitImageSize: typeof stored.limitImageSize === "boolean" ? stored.limitImageSize : DEFAULT_SETTINGS.limitImageSize,
    maxImageSize: validateMaxImageSize(stored.maxImageSize) ?? DEFAULT_SETTINGS.maxImageSize,
    animatedImageAction: isAnimatedImageAction(stored.animatedImageAction) ? stored.animatedImageAction : DEFAULT_SETTINGS.animatedImageAction,
    formats: parseFormats(stored.formats),
    fileNameTemplate: parseFileNameTemplate(stored.fileNameTemplate),
    replaceSpaces: typeof stored.replaceSpaces === "boolean" ? stored.replaceSpaces : DEFAULT_SETTINGS.replaceSpaces,
    importDroppedFileLinks: typeof stored.importDroppedFileLinks === "boolean" ? stored.importDroppedFileLinks : DEFAULT_SETTINGS.importDroppedFileLinks,
    showStatusBar: typeof stored.showStatusBar === "boolean" ? stored.showStatusBar : DEFAULT_SETTINGS.showStatusBar
  };
}
function parseFormats(storedFormats) {
  const formats = allFormatActions();
  if (typeof storedFormats !== "object" || storedFormats === null) return formats;
  const stored = storedFormats;
  for (const format of IMAGE_FORMATS) {
    const value = stored[format];
    if (typeof value === "object" && value !== null) {
      const actions = value;
      if (typeof actions.rename === "boolean") formats[format].rename = actions.rename;
      if (typeof actions.convert === "boolean") formats[format].convert = actions.convert;
    }
    if (!canConvert(format)) formats[format].convert = false;
  }
  return formats;
}

// main.ts
var execFileAsync = (0, import_node_util.promisify)(import_node_child_process.execFile);
var CONVERSION_TIMEOUT_MS = 6e5;
var MAGICK_CHECK_TIMEOUT_MS = 1e4;
var MAGICK_CHECK_DELAY_MS = 500;
var MOMENT_FORMAT_URL = "https://momentjs.com/docs/#/displaying/format/";
var LINK_RETRY_COUNT = 20;
var LINK_RETRY_DELAY_MS = 250;
var INSERT_WINDOW_MS = 1e4;
var INSERT_WINDOW_MAX_MS = 6e4;
var ORIGINAL_KEPT_FOR_LINKS = "The original was kept: other links point to it.";
var CONVERTIBLE_FORMATS = IMAGE_FORMATS.filter(canConvert);
var MODE_LABELS = {
  convert: "Convert to AVIF",
  rename: "Rename only",
  off: "Off"
};
var ENCODING_SPEED_LABELS = {
  8: "Fast",
  6: "Normal",
  4: "Slow"
};
var ANIMATED_IMAGE_ACTION_LABELS = {
  ask: "Ask every time",
  rename: "Rename only",
  skip: "Leave as is"
};
var FORMAT_ACTION_LABELS = {
  rename: "Rename",
  convert: "Convert"
};
var MULTI_FRAME_TEXT = {
  animated: {
    title: "Animated image",
    state: "is animated",
    loss: "Converting it to AVIF would lose the animation."
  },
  pages: {
    title: "Multi-page image",
    state: "has several pages",
    loss: "Converting it to AVIF would lose all pages but the first."
  }
};
function moveCursorToDrop(evt, editor) {
  const view = editor.cm;
  if (!view) return;
  const offset = view.posAtCoords({ x: evt.clientX, y: evt.clientY }, false);
  editor.setCursor(editor.offsetToPos(offset));
}
var momentFromDate = import_obsidian.moment;
function fileNameValues(title, original, date) {
  return {
    title,
    original,
    formatDate: (format) => momentFromDate(date).format(format)
  };
}
function descLines(...lines) {
  return createFragment((fragment) => {
    for (const line of lines) fragment.createDiv({ text: line });
  });
}
var AVIFicatorPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.settings = { ...DEFAULT_SETTINGS };
    this.noteQueues = /* @__PURE__ */ new Map();
    this.reservedOutputPaths = /* @__PURE__ */ new Set();
    this.insertWindow = new InsertWindow(INSERT_WINDOW_MS, INSERT_WINDOW_MAX_MS);
    this.statusBarItem = null;
  }
  // One operation per note at a time, so that images dropped together don't
  // overwrite each other's link changes.
  queueNoteOperation(notePath, operation) {
    const previous = this.noteQueues.get(notePath) ?? Promise.resolve();
    const run = previous.then(operation, operation);
    const settled = run.then(
      () => void 0,
      () => void 0
    );
    this.noteQueues.set(notePath, settled);
    void settled.then(() => {
      if (this.noteQueues.get(notePath) === settled) {
        this.noteQueues.delete(notePath);
      }
    });
    return run;
  }
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new AVIFicatorSettingTab(this.app, this));
    this.statusBarItem = this.addStatusBarItem();
    this.statusBarItem.addClass("mod-clickable");
    this.statusBarItem.setAttribute("aria-label", "AVIFicator mode");
    this.statusBarItem.setAttribute("data-tooltip-position", "top");
    this.registerDomEvent(this.statusBarItem, "click", (evt) => this.showModeMenu(evt));
    this.updateStatusBar();
    for (const mode of MODES) {
      this.addCommand({
        id: `switch-mode-${mode}`,
        name: `Switch mode: ${MODE_LABELS[mode]}`,
        callback: async () => {
          await this.setMode(mode);
          new import_obsidian.Notice(`AVIFicator mode: ${MODE_LABELS[mode]}`);
        }
      });
    }
    this.registerEditorExtension(keepEmbedsInQuotes);
    this.registerEvent(
      this.app.workspace.on("editor-paste", (evt, _editor, info) => {
        if (evt.defaultPrevented) return;
        const fileCount = evt.clipboardData ? pasteFileCount(evt.clipboardData) : 1;
        if (info.file && fileCount > 0) {
          this.insertWindow.open(info.file.path, fileCount, Date.now());
        }
      })
    );
    this.registerEvent(
      this.app.workspace.on(
        "editor-drop",
        (evt, editor, info) => this.handleEditorDrop(evt, editor, info)
      )
    );
    this.app.workspace.onLayoutReady(() => {
      this.registerEvent(
        this.app.vault.on("create", (file) => {
          void this.handleCreatedFile(file).catch((error) => {
            console.error("AVIF create handler failed", {
              error,
              filePath: file.path
            });
          });
        })
      );
    });
  }
  async setMode(mode) {
    this.settings.mode = mode;
    this.updateStatusBar();
    await this.saveSettings();
  }
  showModeMenu(evt) {
    const menu = new import_obsidian.Menu();
    for (const mode of MODES) {
      menu.addItem(
        (item) => item.setTitle(MODE_LABELS[mode]).setChecked(this.settings.mode === mode).onClick(() => this.setMode(mode))
      );
    }
    menu.showAtMouseEvent(evt);
  }
  updateStatusBar() {
    this.statusBarItem?.setText(`AVIF: ${this.settings.mode}`);
    this.statusBarItem?.toggle(this.settings.showStatusBar);
  }
  async handleCreatedFile(file) {
    if (!(file instanceof import_obsidian.TFile)) return;
    if (this.reservedOutputPaths.has(file.path)) return;
    if (!formatForExtension(file.extension)) return;
    const notePath = this.insertWindow.take(Date.now());
    const plan = this.planImage(file.extension);
    if (!notePath || !plan) return;
    const sourceNote = this.app.vault.getFileByPath(notePath);
    if (!sourceNote || sourceNote.extension !== "md") return;
    const { format, actions } = plan;
    await this.queueNoteOperation(
      sourceNote.path,
      () => actions.convert ? this.convertLinkedImage(file, sourceNote, format, actions.rename) : this.renameLinkedImage(file, sourceNote)
    );
  }
  planImage(extension) {
    const format = formatForExtension(extension);
    if (!format) return null;
    const actions = effectiveActions(this.settings.mode, this.settings.formats[format]);
    return actions.rename || actions.convert ? { format, actions } : null;
  }
  // On Linux with Wayland, Obsidian may insert the file:/// addresses of
  // dragged files as text instead of copying them. Only then does the plugin
  // copy them itself.
  handleEditorDrop(evt, editor, info) {
    const dataTransfer = evt.dataTransfer;
    const note = info.file;
    if (evt.defaultPrevented || !dataTransfer || !note) return;
    const filePaths = this.droppedImagesToCopy(evt, dataTransfer);
    if (filePaths) {
      evt.preventDefault();
      moveCursorToDrop(evt, editor);
      void this.importDroppedImages(filePaths, editor, info, note);
      return;
    }
    const fileCount = dropFileCount(dataTransfer);
    if (fileCount > 0) {
      this.insertWindow.open(note.path, fileCount, Date.now());
    }
  }
  // The images to copy into the vault, or null if Obsidian should handle the
  // drop itself.
  droppedImagesToCopy(evt, dataTransfer) {
    if (!this.settings.importDroppedFileLinks || this.settings.mode === "off" || // With this key held, Obsidian links to files instead of copying them.
    (import_obsidian.Platform.isMacOS ? evt.altKey : evt.ctrlKey)) {
      return null;
    }
    const uriList = dataTransfer.getData("text/uri-list");
    if (!dropInsertsAddresses(uriList, dataTransfer.getData("text/plain"))) return null;
    const filePaths = parseFileUriList(uriList);
    return filePaths?.every((filePath) => formatForExtension((0, import_node_path2.extname)(filePath).slice(1))) ? filePaths : null;
  }
  async importDroppedImages(filePaths, editor, info, note) {
    const adapter = this.app.vault.adapter;
    if (!(adapter instanceof import_obsidian.FileSystemAdapter)) return;
    for (const [index, filePath] of filePaths.entries()) {
      try {
        const file = await this.importDroppedImage(adapter, filePath, info, note);
        if (!file || info.file !== note) {
          new import_obsidian.Notice(
            `${note.basename} is no longer open, so the dropped images weren't added to it`
          );
          return;
        }
        const link = this.app.fileManager.generateMarkdownLink(file, note.path);
        const separator = index < filePaths.length - 1 ? "\n\n" : "";
        editor.replaceSelection(`!${link}${separator}`);
      } catch (error) {
        console.error("Could not copy the dropped image", { error, filePath });
        new import_obsidian.Notice(`Could not copy ${(0, import_node_path2.basename)(filePath)} into the vault`);
      }
    }
  }
  // An image already in the vault is only linked, as Obsidian does. A copy
  // made after the editor switched notes is removed, so none is left unlinked.
  async importDroppedImage(adapter, filePath, info, note) {
    const vaultPath = vaultRelativePath(adapter.getBasePath(), filePath);
    const existing = vaultPath === null ? null : this.app.vault.getAbstractFileByPath((0, import_obsidian.normalizePath)(vaultPath));
    if (existing instanceof import_obsidian.TFile) return existing;
    const data = await (0, import_promises.readFile)(filePath);
    const attachmentPath = await this.app.fileManager.getAvailablePathForAttachment(
      (0, import_node_path2.basename)(filePath),
      note.path
    );
    if (info.file !== note) return null;
    this.insertWindow.open(note.path, 1, Date.now());
    const copy = await this.app.vault.createBinary(attachmentPath, new Uint8Array(data).buffer);
    if (info.file === note) return copy;
    await this.app.vault.delete(copy);
    return null;
  }
  async convertLinkedImage(file, sourceNote, format, rename) {
    const adapter = this.app.vault.adapter;
    if (!(adapter instanceof import_obsidian.FileSystemAdapter)) {
      new import_obsidian.Notice("AVIF conversion requires a desktop file-system vault");
      return;
    }
    let outputTarget = null;
    let outputFile = null;
    let linkUpdated = false;
    try {
      if (!await this.waitForImageLinks(sourceNote, file)) return;
      if (this.isLinkedFromOtherNotes(file, sourceNote)) return;
      const obstacle = await this.findConversionObstacle(adapter, file, format);
      if (obstacle) {
        await this.handleUnconvertibleImage(file, sourceNote, obstacle, rename);
        return;
      }
      outputTarget = await this.reserveOutputTarget(file, sourceNote, "avif", rename);
      const originalPath = file.path;
      const originalStat = { ...file.stat };
      outputFile = await this.createAvif(
        adapter.getFullPath(file.path),
        outputTarget.vaultPath
      );
      if (await this.hasChanged(file, originalPath, originalStat)) {
        await this.removeGeneratedOutput(outputFile);
        new import_obsidian.Notice(`Left as is: ${file.name} was changed or moved during conversion`);
        return;
      }
      linkUpdated = await this.replaceImageLinks(
        sourceNote,
        file,
        originalPath,
        outputTarget.fileName
      );
      if (!linkUpdated) {
        await this.removeGeneratedOutput(outputFile);
        new import_obsidian.Notice("AVIF link was not updated; the original image was preserved");
        return;
      }
      if (await this.hasChanged(file, originalPath, originalStat)) {
        new import_obsidian.Notice("The image changed during conversion; the original was left untouched");
        return;
      }
      if (await this.isOriginalStillLinked(file, sourceNote)) {
        new import_obsidian.Notice(`Converted: ${outputTarget.fileName}. ${ORIGINAL_KEPT_FOR_LINKS}`);
        return;
      }
      await this.app.vault.delete(file);
      new import_obsidian.Notice(`Converted: ${outputTarget.fileName}`);
    } catch (error) {
      if (outputFile && !linkUpdated) {
        await this.removeGeneratedOutput(outputFile);
      }
      console.error("AVIF conversion failed", {
        error,
        imagePath: file.path,
        notePath: sourceNote.path
      });
      new import_obsidian.Notice(
        linkUpdated ? "AVIF was created, but the original image could not be removed" : "AVIF conversion failed; the original image was preserved"
      );
    } finally {
      if (outputTarget) {
        this.reservedOutputPaths.delete(outputTarget.vaultPath);
      }
    }
  }
  // Added through the vault, the AVIF is reported while its name is still
  // reserved, and never overwrites a file that took the name meanwhile.
  async createAvif(inputPath, vaultPath) {
    const { stdout } = await execFileAsync(
      this.settings.magickPath,
      buildConvertArgs(inputPath, this.settings),
      {
        encoding: "buffer",
        // The whole AVIF is kept in memory for the vault anyway.
        maxBuffer: Infinity,
        timeout: CONVERSION_TIMEOUT_MS,
        windowsHide: true
      }
    );
    return await this.app.vault.createBinary(vaultPath, new Uint8Array(stdout).buffer);
  }
  // AVIF shows only the first frame, so animated and multi-page images aren't
  // converted, nor are ones ImageMagick can't open.
  async findConversionObstacle(adapter, file, format) {
    let frameCount;
    try {
      const { stdout } = await execFileAsync(
        this.settings.magickPath,
        buildFrameCountArgs(adapter.getFullPath(file.path)),
        // Some formats are read in full even with -ping, so this may take as
        // long as the conversion.
        { timeout: CONVERSION_TIMEOUT_MS, windowsHide: true }
      );
      frameCount = parseFrameCount(stdout) ?? 1;
    } catch (error) {
      if (!isMagickReadError(error)) throw error;
      console.warn("ImageMagick could not open the image", { error, imagePath: file.path });
      return "unreadable";
    }
    const kind = multiFrameKind(format, frameCount);
    if (kind) return kind;
    if (format === "PNG") {
      const bytes = new Uint8Array(await this.app.vault.readBinary(file));
      if (isAnimatedPng(bytes)) return "animated";
    }
    return null;
  }
  async handleUnconvertibleImage(file, sourceNote, obstacle, rename) {
    if (obstacle === "unreadable") {
      if (rename) {
        new import_obsidian.Notice(`Can't convert ${file.name}: ImageMagick couldn't open it. Renaming only.`);
        await this.renameLinkedImage(file, sourceNote);
      } else {
        new import_obsidian.Notice(`Left as is: ImageMagick couldn't open ${file.name}`);
      }
      return;
    }
    if (!rename) {
      new import_obsidian.Notice(`Left as is: ${file.name} ${MULTI_FRAME_TEXT[obstacle].state}`);
      return;
    }
    let action = this.settings.animatedImageAction;
    if (action === "ask") {
      action = await askMultiFrameAction(this.app, file.name, obstacle);
    } else if (action === "skip") {
      new import_obsidian.Notice(`Left as is: ${file.name} ${MULTI_FRAME_TEXT[obstacle].state}`);
    }
    if (action === "rename") {
      await this.renameLinkedImage(file, sourceNote);
    }
  }
  // Copying instead of renaming keeps the original name taken until the links
  // are updated, so another image can't reuse it.
  async renameLinkedImage(file, sourceNote) {
    const originalPath = file.path;
    let outputTarget = null;
    let outputFile = null;
    let linkUpdated = false;
    try {
      if (!await this.waitForImageLinks(sourceNote, file)) return;
      if (this.isLinkedFromOtherNotes(file, sourceNote)) return;
      outputTarget = await this.reserveOutputTarget(
        file,
        sourceNote,
        file.extension.toLowerCase()
      );
      if (outputTarget.vaultPath.toLowerCase() === originalPath.toLowerCase()) return;
      const originalStat = { ...file.stat };
      const data = await this.app.vault.readBinary(file);
      outputFile = await this.app.vault.createBinary(outputTarget.vaultPath, data, {
        ctime: originalStat.ctime,
        mtime: originalStat.mtime
      });
      if (await this.hasChanged(file, originalPath, originalStat)) {
        await this.removeGeneratedOutput(outputFile);
        new import_obsidian.Notice(`Left as is: ${file.name} was changed or moved during renaming`);
        return;
      }
      linkUpdated = await this.replaceImageLinks(
        sourceNote,
        file,
        originalPath,
        outputTarget.fileName
      );
      if (!linkUpdated) {
        throw new Error(`Link to ${originalPath} was not updated`);
      }
      if (await this.hasChanged(file, originalPath, originalStat)) {
        new import_obsidian.Notice("The image changed during renaming; the original was left untouched");
        return;
      }
      if (await this.isOriginalStillLinked(file, sourceNote)) {
        new import_obsidian.Notice(`Renamed: ${outputTarget.fileName}. ${ORIGINAL_KEPT_FOR_LINKS}`);
        return;
      }
      await this.app.vault.delete(file);
      new import_obsidian.Notice(`Renamed: ${outputTarget.fileName}`);
    } catch (error) {
      if (outputFile && !linkUpdated) {
        await this.removeGeneratedOutput(outputFile);
      }
      console.error("Image rename failed", {
        error,
        imagePath: originalPath,
        notePath: sourceNote.path
      });
      new import_obsidian.Notice(
        linkUpdated ? "The renamed image was created, but the original could not be removed" : "Image rename failed; the original name was kept"
      );
    } finally {
      if (outputTarget) {
        this.reservedOutputPaths.delete(outputTarget.vaultPath);
      }
    }
  }
  // Without renaming, the output keeps the image's own name.
  async reserveOutputTarget(file, sourceNote, extension, rename = true) {
    const folderPath = file.path.substring(0, file.path.lastIndexOf("/") + 1);
    const values = fileNameValues(sourceNote.basename, file.basename, /* @__PURE__ */ new Date());
    for (let attempt = 0; ; attempt += 1) {
      const stem = rename ? buildFileStem(this.settings.fileNameTemplate, values, {
        attempt,
        replaceSpaces: this.settings.replaceSpaces
      }) : keepFileStem(file.basename, attempt);
      const fileName = (0, import_obsidian.normalizePath)(`${stem}.${extension}`);
      const vaultPath = folderPath + fileName;
      const isOwnPath = vaultPath.toLowerCase() === file.path.toLowerCase();
      const isFree = isOwnPath || !this.app.metadataCache.getFirstLinkpathDest(fileName, "") && !await this.app.vault.adapter.exists(vaultPath);
      if (isFree && !isFileNameTaken(fileName, [...this.reservedOutputPaths])) {
        this.reservedOutputPaths.add(vaultPath);
        return { fileName, vaultPath };
      }
    }
  }
  async waitForImageLinks(note, image) {
    for (let attempt = 0; attempt < LINK_RETRY_COUNT; attempt += 1) {
      await this.saveOpenNote(note);
      const content = await this.app.vault.read(note);
      const targets = findImageEmbedTargets(
        content,
        (target) => this.resolveLinkTarget(target, note) === image
      );
      if (targets.size > 0) return true;
      if (attempt < LINK_RETRY_COUNT - 1) {
        await sleep(LINK_RETRY_DELAY_MS);
      }
    }
    console.debug("No link to the new image in the note; left as is", {
      imagePath: image.path,
      notePath: note.path
    });
    return false;
  }
  // A freshly added image is linked only from its note. If other notes link
  // to it, it came some other way, such as with sync, and deleting it would
  // break their links.
  isLinkedFromOtherNotes(image, note) {
    const linkingNote = Object.keys(this.app.metadataCache.resolvedLinks).find(
      (notePath) => notePath !== note.path && (this.app.metadataCache.resolvedLinks[notePath]?.[image.path] ?? 0) > 0
    );
    if (!linkingNote) return false;
    console.debug("Other notes link to the image; the original is kept", {
      imagePath: image.path,
      notePath: note.path,
      linkingNote
    });
    return true;
  }
  // External edits may not have reached the TFile cache yet, so the file on
  // disk is checked.
  async hasChanged(file, originalPath, originalStat) {
    const currentStat = await this.app.vault.adapter.stat(originalPath);
    return file.path !== originalPath || currentStat?.ctime !== originalStat.ctime || currentStat?.mtime !== originalStat.mtime || currentStat?.size !== originalStat.size;
  }
  // Only embeds are replaced, so the note may still link to the original
  // otherwise, such as in its properties.
  async isOriginalStillLinked(original, note) {
    const content = await this.app.vault.read(note);
    const isOriginal = (target) => this.resolveLinkTarget(target, note) === original;
    return findLinkTargets(content, isOriginal).size > 0 || this.isLinkedFromOtherNotes(original, note);
  }
  // The original still exists, so every link can be resolved to the same file,
  // including links added while the output was being created.
  async replaceImageLinks(note, originalFile, originalPath, outputFileName) {
    let replacementCount = 0;
    await this.saveOpenNote(note);
    await this.app.vault.process(note, (content) => {
      if (originalFile.path !== originalPath) return content;
      const result = replaceImageEmbedLinks(
        content,
        outputFileName,
        (target) => this.resolveLinkTarget(target, note) === originalFile
      );
      replacementCount = result.replacementCount;
      return result.content;
    });
    return replacementCount > 0;
  }
  // Obsidian saves a note up to 2 seconds after an edit. Saving now puts a
  // fresh link on disk and spares Obsidian merging unsaved typing with the
  // plugin's change, which it reports with a notice.
  async saveOpenNote(note) {
    for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
      if (leaf.view instanceof import_obsidian.MarkdownView && leaf.view.file === note) {
        await leaf.view.save();
      }
    }
  }
  // The target comes decoded as Obsidian reads it. Obsidian itself resolves
  // "./", "../", and "/" from the note.
  resolveLinkTarget(target, note) {
    const linkPath = (0, import_obsidian.getLinkpath)(target).replace(/\\/g, "/");
    return this.app.metadataCache.getFirstLinkpathDest(linkPath, note.path);
  }
  // The plugin has just made this file and nothing links to it, so it isn't
  // kept in trash. Never throws, so that a failed cleanup doesn't hide why it
  // was needed.
  async removeGeneratedOutput(outputFile) {
    try {
      await this.app.vault.delete(outputFile);
    } catch (cleanupError) {
      console.error("Failed to remove generated image output", {
        cleanupError,
        outputPath: outputFile.path
      });
    }
  }
  async loadSettings() {
    this.settings = parseSettings(await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
var MultiFrameImageModal = class extends import_obsidian.Modal {
  constructor(app, fileName, kind, onChoose) {
    super(app);
    // Closing the window without choosing leaves the image as is.
    this.action = "skip";
    this.fileName = fileName;
    this.kind = kind;
    this.onChoose = onChoose;
  }
  onOpen() {
    const text = MULTI_FRAME_TEXT[this.kind];
    this.setTitle(text.title);
    this.contentEl.createEl("p", {
      text: `"${this.fileName}" ${text.state}. ${text.loss}`
    });
    new import_obsidian.Setting(this.contentEl).addButton(
      (button) => button.setButtonText("Rename only").setCta().onClick(() => {
        this.action = "rename";
        this.close();
      })
    ).addButton(
      (button) => button.setButtonText("Leave as is").onClick(() => this.close())
    );
  }
  onClose() {
    this.contentEl.empty();
    this.onChoose(this.action);
  }
};
function askMultiFrameAction(app, fileName, kind) {
  return new Promise((resolve) => {
    new MultiFrameImageModal(app, fileName, kind, resolve).open();
  });
}
var TemplateVariableSuggest = class extends import_obsidian.AbstractInputSuggest {
  constructor(app, templateInputEl) {
    super(app, templateInputEl);
    this.templateInputEl = templateInputEl;
  }
  getSuggestions() {
    const partial = findPartialVariable(this.templateInputEl.value, this.cursor());
    if (!partial) return [];
    const now = /* @__PURE__ */ new Date();
    return filterTemplateSuggestions(
      templateSuggestions((format) => momentFromDate(now).format(format)),
      partial.query
    );
  }
  renderSuggestion(suggestion, el) {
    el.addClass("mod-complex");
    const contentEl = el.createDiv({ cls: "suggestion-content" });
    contentEl.createDiv({ cls: "suggestion-title", text: suggestion.variable });
    contentEl.createDiv({ cls: "suggestion-note", text: suggestion.description });
  }
  selectSuggestion(suggestion) {
    const cursor = this.cursor();
    const partial = findPartialVariable(this.templateInputEl.value, cursor);
    if (!partial) return;
    const result = insertVariable(
      this.templateInputEl.value,
      partial,
      cursor,
      suggestion.variable
    );
    this.setValue(result.value);
    this.templateInputEl.setSelectionRange(result.cursor, result.cursor);
    this.templateInputEl.dispatchEvent(new Event("input"));
    this.close();
  }
  cursor() {
    return this.templateInputEl.selectionStart ?? this.templateInputEl.value.length;
  }
};
var AVIFicatorSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.magickCheckId = 0;
    // ImageMagick is checked when the tab opens and when the path changes, not
    // each time the tab is redrawn.
    this.magickCheck = null;
    this.checkMagickLater = null;
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    this.checkMagickLater?.cancel();
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Mode").setDesc("What to do with images you add to notes.").addDropdown(
      (dropdown) => dropdown.addOptions(MODE_LABELS).setValue(this.plugin.settings.mode).onChange(async (value) => {
        if (isMode(value)) {
          await this.plugin.setMode(value);
          this.update();
        }
      })
    );
    new import_obsidian.Setting(containerEl).setName("Show mode in status bar").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showStatusBar).onChange(async (value) => {
        this.plugin.settings.showStatusBar = value;
        this.plugin.updateStatusBar();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Copy dragged images (file:/// links)").setDesc(
      descLines(
        "Dragging an image from a file manager sometimes inserts a file:/// link instead of the image.",
        "With this on, the image is copied into the vault."
      )
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.importDroppedFileLinks).onChange(async (value) => {
        this.plugin.settings.importDroppedFileLinks = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("File names").setHeading();
    const templateSetting = new import_obsidian.Setting(containerEl).setName("File name template").setClass("avificator-template-setting").setDesc(
      createFragment((fragment) => {
        fragment.append(
          descLines(
            "{title} \u2014 note title",
            "{original} \u2014 original file name",
            "{date:FORMAT} \u2014 date and time, e.g. {date:YYYY-MM-DD}",
            "{counter} \u2014 000, or 001, 002\u2026 if the name is taken",
            "Type { to pick a variable."
          )
        );
        fragment.createDiv({
          cls: "avificator-desc-group",
          text: "Date: YYYY year, MM month, DD day"
        });
        fragment.createDiv({
          text: "Time: HH hours, mm minutes, ss seconds, SSS milliseconds"
        });
        fragment.createDiv().createEl("a", { text: "More date formats", href: MOMENT_FORMAT_URL });
      })
    );
    const templatePreviewEl = templateSetting.descEl.createDiv({
      cls: ["avificator-desc-group", "mod-success"]
    });
    const updateTemplatePreview = () => {
      const stem = buildFileStem(
        this.plugin.settings.fileNameTemplate,
        fileNameValues("My note", "IMG_1234", /* @__PURE__ */ new Date()),
        { attempt: 0, replaceSpaces: this.plugin.settings.replaceSpaces }
      );
      templatePreviewEl.setText(`Example: ${stem}.avif`);
    };
    templateSetting.addText((text) => {
      new TemplateVariableSuggest(this.app, text.inputEl);
      return text.setPlaceholder(DEFAULT_SETTINGS.fileNameTemplate).setValue(this.plugin.settings.fileNameTemplate).onChange(async (value) => {
        const template = normalizeFileNameTemplate(value);
        const unknownVariable = findUnknownVariable(template);
        templateSetting.setErrorMessage(
          unknownVariable ? `Unknown variable ${unknownVariable}` : null
        );
        if (unknownVariable) return;
        this.plugin.settings.fileNameTemplate = template;
        await this.plugin.saveSettings();
        updateTemplatePreview();
      });
    });
    updateTemplatePreview();
    new import_obsidian.Setting(containerEl).setName("Replace spaces with underscores").setDesc("My note \u2192 My_note").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.replaceSpaces).onChange(async (value) => {
        this.plugin.settings.replaceSpaces = value;
        await this.plugin.saveSettings();
        updateTemplatePreview();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Conversion").setDesc("Used in Convert to AVIF mode for formats with Convert checked.").setHeading();
    const qualitySetting = new import_obsidian.Setting(containerEl).setName("Image quality").setDesc(descLines("From 0 (lowest) to 100 (highest).", "Default is 80."));
    qualitySetting.addText(
      (text) => text.setPlaceholder("Enter quality (0-100)").setValue(this.plugin.settings.quality.toString()).onChange(async (value) => {
        const quality = value.trim() === "" ? null : validateQuality(Number(value));
        qualitySetting.setErrorMessage(
          quality === null ? "Enter a whole number from 0 to 100" : null
        );
        if (quality === null) return;
        this.plugin.settings.quality = quality;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Encoding speed").setDesc(
      descLines(
        "Slower encoding makes files a little smaller.",
        "Default is Fast."
      )
    ).addDropdown((dropdown) => {
      for (const speed of ENCODING_SPEEDS) {
        dropdown.addOption(speed.toString(), ENCODING_SPEED_LABELS[speed]);
      }
      return dropdown.setValue(this.plugin.settings.encodingSpeed.toString()).onChange(async (value) => {
        const speed = Number(value);
        if (isEncodingSpeed(speed)) {
          this.plugin.settings.encodingSpeed = speed;
          await this.plugin.saveSettings();
        }
      });
    });
    new import_obsidian.Setting(containerEl).setName("Remove metadata").setDesc(
      descLines(
        "Removes GPS location, camera details, and other EXIF data.",
        "Color profiles are kept."
      )
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.stripMetadata).onChange(async (value) => {
        this.plugin.settings.stripMetadata = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Limit image size").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.limitImageSize).onChange(async (value) => {
        this.plugin.settings.limitImageSize = value;
        await this.plugin.saveSettings();
        this.update();
      })
    );
    if (this.plugin.settings.limitImageSize) {
      const maxSizeSetting = new import_obsidian.Setting(containerEl).setName("Maximum size").setDesc(descLines("Longer side in pixels.", "Default is 2000."));
      maxSizeSetting.addText(
        (text) => text.setPlaceholder(DEFAULT_SETTINGS.maxImageSize.toString()).setValue(this.plugin.settings.maxImageSize.toString()).onChange(async (value) => {
          const maxImageSize = value.trim() === "" ? null : validateMaxImageSize(Number(value));
          maxSizeSetting.setErrorMessage(
            maxImageSize === null ? "Enter a whole number greater than 0" : null
          );
          if (maxImageSize === null) return;
          this.plugin.settings.maxImageSize = maxImageSize;
          await this.plugin.saveSettings();
        })
      );
    }
    new import_obsidian.Setting(containerEl).setName("When you add an animated or multi-page image").setDesc("Such images can't be converted to AVIF.").addDropdown(
      (dropdown) => dropdown.addOptions(ANIMATED_IMAGE_ACTION_LABELS).setValue(this.plugin.settings.animatedImageAction).onChange(async (value) => {
        if (isAnimatedImageAction(value)) {
          this.plugin.settings.animatedImageAction = value;
          await this.plugin.saveSettings();
        }
      })
    );
    const magickPathSetting = new import_obsidian.Setting(containerEl).setName("ImageMagick path").setDesc(
      descLines(
        "Set the full path if magick isn't found.",
        "For example, /opt/homebrew/bin/magick."
      )
    );
    const magickStatusEl = magickPathSetting.descEl.createDiv();
    const formatNameEls = /* @__PURE__ */ new Map();
    const formatsNoteEl = createDiv({ cls: ["avificator-formats-note", "mod-warning"] });
    const showMagickStatus = () => this.showMagickStatus(magickStatusEl, formatNameEls, formatsNoteEl);
    const checkMagickLater = (0, import_obsidian.debounce)(
      () => void showMagickStatus(),
      MAGICK_CHECK_DELAY_MS,
      true
    );
    this.checkMagickLater = checkMagickLater;
    magickPathSetting.addText(
      (text) => text.setPlaceholder(DEFAULT_SETTINGS.magickPath).setValue(this.plugin.settings.magickPath).onChange(async (value) => {
        this.plugin.settings.magickPath = normalizeMagickPath(value);
        await this.plugin.saveSettings();
        checkMagickLater();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Input formats").setHeading();
    const formatsEl = containerEl.createDiv({ cls: ["setting-item", "avificator-formats"] });
    formatsEl.toggleClass("mod-no-rename", this.plugin.settings.mode === "off");
    formatsEl.toggleClass("mod-no-convert", this.plugin.settings.mode !== "convert");
    const actionLabels = Object.entries(FORMAT_ACTION_LABELS);
    const tableEl = formatsEl.createDiv({ cls: "avificator-formats-table" });
    const headerEl = tableEl.createDiv({ cls: "avificator-formats-row" });
    headerEl.createDiv();
    for (const [action, label] of actionLabels) {
      headerEl.createDiv({
        cls: ["avificator-formats-header", `avificator-formats-${action}`],
        text: label
      });
    }
    for (const format of IMAGE_FORMATS) {
      const rowEl = tableEl.createDiv({
        cls: ["avificator-formats-row", "avificator-format-row"]
      });
      const nameEl = rowEl.createDiv();
      nameEl.createSpan({ text: format });
      nameEl.createSpan({
        cls: "avificator-format-extensions",
        text: FORMAT_EXTENSIONS[format].map((extension) => `.${extension}`).join(" ")
      });
      formatNameEls.set(format, nameEl);
      for (const [action, label] of actionLabels) {
        const cellEl = rowEl.createDiv({ cls: `avificator-formats-${action}` });
        if (action === "convert" && !canConvert(format)) {
          const noneEl = cellEl.createSpan({ cls: "avificator-formats-none", text: "\u2014" });
          (0, import_obsidian.setTooltip)(noneEl, `${format} images are only renamed`);
          continue;
        }
        const checkbox = cellEl.createEl("input", {
          type: "checkbox",
          attr: { "aria-label": `${label} ${format}` }
        });
        checkbox.checked = this.plugin.settings.formats[format][action];
        checkbox.addEventListener("change", () => {
          this.plugin.settings.formats[format][action] = checkbox.checked;
          void this.plugin.saveSettings();
        });
      }
    }
    formatsEl.appendChild(formatsNoteEl);
    void showMagickStatus();
  }
  hide() {
    this.magickCheck = null;
    this.checkMagickLater?.cancel();
    super.hide();
  }
  async showMagickStatus(statusEl, formatNameEls, formatsNoteEl) {
    const checkId = ++this.magickCheckId;
    statusEl.setText("Checking ImageMagick...");
    const path = this.plugin.settings.magickPath;
    if (this.magickCheck?.path !== path) {
      this.magickCheck = { path, result: checkMagick(path, CONVERTIBLE_FORMATS) };
    }
    const { status, formats } = await this.magickCheck.result;
    if (checkId !== this.magickCheckId) return;
    statusEl.empty();
    for (const line of status) {
      statusEl.createDiv({
        text: line.text,
        cls: line.ok ? "mod-success" : "mod-warning"
      });
    }
    const unreadable = CONVERTIBLE_FORMATS.filter(
      (format) => formats.size > 0 && !formats.get(format)?.read
    );
    for (const [format, nameEl] of formatNameEls) {
      nameEl.toggleClass("mod-warning", unreadable.includes(format));
    }
    formatsNoteEl.empty();
    if (unreadable.length > 0) {
      formatsNoteEl.append(
        descLines(
          "ImageMagick can't read the formats in orange.",
          "Such images can only be renamed."
        )
      );
    }
  }
};
async function checkMagick(magickPath, inputFormats) {
  const options = { timeout: MAGICK_CHECK_TIMEOUT_MS, windowsHide: true };
  try {
    const [version, formatList] = await Promise.all([
      execFileAsync(magickPath, ["-version"], options),
      execFileAsync(magickPath, ["-list", "format"], options)
    ]);
    const formats = parseFormatList(formatList.stdout);
    return {
      status: describeMagickSupport(version.stdout, formats, inputFormats),
      formats
    };
  } catch (error) {
    return { status: describeMagickError(error), formats: /* @__PURE__ */ new Map() };
  }
}

/* nosourcemap */