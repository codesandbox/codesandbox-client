"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const js_beautify_1 = require("js-beautify");
const requirePkg_1 = require("../../../utils/prettier/requirePkg");
const paths_1 = require("../../../utils/paths");
const templateHead = '<template>';
const templateTail = '</template>';
function htmlFormat(document, currRange, vlsFormatConfig) {
    if (vlsFormatConfig.defaultFormatter.html === 'none') {
        return [];
    }
    const { value, range } = getValueAndRange(document, currRange);
    let beautifiedHtml;
    if (vlsFormatConfig.defaultFormatter.html === 'prettyhtml') {
        beautifiedHtml = formatWithPrettyHtml(paths_1.getFileFsPath(document.uri), templateHead + value + templateTail, vlsFormatConfig);
    }
    else {
        beautifiedHtml = formatWithJsBeautify(templateHead + value + templateTail, vlsFormatConfig);
    }
    const wrappedHtml = beautifiedHtml.substring(templateHead.length, beautifiedHtml.length - templateTail.length);
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
    const result = prettyhtml(input, Object.assign({ useTabs: vlsFormatConfig.options.useTabs, tabWidth: vlsFormatConfig.options.tabSize, usePrettier: true, prettier: Object.assign({}, prettierrcOptions) }, vlsFormatConfig.defaultFormatterOptions['prettyhtml']));
    return result.contents.trim();
}
function formatWithJsBeautify(input, vlsFormatConfig) {
    const htmlFormattingOptions = _.assign(defaultHtmlOptions, {
        indent_with_tabs: vlsFormatConfig.options.useTabs,
        indent_size: vlsFormatConfig.options.tabSize
    }, vlsFormatConfig.defaultFormatterOptions['js-beautify-html'], { end_with_newline: false });
    return js_beautify_1.html(input, htmlFormattingOptions);
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