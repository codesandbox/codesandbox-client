"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettierTslintify = exports.prettierEslintify = exports.prettierify = void 0;
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const strings_1 = require("../strings");
const requirePkg_1 = require("./requirePkg");
const log_1 = require("../../log");
const path = require("path");
const VLS_PATH = path.resolve(__dirname, '../../../');
function prettierify(code, fileFsPath, workspacePath, range, vlsFormatConfig, parser, initialIndent) {
    try {
        const prettier = requirePkg_1.requireLocalPkg(fileFsPath, 'prettier');
        const prettierOptions = getPrettierOptions(prettier, fileFsPath, workspacePath, parser, vlsFormatConfig);
        log_1.logger.logDebug(`Using prettier. Options\n${JSON.stringify(prettierOptions)}`);
        const prettierifiedCode = prettier.format(code, prettierOptions);
        return [toReplaceTextedit(prettierifiedCode, range, vlsFormatConfig, initialIndent)];
    }
    catch (e) {
        console.log('Prettier format failed');
        console.error(e.message);
        return [];
    }
}
exports.prettierify = prettierify;
function prettierEslintify(code, fileFsPath, workspacePath, range, vlsFormatConfig, parser, initialIndent) {
    try {
        const prettier = requirePkg_1.requireLocalPkg(fileFsPath, 'prettier');
        const prettierEslint = requirePkg_1.requireLocalPkg(fileFsPath, 'prettier-eslint');
        const prettierOptions = getPrettierOptions(prettier, fileFsPath, workspacePath, parser, vlsFormatConfig);
        log_1.logger.logDebug(`Using prettier-eslint. Options\n${JSON.stringify(prettierOptions)}`);
        const prettierifiedCode = prettierEslint({
            prettierOptions: { parser },
            text: code,
            fallbackPrettierOptions: prettierOptions
        });
        return [toReplaceTextedit(prettierifiedCode, range, vlsFormatConfig, initialIndent)];
    }
    catch (e) {
        console.log('Prettier-Eslint format failed');
        console.error(e.message);
        return [];
    }
}
exports.prettierEslintify = prettierEslintify;
function prettierTslintify(code, fileFsPath, workspacePath, range, vlsFormatConfig, parser, initialIndent) {
    try {
        const prettier = requirePkg_1.requireLocalPkg(fileFsPath, 'prettier');
        const prettierTslint = requirePkg_1.requireLocalPkg(fileFsPath, 'prettier-tslint').format;
        const prettierOptions = getPrettierOptions(prettier, fileFsPath, workspacePath, parser, vlsFormatConfig);
        log_1.logger.logDebug(`Using prettier-tslint. Options\n${JSON.stringify(prettierOptions)}`);
        const prettierifiedCode = prettierTslint({
            prettierOptions: { parser },
            text: code,
            filePath: fileFsPath,
            fallbackPrettierOptions: prettierOptions
        });
        return [toReplaceTextedit(prettierifiedCode, range, vlsFormatConfig, initialIndent)];
    }
    catch (e) {
        console.log('Prettier-Tslint format failed');
        console.error(e.message);
        return [];
    }
}
exports.prettierTslintify = prettierTslintify;
function getPrettierOptions(prettierModule, fileFsPath, workspacePath, parser, vlsFormatConfig) {
    const prettierrcOptions = prettierModule.resolveConfig.sync(fileFsPath, { useCache: false });
    if (prettierrcOptions) {
        prettierrcOptions.tabWidth = prettierrcOptions.tabWidth || vlsFormatConfig.options.tabSize;
        prettierrcOptions.useTabs = prettierrcOptions.useTabs || vlsFormatConfig.options.useTabs;
        prettierrcOptions.parser = parser;
        // For loading plugins such as @prettier/plugin-pug
        prettierrcOptions.pluginSearchDirs = workspacePath ? [workspacePath, VLS_PATH] : [VLS_PATH];
        return prettierrcOptions;
    }
    else {
        const vscodePrettierOptions = vlsFormatConfig.defaultFormatterOptions.prettier || {};
        vscodePrettierOptions.tabWidth = vscodePrettierOptions.tabWidth || vlsFormatConfig.options.tabSize;
        vscodePrettierOptions.useTabs = vscodePrettierOptions.useTabs || vlsFormatConfig.options.useTabs;
        vscodePrettierOptions.parser = parser;
        // For loading plugins such as @prettier/plugin-pug
        vscodePrettierOptions.pluginSearchDirs = workspacePath ? [workspacePath, VLS_PATH] : [VLS_PATH];
        return vscodePrettierOptions;
    }
}
function toReplaceTextedit(prettierifiedCode, range, vlsFormatConfig, initialIndent) {
    if (initialIndent) {
        // Prettier adds newline at the end
        const formattedCode = '\n' + strings_1.indentSection(prettierifiedCode, vlsFormatConfig);
        return vscode_languageserver_types_1.TextEdit.replace(range, formattedCode);
    }
    else {
        return vscode_languageserver_types_1.TextEdit.replace(range, '\n' + prettierifiedCode);
    }
}
//# sourceMappingURL=index.js.map