"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifySourceMapNodes = exports.printSourceMap = exports.mapBackRange = exports.mapToRange = exports.mapFromPositionToOffset = exports.generateSourceMap = void 0;
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const paths_1 = require("../../utils/paths");
const INVALID_OFFSET = 0;
const INVALID_RANGE = vscode_languageserver_types_1.Range.create(0, 0, 0, 0);
/**
 * Walk through the validSourceFile, for each Node, find its corresponding Node in syntheticSourceFile.
 *
 * Generate a SourceMap with Nodes looking like this:
 *
 * SourceMapNode {
 *   from: {
 *     start: 0,
 *     end: 8
 *     filename: 'foo.vue'
 *   },
 *   to: {
 *     start: 0,
 *     end: 18
 *     filename: 'foo.vue.template'
 *   },
 *   offsetMapping: {
 *     0: 5,
 *     1: 6,
 *     2, 7
 *   },
 * }
 */
function generateSourceMap(tsModule, syntheticSourceFile, validSourceFile) {
    const sourceMapNodes = [];
    walkBothNode(syntheticSourceFile, validSourceFile);
    return foldSourceMapNodes(sourceMapNodes);
    function walkBothNode(syntheticNode, validNode) {
        const validNodeChildren = [];
        tsModule.forEachChild(validNode, c => {
            validNodeChildren.push(c);
            return false;
        });
        const syntheticNodeChildren = [];
        tsModule.forEachChild(syntheticNode, c => {
            syntheticNodeChildren.push(c);
            return false;
        });
        validNodeChildren.forEach((vc, i) => {
            const sc = syntheticNodeChildren[i];
            if (!sc) {
                return;
            }
            const scSourceRange = tsModule.getSourceMapRange(sc);
            /**
             * `getSourceMapRange` falls back to return actual Node if sourceMap doesn't exist
             * This check ensure we are checking the actual `sourceMapRange` being set
             */
            if (!scSourceRange.kind && scSourceRange.pos !== -1 && scSourceRange.end !== -1) {
                const sourceMapNode = {
                    from: {
                        start: scSourceRange.pos,
                        end: scSourceRange.end,
                        fileName: syntheticSourceFile.fileName
                    },
                    to: {
                        start: vc.getStart(),
                        end: vc.getEnd(),
                        fileName: validSourceFile.fileName
                    },
                    offsetMapping: {},
                    offsetBackMapping: {},
                    mergedNodes: []
                };
                const isThisInjected = tsModule.isPropertyAccessExpression(vc) && vc.expression.kind === tsModule.SyntaxKind.ThisKeyword;
                updateOffsetMapping(sourceMapNode, isThisInjected, !canIncludeTrivia(tsModule, vc));
                sourceMapNodes.push(sourceMapNode);
            }
            walkBothNode(sc, vc);
        });
    }
}
exports.generateSourceMap = generateSourceMap;
/**
 * Merge source map nodes when a node overwraps another node.
 * For example, the following expression will generates three source map nodes,
 * for `foo` identifier, `bar` identifier and entire binary expression `foo + bar`.
 *
 * `foo + bar`
 *
 * In this case `foo + bar` contains `foo` and `bar`. Then we will merge source map nodes
 * for the identifiers into the map for `foo + bar`.
 */
function foldSourceMapNodes(nodes) {
    return nodes.reduce((folded, node) => {
        const last = folded[folded.length - 1];
        if (!last) {
            return folded.concat(node);
        }
        // Children source map nodes always appear after a parent node
        // because of how we traverse source mapping in `walkBothNode` function.
        if (node.from.start < last.from.start || last.from.end < node.from.end) {
            return folded.concat(node);
        }
        last.offsetMapping = Object.assign(Object.assign({}, last.offsetMapping), node.offsetMapping);
        last.offsetBackMapping = Object.assign(Object.assign({}, last.offsetBackMapping), node.offsetBackMapping);
        last.mergedNodes.push(node);
        return folded;
    }, []);
}
function canIncludeTrivia(tsModule, node) {
    return !(tsModule.isIdentifier(node) ||
        tsModule.isStringLiteral(node) ||
        tsModule.isNumericLiteral(node) ||
        tsModule.isBigIntLiteral(node));
}
/**
 * Map a range from actual `.vue` file to `.vue.template` file
 */
function mapFromPositionToOffset(document, position, sourceMap) {
    const offset = document.offsetAt(position);
    return mapFromOffsetToOffset(document, offset, sourceMap);
}
exports.mapFromPositionToOffset = mapFromPositionToOffset;
/**
 * Map an offset from actual `.vue` file to `.vue.template` file
 */
function mapFromOffsetToOffset(document, offset, sourceMap) {
    const filePath = paths_1.getFileFsPath(document.uri);
    if (!sourceMap[filePath]) {
        return INVALID_OFFSET;
    }
    for (const sourceMapNode of sourceMap[filePath]) {
        if (offset >= sourceMapNode.from.start && offset <= sourceMapNode.from.end) {
            return sourceMapNode.offsetMapping[offset];
        }
    }
    // Handle the case when no original range can be mapped
    return INVALID_OFFSET;
}
/**
 * Map a range from actual `.vue` file to `.vue.template` file
 */
