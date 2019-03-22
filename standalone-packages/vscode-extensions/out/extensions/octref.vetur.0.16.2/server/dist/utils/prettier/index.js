"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const strings_1 = require("../strings");
const requirePkg_1 = require("./requirePkg");
function prettierify(code, fileFsPath, range, vlsFormatConfig, parser, initialIndent) {
    try {
        const prettier = requirePkg_1.requireLocalPkg(fileFsPath, 'prettier');
        const prettierOptions = getPrettierOptions(prettier, fileFsPath, parser, vlsFormatConfig);
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
function prettierEslintify(code, fileFsPath, range, vlsFormatConfig, parser, initialIndent) {
    try {
        const prettier = requirePkg_1.requireLocalPkg(fileFsPath, 'prettier');
        const prettierEslint = requirePkg_1.requireLocalPkg(fileFsPath, 'prettier-eslint');
        const prettierOptions = getPrettierOptions(prettier, fileFsPath, parser, vlsFormatConfig);
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
function getPrettierOptions(prettierModule, fileFsPath, parser, vlsFormatConfig) {
    const prettierrcOptions = prettierModule.resolveConfig.sync(fileFsPath, { useCache: false });
    if (prettierrcOptions) {
        prettierrcOptions.tabWidth = prettierrcOptions.tabWidth || vlsFormatConfig.options.tabSize;
        prettierrcOptions.useTabs = prettierrcOptions.useTabs || vlsFormatConfig.options.useTabs;
        prettierrcOptions.parser = parser;
        return prettierrcOptions;
    }
    else {
        const vscodePrettierOptions = vlsFormatConfig.defaultFormatterOptions.prettier || {};
        vscodePrettierOptions.tabWidth = vscodePrettierOptions.tabWidth || vlsFormatConfig.options.tabSize;
        vscodePrettierOptions.useTabs = vscodePrettierOptions.useTabs || vlsFormatConfig.options.useTabs;
        vscodePrettierOptions.parser = parser;
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