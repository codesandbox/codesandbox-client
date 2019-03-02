"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const umd_1 = require("vscode-uri/lib/umd");
class GutterIconManager {
    constructor() {
        this.escape = require("escape-html");
        this.iconDict = new Map();
        // tslint:disable-next-line:callable-types
        this.disposables = new Array();
        this.fontFamily = vscode_1.workspace.getConfiguration("editor").fontFamily;
        this.readEditorLineHeight();
    }
    Dispose() {
        this.disposables.forEach((callback) => {
            callback();
        });
        this.disposables = [];
    }
    GetIconUri(bracket, color) {
        const colorDict = this.iconDict.get(bracket);
        if (colorDict) {
            const uri = colorDict.get(color);
            if (uri) {
                return uri;
            }
            else {
                const newUri = this.createIcon(color, bracket);
                colorDict.set(color, newUri);
                return newUri;
            }
        }
        else {
            const newUri = this.createIcon(color, bracket);
            const dict = new Map();
            dict.set(color, newUri);
            this.iconDict.set(bracket, dict);
            return newUri;
        }
    }
    createIcon(color, bracket) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" height="${this.lineHeight}" width="${this.lineHeight}">` +
            `<text x="50%" y="50%" fill="${color}" font-family="${this.fontFamily}" font-size="${this.fontSize}" ` +
            `text-anchor="middle" dominant-baseline="middle">` +
            `${this.escape(bracket)}` +
            `</text>` +
            `</svg>`;
        const encodedSVG = encodeURIComponent(svg);
        const URI = "data:image/svg+xml;utf8," + encodedSVG;
        return umd_1.default.parse(URI);
    }
    readEditorLineHeight() {
        const MINIMUM_LINE_HEIGHT = 8;
        const MAXIMUM_LINE_HEIGHT = 150;
        const GOLDEN_LINE_HEIGHT_RATIO = (process.platform === "darwin") ? 1.5 : 1.35;
        const editorConfig = vscode_1.workspace.getConfiguration("editor", null);
        const fontSize = editorConfig.get("fontSize");
        const configuredLineHeight = editorConfig.get("lineHeight");
        function clamp(n, min, max) {
            if (n < min) {
                return min;
            }
            if (n > max) {
                return max;
            }
            return n;
        }
        function safeParseInt(n, defaultValue) {
            if (typeof n === "number") {
                return Math.round(n);
            }
            const r = parseInt(n, 10);
            if (isNaN(r)) {
                return defaultValue;
            }
            return r;
        }
        let lineHeight = safeParseInt(configuredLineHeight, 0);
        lineHeight = clamp(lineHeight, 0, MAXIMUM_LINE_HEIGHT);
        if (lineHeight === 0) {
            lineHeight = Math.round(GOLDEN_LINE_HEIGHT_RATIO * fontSize);
        }
        else if (lineHeight < MINIMUM_LINE_HEIGHT) {
            lineHeight = MINIMUM_LINE_HEIGHT;
        }
        this.lineHeight = lineHeight;
        this.fontSize = Math.ceil(fontSize * (2 / 3));
    }
}
exports.default = GutterIconManager;
//# sourceMappingURL=gutterIconManager.js.map