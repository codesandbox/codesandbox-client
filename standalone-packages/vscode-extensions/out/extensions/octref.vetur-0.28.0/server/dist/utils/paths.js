"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeFileNameToFsPath = exports.getFilePath = exports.getFileFsPath = void 0;
const os_1 = require("os");
const vscode_uri_1 = require("vscode-uri");
/**
 * Vetur mainly deals with paths / uris from two objects
 *
 * - `TextDocument` from `vscode-languageserver`
 * - `SourceFile` from `typescript`
 *
 * TypeScript Language Service uses `fileName`, which is a file path without scheme.
 * Convert them into standard URI by `Uri.file`.
 *
 * ## `TextDocument.uri`
 *
 * - macOS / Linux: file:///foo/bar.vue
 * - Windows: file:///c%3A/foo/bar.vue (%3A is `:`)
 *
 * ## `SourceFile.fileName`
 *
 * - macOS / Linux: /foo/bar.vue
 * - Windows: c:/foo/bar.vue
 *
 * ## vscode-uri
 *
 * - `Uri.parse`: Takes full URI starting with `file://`
 * - `Uri.file`: Takes file path
 *
 * ### `fsPath` vs `path`
 *
 * - macOS / Linux:
 * ```
 * > Uri.parse('file:///foo/bar.vue').fsPath
 * '/foo/bar.vue'
 * > Uri.parse('file:///foo/bar.vue').path
 * '/foo/bar.vue'
 * ```
 * - Windows
 * ```
 * > Uri.parse('file:///c%3A/foo/bar.vue').fsPath
 * 'c:\\foo\\bar.vue' (\\ escapes to \)
 * > Uri.parse('file:///c%3A/foo/bar.vue').path
 * '/c:/foo/bar.vue'
 * ```
 */
function getFileFsPath(documentUri) {
    return vscode_uri_1.URI.parse(documentUri).fsPath;
}
exports.getFileFsPath = getFileFsPath;
function getFilePath(documentUri) {
    const IS_WINDOWS = os_1.platform() === 'win32';
    if (IS_WINDOWS) {
        // Windows have a leading slash like /C:/Users/pine
        // vscode-uri use lower-case drive letter
        // https://github.com/microsoft/vscode-uri/blob/95e03c06f87d38f25eda1ae3c343fe5b7eec3f52/src/index.ts#L1017
        return vscode_uri_1.URI.parse(documentUri).path.replace(/^\/[a-zA-Z]/, (s) => s.slice(1).toLowerCase());
    }
    else {
        return vscode_uri_1.URI.parse(documentUri).path;
    }
}
exports.getFilePath = getFilePath;
function normalizeFileNameToFsPath(fileName) {
    return vscode_uri_1.URI.file(fileName).fsPath;
}
exports.normalizeFileNameToFsPath = normalizeFileNameToFsPath;
//# sourceMappingURL=paths.js.map