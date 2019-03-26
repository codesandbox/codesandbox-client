"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
/**
 * Naive approach
 * Switch to use vue-eslint-parser to parse expression and walk AST instead
 */
function shouldDoInterpolationComplete(text, relativeOffset) {
    const segments = text.split(' ');
    let offset = 0;
    for (const s of segments) {
        if (relativeOffset > offset && relativeOffset <= offset + s.length) {
            if (!s.includes('.')) {
                return true;
            }
            else {
                return false;
            }
        }
        offset += s.length;
        offset += 1; // For the space
    }
    return true;
}
exports.shouldDoInterpolationComplete = shouldDoInterpolationComplete;
function doVueInterpolationComplete(vueFileInfo) {
    const result = {
        isIncomplete: false,
        items: []
    };
    if (vueFileInfo.componentInfo.props) {
        vueFileInfo.componentInfo.props.forEach(p => {
            result.items.push({
                label: p.name,
                documentation: {
                    kind: 'markdown',
                    value: p.documentation || `\`${p.name}\` prop`
                },
                kind: vscode_languageserver_1.CompletionItemKind.Property
            });
        });
    }
    if (vueFileInfo.componentInfo.data) {
        vueFileInfo.componentInfo.data.forEach(p => {
            result.items.push({
                label: p.name,
                documentation: {
                    kind: 'markdown',
                    value: p.documentation || `\`${p.name}\` data`
                },
                kind: vscode_languageserver_1.CompletionItemKind.Property
            });
        });
    }
    if (vueFileInfo.componentInfo.computed) {
        vueFileInfo.componentInfo.computed.forEach(p => {
            result.items.push({
                label: p.name,
                documentation: {
                    kind: 'markdown',
                    value: p.documentation || `\`${p.name}\` computed`
                },
                kind: vscode_languageserver_1.CompletionItemKind.Property
            });
        });
    }
    if (vueFileInfo.componentInfo.methods) {
        vueFileInfo.componentInfo.methods.forEach(p => {
            result.items.push({
                label: p.name,
                documentation: {
                    kind: 'markdown',
                    value: p.documentation || `\`${p.name}\` method`
                },
                kind: vscode_languageserver_1.CompletionItemKind.Method
            });
        });
    }
    return result;
}
exports.doVueInterpolationComplete = doVueInterpolationComplete;
//# sourceMappingURL=vueInterpolationCompletion.js.map