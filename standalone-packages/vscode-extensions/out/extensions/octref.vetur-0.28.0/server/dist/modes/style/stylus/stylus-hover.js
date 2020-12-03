"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stylusHover = void 0;
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const parser_1 = require("./parser");
const css_browser_data_1 = require("./css-browser-data");
const _ = require("lodash");
function stylusHover(document, position) {
    const ast = parser_1.buildAst(document.getText());
    if (!ast) {
        return {
            contents: ''
        };
    }
    const node = parser_1.findNodeAtPosition(ast, position);
    if (!node) {
        return {
            contents: 'no node found!'
        };
    }
    if (node.__type === 'Property') {
        const property = node.segments[0].name;
        const properties = css_browser_data_1.cssData.properties;
        const item = _.find(properties, item => item.name === property);
        const lineno = node.lineno - 1;
        const column = node.column;
        return {
            contents: (item && item.description) || 'unknown property',
            range: vscode_languageserver_types_1.Range.create(lineno, column, lineno, column + properties.length)
        };
    }
    return {
        contents: []
    };
}
exports.stylusHover = stylusHover;
//# sourceMappingURL=stylus-hover.js.map