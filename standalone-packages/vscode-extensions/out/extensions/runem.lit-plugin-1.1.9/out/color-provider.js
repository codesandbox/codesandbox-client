"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
/**
 * Regex to match colors in a string
 */
const COLOR_HEX_REGEX = /#[0-9a-fA-F]+/gi;
/**
 * Regex to match sections in a text where a color should be highlighted
 */
const COLOR_SECTION_REGEX = /(css|html)`([\s\S]*?)`/gi;
/**
 * Convert "rgba" to "hex"
 * @param red
 * @param green
 * @param blue
 * @param alpha
 */
function RGBAToHex({ red, green, blue, alpha }) {
    let r = red.toString(16).padStart(2, "0");
    let g = green.toString(16).padStart(2, "0");
    let b = blue.toString(16).padStart(2, "0");
    let a = alpha.toString(16).padStart(2, "0");
    return `#${r}${g}${b}${a === "ff" ? "" : a}`;
}
/**
 * Converts "hex" to "rgba"
 * @param hex
 */
function hexToRGBA(hex) {
    // Parses "#ffffff" and "#ffffffff"
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
    if (result != null) {
        return {
            red: parseInt(result[1], 16),
            green: parseInt(result[2], 16),
            blue: parseInt(result[3], 16),
            alpha: result[4] == null ? 255 : parseInt(result[4], 16)
        };
    }
    // Parses "#fff" and "#ffff"
    const shorthandResult = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i.exec(hex);
    if (shorthandResult != null) {
        return {
            red: parseInt(shorthandResult[1] + shorthandResult[1], 16),
            green: parseInt(shorthandResult[2] + shorthandResult[2], 16),
            blue: parseInt(shorthandResult[3] + shorthandResult[3], 16),
            alpha: shorthandResult[4] == null ? 255 : parseInt(shorthandResult[4] + shorthandResult[4], 16)
        };
    }
    return undefined;
}
/**
 * Converts a vscode color to a hex
 * @param vscodeColor
 */
function vscodeColorToHex(vscodeColor) {
    const { red, green, blue, alpha } = vscodeColor;
    return RGBAToHex({
        red: Math.floor(red * 255),
        green: Math.floor(green * 255),
        blue: Math.floor(blue * 255),
        alpha: Math.floor(alpha * 255)
    });
}
/**
 * Converts a hex to a vscode color
 * @param hex
 */
function hexToVscodeColor(hex) {
    const rgba = hexToRGBA(hex);
    if (rgba == null)
        return undefined;
    return new vscode.Color(rgba.red / 255, rgba.green / 255, rgba.blue / 255, rgba.alpha / 255);
}
/**
 * Matches a regex on a text and returns all positions where a match was found
 * @param regex
 * @param text
 * @param callback
 */
function getRegexMatches(regex, text) {
    // Find all hex colors in the document
    let match = null;
    const matches = [];
    while ((match = regex.exec(text)) != null) {
        const start = match.index;
        matches.push({ start, text: match[0] });
    }
    return matches;
}
/**
 * Parses a document a returns color information where appropriate
 * @param document
 */
function findColorsInDocument(document) {
    const documentText = document.getText();
    const colors = [];
    // Find all sections that can include colors
    const taggedLiteralMatches = getRegexMatches(COLOR_SECTION_REGEX, documentText);
    for (const { text: taggedTemplateText, start: taggedTemplateStart } of taggedLiteralMatches) {
        // Find all colors in those sections
        const colorMatches = getRegexMatches(COLOR_HEX_REGEX, taggedTemplateText);
        // Add a color information based on each color found
        for (const { text: hex, start: colorStart } of colorMatches) {
            const color = hexToVscodeColor(hex);
            if (color == null)
                continue;
            const documentOffset = taggedTemplateStart + colorStart;
            colors.push(new vscode.ColorInformation(new vscode.Range(document.positionAt(documentOffset), document.positionAt(documentOffset + hex.length)), color));
        }
    }
    return colors;
}
/**
 * Exports a color provider that makes it possible to highlight colors within "css" and "html" tagged templates.
 */
class ColorProvider {
    provideDocumentColors(document, token) {
        return findColorsInDocument(document);
    }
    provideColorPresentations(color, context, token) {
        return [new vscode.ColorPresentation(vscodeColorToHex(color))];
    }
}
exports.ColorProvider = ColorProvider;
//# sourceMappingURL=color-provider.js.map