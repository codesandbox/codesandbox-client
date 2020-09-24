"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLintEngine = exports.doESLintValidation = void 0;
const eslint_1 = require("eslint");
const eslint_plugin_vue_1 = require("eslint-plugin-vue");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const path_1 = require("path");
const vueVersion_1 = require("../../../services/typescriptService/vueVersion");
function toDiagnostic(error) {
    const line = error.line - 1;
    const column = error.column - 1;
    const endLine = error.endLine ? error.endLine - 1 : line;
    const endColumn = error.endColumn ? error.endColumn - 1 : column;
    return {
        range: vscode_languageserver_types_1.Range.create(line, column, endLine, endColumn),
        message: `[${error.ruleId}]\n${error.message}`,
        source: 'eslint-plugin-vue',
        severity: error.severity === 1 ? vscode_languageserver_types_1.DiagnosticSeverity.Warning : vscode_languageserver_types_1.DiagnosticSeverity.Error
    };
}
function doESLintValidation(document, engine) {
    const rawText = document.getText();
    // skip checking on empty template
    if (rawText.replace(/\s/g, '') === '') {
        return [];
    }
    const text = rawText.replace(/ {10}/, '<template>') + '</template>';
    const report = engine.executeOnText(text, document.uri);
    return report.results[0] ? report.results[0].messages.map(toDiagnostic) : [];
}
exports.doESLintValidation = doESLintValidation;
function createLintEngine(vueVersion) {
    const SERVER_ROOT = path_1.resolve(__dirname, '../../../../');
    const basicConfig = Object.assign({ useEslintrc: false, 
        // So ESLint can find the bundled eslint-plugin-vue
        cwd: SERVER_ROOT }, eslint_plugin_vue_1.configs.base);
    const versionSpecificConfig = vueVersion === vueVersion_1.VueVersion.V30 ? eslint_plugin_vue_1.configs['vue3-essential'] : eslint_plugin_vue_1.configs.essential;
    return new eslint_1.CLIEngine(Object.assign(Object.assign({}, basicConfig), versionSpecificConfig));
}
exports.createLintEngine = createLintEngine;
//# sourceMappingURL=htmlEslintValidation.js.map