function mapToRange(toDocument, from, sourceMap) {
    const filePath = paths_1.getFileFsPath(toDocument.uri);
    if (!sourceMap[filePath]) {
        return INVALID_RANGE;
    }
    for (const sourceMapNode of sourceMap[filePath]) {
        if (from.start >= sourceMapNode.from.start && from.start + from.length <= sourceMapNode.from.end) {
            const mappedStart = sourceMapNode.offsetMapping[from.start];
            const mappedEnd = sourceMapNode.offsetMapping[from.start + from.length];
            return {
                start: toDocument.positionAt(mappedStart),
                end: toDocument.positionAt(mappedEnd)
            };
        }
    }
    // Handle the case when no original range can be mapped
    return INVALID_RANGE;
}
exports.mapToRange = mapToRange;
/**
 * Map a range from virtual `.vue.template` file back to original `.vue` file
 */
function mapBackRange(fromDocumnet, to, sourceMap) {
    const filePath = paths_1.getFileFsPath(fromDocumnet.uri);
    if (!sourceMap[filePath]) {
        return INVALID_RANGE;
    }
    for (const sourceMapNode of sourceMap[filePath]) {
        if (to.start >= sourceMapNode.to.start && to.start + to.length <= sourceMapNode.to.end) {
            const mappedStart = sourceMapNode.offsetBackMapping[to.start];
            const mappedEnd = sourceMapNode.offsetBackMapping[to.start + to.length];
            return {
                start: fromDocumnet.positionAt(mappedStart),
                end: fromDocumnet.positionAt(mappedEnd)
            };
        }
    }
    // Handle the case when no original range can be mapped
    return INVALID_RANGE;
}
exports.mapBackRange = mapBackRange;
function updateOffsetMapping(node, isThisInjected, fillIntermediate) {
    const nodeFromStart = node.from.start;
    const nodeToStart = node.to.start;
    const from = [...Array(node.from.end - nodeFromStart + 1).keys()];
    const to = [...Array(node.to.end - nodeToStart + 1).keys()];
    if (isThisInjected) {
        for (let i = 0; i < 'this.'.length; i++) {
            to[nodeToStart + i] = undefined;
        }
        /**
         * The case such as `foo` mapped to `this.foo`
         * Both `|this.foo` and `this.|foo` should map to `|foo`
         * Without this back mapping, mapping error from `this.bar` in `f(this.bar)` would fail
         */
        node.offsetBackMapping[nodeToStart] = nodeFromStart + 'this.'.length;
    }
    else if (to.length > from.length) {
        /**
         * The case when `to` is wider than `from`
         * For example, in `:foo="num"` to `{ "foo": this.num }`,
         * need to map `"foo"` back to `foo`
         */
        const delta = to.length - from.length;
        for (let i = 0; i < delta; i++) {
            node.offsetBackMapping[node.to.start + from.length + i] = node.from.end;
        }
    }
    const toFiltered = to;
    if (isThisInjected) {
        toFiltered.splice(nodeToStart, 'this.'.length);
    }
    const mapping = fillIntermediate
        ? from.map((from, i) => [from, toFiltered[i]])
        : [
            [from[0], toFiltered[0]],
            [from[from.length - 1], toFiltered[toFiltered.length - 1]]
        ];
    mapping.forEach(([fromOffset, toOffset]) => {
        const from = fromOffset + nodeFromStart;
        const to = toOffset + nodeToStart;
        if (!!from && !!to) {
            node.offsetMapping[from] = to;
            node.offsetBackMapping[to] = from;
        }
    });
    if (to.length < from.length) {
        /**
         * The case when `from` is wider than `to`
         * For example, in `<foooooo bar="" />` to `{ "props": { bar: ... }}`,
         * need to map `props` back to `foooooo`
         */
        node.offsetBackMapping[node.to.end] = node.from.end;
    }
}
function printSourceMap(sourceMap, vueFileSrc, tsFileSrc) {
    for (const fileName in sourceMap) {
        console.log(`Sourcemap for ${fileName}`);
        sourceMap[fileName].forEach(node => {
            const sf = vueFileSrc.slice(node.from.start, node.from.end);
            const st = vueFileSrc.slice(node.to.start, node.to.end);
            console.log(`[${node.from.start}, ${node.from.end}, ${sf}] => [${node.to.start}, ${node.to.end}, ${st}]`);
        });
        // console.log(JSON.stringify(sourceMap[fileName].offsetMapping));
    }
}
exports.printSourceMap = printSourceMap;
function stringifySourceMapNodes(sourceMapNodes, vueFileSrc, tsFileSrc) {
    let result = '';
    sourceMapNodes.forEach(node => {
        const sf = vueFileSrc.slice(node.from.start, node.from.end);
        const st = tsFileSrc.slice(node.to.start, node.to.end);
        result += `[${node.from.start}, ${node.from.end}, ${sf}] => [${node.to.start}, ${node.to.end}, ${st}]\n`;
    });
    return result;
}
exports.stringifySourceMapNodes = stringifySourceMapNodes;
//# sourceMappingURL=sourceMap.js.map