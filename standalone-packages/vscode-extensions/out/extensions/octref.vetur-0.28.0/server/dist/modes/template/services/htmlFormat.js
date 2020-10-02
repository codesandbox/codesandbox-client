"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlFormat = void 0;
const _ = require("lodash");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const js_beautify_1 = require("js-beautify");
const requirePkg_1 = require("../../../utils/prettier/requirePkg");
const paths_1 = require("../../../utils/paths");
const prettier_1 = require("../../../utils/prettier");
const TEMPLATE_HEAD = '<template>';
const TEMPLATE_TAIL = '</template>';
function htmlFormat(document, currRange, vlsFormatConfig, workspacePath) {
    if (vlsFormatConfig.defaultFormatter.html === 'none') {
        return [];
    }
    const { value, range } = getValueAndRange(document, currRange);
    const originalSource = TEMPLATE_HEAD + value + TEMPLATE_TAIL;
    let beautifiedHtml;
    if (vlsFormatConfig.defaultFormatter.html === 'prettyhtml') {
        beautifiedHtml = formatWithPrettyHtml(paths_1.getFileFsPath(document.uri), originalSource, vlsFormatConfig);
    }
    else if (vlsFormatConfig.defaultFormatter.html === 'prettier') {
        const prettierResult = formatWithPrettier(originalSource, paths_1.getFileFsPath(document.uri), workspacePath, currRange, vlsFormatConfig, false);
        if (prettierResult[0] && prettierResult[0].newText) {
            beautifiedHtml = prettierResult[0].newText.trim();
        }
        else {
            beautifiedHtml = originalSource;
        }
    }
    else {
        beautifiedHtml = formatWithJsBeautify(originalSource, vlsFormatConfig);
    }
    const wrappedHtml = beautifiedHtml.substring(TEMPLATE_HEAD.length, beautifiedHtml.length - TEMPLATE_TAIL.length);
    return [
        {
            range,
            newText: wrappedHtml
        }
    ];
}
exports.htmlFormat = htmlFormat;
function formatWithPrettyHtml(fileFsPath, input, vlsFormatConfig) {
    const prettier = requirePkg_1.requireLocalPkg(fileFsPath, 'prettier');
    const prettierrcOptions = prettier.resolveConfig.sync(fileFsPath, { useCache: false }) || null;
    const prettyhtml = requirePkg_1.requireLocalPkg(fileFsPath, '@starptech/prettyhtml');
    const result = prettyhtml(input, getPrettyHtmlOptions(prettierrcOptions, vlsFormatConfig));
    return result.contents.trim();
}
function formatWithJsBeautify(input, vlsFormatConfig) {
    const htmlFormattingOptions = _.assign(defaultHtmlOptions, {
        indent_with_tabs: vlsFormatConfig.options.useTabs,
        indent_size: vlsFormatConfig.options.tabSize
    }, vlsFormatConfig.defaultFormatterOptions['js-beautify-html'], { end_with_newline: false });
    return js_beautify_1.html(input, htmlFormattingOptions);
}
function formatWithPrettier(code, fileFsPath, workspacePath, range, vlsFormatConfig, initialIndent) {
    return prettier_1.prettierify(code, fileFsPath, workspacePath, range, vlsFormatConfig, 'vue', initialIndent);
}
function getPrettyHtmlOptions(prettierrcOptions, vlsFormatConfig) {
    const fromVls = {
        useTabs: vlsFormatConfig.options.useTabs,
        tabWidth: vlsFormatConfig.options.tabSize
    };
    const fromPrettier = {};
    if (prettierrcOptions) {
        fromPrettier.useTabs = prettierrcOptions.useTabs;
        fromPrettier.tabWidth = prettierrcOptions.tabWidth;
        fromPrettier.printWidth = prettierrcOptions.printWidth;
    }
    return Object.assign(Object.assign(Object.assign(Object.assign({}, fromVls), fromPrettier), { usePrettier: true, prettier: Object.assign({}, prettierrcOptions) }), vlsFormatConfig.defaultFormatterOptions['prettyhtml']);
}
function getValueAndRange(document, currRange) {
    let value = document.getText();
    let range = currRange;
    if (currRange) {
        const startOffset = document.offsetAt(currRange.start);
        const endOffset = document.offsetAt(currRange.end);
        value = value.substring(startOffset, endOffset);
    }
    else {
        range = vscode_languageserver_types_1.Range.create(vscode_languageserver_types_1.Position.create(0, 0), document.positionAt(value.length));
    }
    return { value, range };
}
const defaultHtmlOptions = {
    end_with_newline: false,
    indent_char: ' ',
    indent_handlebars: false,
    indent_inner_html: false,
    indent_scripts: 'keep',
    indent_size: 2,
    indent_with_tabs: false,
    max_preserve_newlines: 1,
    preserve_newlines: true,
    unformatted: [],
    wrap_line_length: 0,
    wrap_attributes: 'force-expand-multiline'
    // Wrap attributes to new lines [auto|force|force-aligned|force-expand-multiline] ["auto"]
};
//# sourceMappingURL=htmlFormat.js.map