"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const css_colors_list_1 = require("./css-colors-list");
const stylus = require('stylus');
/**
 * Checks wether node is variable declaration
 * @param {StylusNode} node
 * @return {Boolean}
 */
function isVariableNode(node) {
    return node.__type === 'Ident' && !!node.val && node.val.__type === 'Expression';
}
exports.isVariableNode = isVariableNode;
/**
 * Checks wether node is function declaration
 * @param {StylusNode} node
 * @return {Boolean}
 */
function isFunctionNode(node) {
    return node.__type === 'Ident' && !!node.val && node.val.__type === 'Function';
}
exports.isFunctionNode = isFunctionNode;
/**
 * Checks wether node is selector node
 * @param {StylusNode} node
 * @return {Boolean}
 */
function isSelectorNode(node) {
    return node.__type === 'Selector';
}
exports.isSelectorNode = isSelectorNode;
/**
 * Checks wether node is selector call node e.g.:
 * {mySelectors}
 * @param {StylusNode} node
 * @return {Boolean}
 */
function isSelectorCallNode(node) {
    return node.__type === 'Call' && node.name === 'Selector';
}
exports.isSelectorCallNode = isSelectorCallNode;
/**
 * Checks wether node is at rule
 * @param {StylusNode} node
 * @return {Boolean}
 */
function isAtRuleNode(node) {
    return ['Media', 'Keyframes', 'Atrule', 'Import', 'Require', 'Supports', 'Literal'].indexOf(node.__type) !== -1;
}
exports.isAtRuleNode = isAtRuleNode;
/**
 * Checks wether node contains color
 * @param {StylusNode} node
 * @return {Boolean}
 */
function isColor(node) {
    if (node.__type === 'Ident' && css_colors_list_1.default.indexOf(node.name) >= 0) {
        return true;
    }
    if (node.__type === 'Rgba') {
        return true;
    }
    if (node.__type === 'Call' && ['rgb', 'rgba', 'hsl', 'hsla'].indexOf(node.name) >= 0) {
        return true;
    }
    return false;
}
exports.isColor = isColor;
/**
 * Parses text editor content and returns ast
 * @param {string} text - text editor content
 * @return {Object}
 */
function buildAst(text) {
    try {
        const root = new stylus.Parser(text).parse();
        // root is read only
        const ret = JSON.parse(JSON.stringify(root.toJSON()));
        addScope(ret, 0, []);
        return ret;
    }
    catch (error) {
        return null;
    }
}
exports.buildAst = buildAst;
/**
 * Add scope info to ast
 * @param {StylusNode} root the stylus node
 * @param {number} seq the order in parent node's children list, used as scope path segment
 * @param {number[]} scope represented as path from root ast, each path segment is seq number
 */
function addScope(root, seq, scope) {
    if (!root || typeof root !== 'object') {
        return;
    }
    root.__scope = scope;
    if (root.block) {
        const vals = root.block.nodes || [];
        for (let i = 0, l = vals.length; i < l; i++) {
            addScope(vals[i], i, scope.concat(seq));
        }
    }
    if (root.vals) {
        const vals = root.vals;
        for (let i = 0, l = vals.length; i < l; i++) {
            addScope(vals[i], i, scope.concat());
        }
    }
    if (root.segments) {
        for (const seg of root.segments) {
            addScope(seg, seq, scope.concat());
        }
    }
    if (root.expr) {
        addScope(root.expr, seq, scope.concat());
    }
    if (root.nodes) {
        const vals = root.nodes;
        for (let i = 0, l = vals.length; i < l; i++) {
            addScope(vals[i], i, scope.concat());
        }
    }
    if (root.val) {
        addScope(root.val, seq, scope.concat());
    }
}
/**
 * Flattens ast and removes useless nodes
 * @param {StylusNode} node
 * @return {Array}
 */
function flattenAndFilterAst(node, scope = []) {
    if (!node.__type) {
        return [];
    }
    node['scope'] = scope;
    let nested = [node];
    if (node.nodes) {
        let i = 0;
        for (const child of node.nodes) {
            const newScope = scope.concat(i++);
            nested = nested.concat(flattenAndFilterAst(child, newScope));
        }
    }
    if (node.block) {
        nested = nested.concat(flattenAndFilterAst(node.block, scope));
    }
    return nested;
}
exports.flattenAndFilterAst = flattenAndFilterAst;
function findNodeAtPosition(root, pos, needBlock = false) {
    // DFS: first find leaf node
    const block = root.block;
    let children = [];
    if (block) {
        children = [block]; //needBlock ? [block] : (block.nodes || [])
    }
    if (root.vals) {
        children = children.concat(root.vals);
    }
    if (root.expr) {
        children = children.concat(root.expr.nodes || []);
    }
    if (root.nodes) {
        children = children.concat(root.nodes);
    }
    if (root.val) {
        children.push(root.val);
    }
    for (const child of children) {
        const ret = findNodeAtPosition(child, pos);
        if (ret) {
            return ret;
        }
    }
    if (root.__type === 'Function' && root.lineno === pos.line + 1) {
        return root; // function node column is inconsisten, ignore
    }
    if (root.lineno !== pos.line + 1 || root.column > pos.character + 1) {
        // not in oneline, or root has passed pos
        return null;
    }
    return root;
}
exports.findNodeAtPosition = findNodeAtPosition;
//# sourceMappingURL=parser.js.map