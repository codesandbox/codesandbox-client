"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const colorMode_1 = require("./colorMode");
const colors_1 = require("./colors");
const gutterIconManager_1 = require("./gutterIconManager");
const textMateLoader_1 = require("./textMateLoader");
class Settings {
    constructor() {
        this.TextMateLoader = new textMateLoader_1.default();
        this.isDisposed = false;
        this.gutterIcons = new gutterIconManager_1.default();
        const configuration = vscode.workspace.getConfiguration("bracket-pair-colorizer-2", undefined);
        const activeScopeCSS = configuration.get("activeScopeCSS");
        if (!Array.isArray(activeScopeCSS)) {
            throw new Error("activeScopeCSS is not an array");
        }
        this.activeBracketCSSElements = activeScopeCSS.map((e) => [e.substring(0, e.indexOf(":")).trim(),
            e.substring(e.indexOf(":") + 1).trim()]);
        const scopeLineCSS = configuration.get("scopeLineCSS");
        if (!Array.isArray(scopeLineCSS)) {
            throw new Error("scopeLineCSS is not an array");
        }
        this.activeScopeLineCSSElements = scopeLineCSS.map((e) => [e.substring(0, e.indexOf(":")).trim(),
            e.substring(e.indexOf(":") + 1).trim()]);
        const borderStyle = this.activeScopeLineCSSElements.filter((e) => e[0] === "borderStyle");
        if (borderStyle && borderStyle[0].length === 2) {
            this.activeScopeLineCSSBorder = borderStyle[0][1];
        }
        else {
            this.activeScopeLineCSSBorder = "none";
        }
        this.highlightActiveScope = configuration.get("highlightActiveScope");
        if (typeof this.highlightActiveScope !== "boolean") {
            throw new Error("alwaysHighlightActiveScope is not a boolean");
        }
        this.showVerticalScopeLine = configuration.get("showVerticalScopeLine");
        if (typeof this.showVerticalScopeLine !== "boolean") {
            throw new Error("showVerticalScopeLine is not a boolean");
        }
        this.showHorizontalScopeLine = configuration.get("showHorizontalScopeLine");
        if (typeof this.showHorizontalScopeLine !== "boolean") {
            throw new Error("showHorizontalScopeLine is not a boolean");
        }
        this.scopeLineRelativePosition = configuration.get("scopeLineRelativePosition");
        if (typeof this.scopeLineRelativePosition !== "boolean") {
            throw new Error("scopeLineRelativePosition is not a boolean");
        }
        this.showBracketsInGutter = configuration.get("showBracketsInGutter");
        if (typeof this.showBracketsInGutter !== "boolean") {
            throw new Error("showBracketsInGutter is not a boolean");
        }
        this.showBracketsInRuler = configuration.get("showBracketsInRuler");
        if (typeof this.showBracketsInRuler !== "boolean") {
            throw new Error("showBracketsInRuler is not a boolean");
        }
        this.rulerPosition = configuration.get("rulerPosition");
        if (typeof this.rulerPosition !== "string") {
            throw new Error("rulerPosition is not a string");
        }
        this.unmatchedScopeColor = configuration.get("unmatchedScopeColor");
        if (typeof this.unmatchedScopeColor !== "string") {
            throw new Error("unmatchedScopeColor is not a string");
        }
        this.forceUniqueOpeningColor = configuration.get("forceUniqueOpeningColor");
        if (typeof this.forceUniqueOpeningColor !== "boolean") {
            throw new Error("forceUniqueOpeningColor is not a boolean");
        }
        this.forceIterationColorCycle = configuration.get("forceIterationColorCycle");
        if (typeof this.forceIterationColorCycle !== "boolean") {
            throw new Error("forceIterationColorCycle is not a boolean");
        }
        this.colorMode = colorMode_1.default[configuration.get("colorMode")];
        if (typeof this.colorMode !== "number") {
            throw new Error("colorMode enum could not be parsed");
        }
        this.colors = configuration.get("colors");
        if (!Array.isArray(this.colors)) {
            throw new Error("colors is not an array");
        }
        this.bracketDecorations = this.createBracketDecorations();
        const excludedLanguages = configuration.get("excludedLanguages");
        if (!Array.isArray(excludedLanguages)) {
            throw new Error("excludedLanguages is not an array");
        }
        this.excludedLanguages = new Set(excludedLanguages);
    }
    dispose() {
        if (!this.isDisposed) {
            this.bracketDecorations.forEach((decoration) => {
                decoration.dispose();
            });
            this.bracketDecorations.clear();
            this.gutterIcons.Dispose();
            this.isDisposed = true;
        }
    }
    createGutterBracketDecorations(color, bracket) {
        const gutterIcon = this.gutterIcons.GetIconUri(bracket, color);
        const decorationSettings = {
            gutterIconPath: gutterIcon,
        };
        const decoration = vscode.window.createTextEditorDecorationType(decorationSettings);
        return decoration;
    }
    createRulerBracketDecorations(color) {
        const decorationSettings = {
            overviewRulerColor: color,
            overviewRulerLane: vscode.OverviewRulerLane[this.rulerPosition],
        };
        const decoration = vscode.window.createTextEditorDecorationType(decorationSettings);
        return decoration;
    }
    createScopeBracketDecorations(color) {
        const decorationSettings = {
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
        };
        this.activeBracketCSSElements.forEach((element) => {
            decorationSettings[element[0]] = element[1].replace("{color}", color);
        });
        const decoration = vscode.window.createTextEditorDecorationType(decorationSettings);
        return decoration;
    }
    createScopeLineDecorations(color, top = true, right = true, bottom = true, left = true, yOffset) {
        const decorationSettings = {
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
        };
        const none = "none";
        const topBorder = top ? this.activeScopeLineCSSBorder : none;
        const rightBorder = right ? this.activeScopeLineCSSBorder : none;
        const botBorder = bottom ? this.activeScopeLineCSSBorder : none;
        const leftBorder = left ? this.activeScopeLineCSSBorder : none;
        for (const element of this.activeScopeLineCSSElements) {
            if (element[0].includes("Color")) {
                const colorElement = element[1].replace("{color}", color);
                if (!colorElement.includes("rgb") && colorElement.includes("opacity")) {
                    const colorSplit = colorElement.split(";");
                    const opacitySplit = colorSplit[1].split(":");
                    if (colorSplit[0].includes("#")) {
                        const rgb = colors_1.default.hex2rgb(colorSplit[0]);
                        if (rgb) {
                            const rbgaString = `rgba(${rgb.r},${rgb.g},${rgb.b},${opacitySplit[1]});`;
                            decorationSettings[element[0]] = rbgaString;
                        }
                    }
                    else { // Assume css color
                        const rgb = colors_1.default.name2rgb(colorSplit[0]);
                        if (rgb) {
                            const rbgaString = `rgba(${rgb.r},${rgb.g},${rgb.b},${opacitySplit[1]});`;
                            decorationSettings[element[0]] = rbgaString;
                        }
                    }
                }
                else {
                    decorationSettings[element[0]] = colorElement;
                }
            }
            else {
                decorationSettings[element[0]] = element[1];
            }
        }
        let borderStyle = `${topBorder} ${rightBorder} ${botBorder} ${leftBorder}`;
        if (yOffset !== undefined && yOffset !== 0) {
            borderStyle += "; transform: translateY(" + yOffset * 100 + "%); z-index: 1;";
        }
        // tslint:disable-next-line:no-string-literal
        decorationSettings["borderStyle"] = borderStyle;
        const decoration = vscode.window.createTextEditorDecorationType(decorationSettings);
        return decoration;
    }
    createBracketDecorations() {
        const decorations = new Map();
        for (const color of this.colors) {
            const decoration = vscode.window.createTextEditorDecorationType({
                color, rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
            });
            decorations.set(color, decoration);
        }
        const unmatchedDecoration = vscode.window.createTextEditorDecorationType({
            color: this.unmatchedScopeColor, rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
        });
        decorations.set(this.unmatchedScopeColor, unmatchedDecoration);
        return decorations;
    }
}
exports.default = Settings;
//# sourceMappingURL=settings.js.map