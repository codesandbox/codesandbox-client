import { Position } from 'vscode-languageserver-types';
declare type NodeName = 'Ident' | 'Selector' | 'Call' | 'Function' | 'Media' | 'Keyframes' | 'Atrule' | 'Import' | 'Require' | 'Supports' | 'Literal' | 'Group' | 'Root' | 'Block' | 'Expression' | 'Rgba' | 'Property' | 'Object';
export interface StylusNode {
    __type: NodeName;
    name: NodeName;
    lineno: number;
    column: number;
    segments: StylusNode[];
    expr?: StylusNode;
    val?: StylusNode;
    nodes?: StylusNode[];
    vals?: StylusNode[];
    block?: StylusNode;
    __scope?: number[];
    string?: string;
}
/**
 * Checks wether node is variable declaration
 * @param {StylusNode} node
 * @return {Boolean}
 */
export declare function isVariableNode(node: StylusNode): boolean;
/**
 * Checks wether node is function declaration
 * @param {StylusNode} node
 * @return {Boolean}
 */
export declare function isFunctionNode(node: StylusNode): boolean;
/**
 * Checks wether node is selector node
 * @param {StylusNode} node
 * @return {Boolean}
 */
export declare function isSelectorNode(node: StylusNode): boolean;
/**
 * Checks wether node is selector call node e.g.:
 * {mySelectors}
 * @param {StylusNode} node
 * @return {Boolean}
 */
export declare function isSelectorCallNode(node: StylusNode): boolean;
/**
 * Checks wether node is at rule
 * @param {StylusNode} node
 * @return {Boolean}
 */
export declare function isAtRuleNode(node: StylusNode): boolean;
/**
 * Checks wether node contains color
 * @param {StylusNode} node
 * @return {Boolean}
 */
export declare function isColor(node: StylusNode): boolean;
/**
 * Parses text editor content and returns ast
 * @param {string} text - text editor content
 * @return {Object}
 */
export declare function buildAst(text: string): StylusNode | null;
/**
 * Flattens ast and removes useless nodes
 * @param {StylusNode} node
 * @return {Array}
 */
export declare function flattenAndFilterAst(node: StylusNode, scope?: number[]): StylusNode[];
export declare function findNodeAtPosition(root: StylusNode, pos: Position, needBlock?: boolean): StylusNode | null;
export {};
