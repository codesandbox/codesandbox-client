"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eslint_1 = require("eslint");
const eslint_plugin_vue_1 = require("eslint-plugin-vue");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
function toDiagnostic(error) {
    const line = error.line - 1;
    const column = error.column - 1;
    const endLine = error.endLine ? error.endLine - 1 : line;
    const endColumn = error.endColumn ? error.endColumn - 1 : column;
    return {
        range: vscode_languageserver_types_1.Range.create(line, column, endLine, endColumn),
        message: `\n[${error.ruleId}]\n${error.message}`,
        source: 'eslint-plugin-vue',
        severity: error.severity === 1 ? vscode_languageserver_types_1.DiagnosticSeverity.Warning : vscode_languageserver_types_1.DiagnosticSeverity.Error
    };
}
function doValidation(document, engine) {
    const rawText = document.getText();
    // skip checking on empty template
    if (rawText.replace(/\s/g, '') === '') {
        return [];
    }
    const text = rawText.replace(/ {10}/, '<template>') + '</template>';
    const report = engine.executeOnText(text, document.uri);
    return report.results[0] ? report.results[0].messages.map(toDiagnostic) : [];
}
exports.doValidation = doValidation;
function createLintEngine() {
    return new eslint_1.CLIEngine(Object.assign({ useEslintrc: false }, eslint_plugin_vue_1.configs.base, eslint_plugin_vue_1.configs.essential));
}
exports.createLintEngine = createLintEngine;
//# sourceMappingURL=htmlValidation.js.map