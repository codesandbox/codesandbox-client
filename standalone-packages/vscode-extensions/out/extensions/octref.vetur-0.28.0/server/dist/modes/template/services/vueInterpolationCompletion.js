"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVueInterpolationCompletionMap = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const util_1 = require("../../../services/typescriptService/util");
function getVueInterpolationCompletionMap(tsModule, fileName, offset, templateService, vueFileInfo) {
    const result = new Map();
    if (!isComponentCompletion(tsModule, fileName, offset, templateService)) {
        return;
    }
    if (vueFileInfo.componentInfo.props) {
        vueFileInfo.componentInfo.props.forEach(p => {
            result.set(p.name, {
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
            result.set(p.name, {
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
            result.set(p.name, {
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
            result.set(p.name, {
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
exports.getVueInterpolationCompletionMap = getVueInterpolationCompletionMap;
function isComponentCompletion(tsModule, fileName, offset, templateService) {
    const program = templateService.getProgram();
    if (!program) {
        return false;
    }
    const source = program.getSourceFile(fileName);
    if (!source) {
        return false;
    }
    const completionTarget = util_1.findNodeByOffset(source, offset);
    if (!completionTarget) {
        return false;
    }
    return (
    // Completion for direct component properties.
    // e.g. {{ valu| }}
    (tsModule.isPropertyAccessExpression(completionTarget.parent) &&
        completionTarget.parent.expression.kind === tsModule.SyntaxKind.ThisKeyword) ||
        // Completion for implicit component properties (e.g. triggering completion without any text).
        // e.g. {{ | }}
        !tsModule.isPropertyAccessExpression(completionTarget.parent));
}
//# sourceMappingURL=vueInterpolationCompletion.js.map