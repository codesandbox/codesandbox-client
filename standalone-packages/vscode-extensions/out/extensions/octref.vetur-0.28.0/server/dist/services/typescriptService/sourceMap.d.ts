import { TextDocument, Range, Position } from 'vscode-languageserver-types';
import * as ts from 'typescript';
import { T_TypeScript } from '../dependencyService';
interface TemplateSourceMapRange {
    start: number;
    end: number;
}
interface TemplateSourceMapNodeFrom extends TemplateSourceMapRange {
    fileName: string;
}
interface TemplateSourceMapNodeTo extends TemplateSourceMapRange {
    fileName: string;
}
interface Mapping {
    [k: number]: number;
}
/**
 * Invariants:
 *
 * - `from.end - from.start` should equal to `to.end - to.start - 5 * (to.thisDotRanges.length)`
 * - Each item in `to.thisDotRanges` should have length 5 for `this.`
 */
export interface TemplateSourceMapNode {
    from: TemplateSourceMapNodeFrom;
    to: TemplateSourceMapNodeTo;
    offsetMapping: Mapping;
    offsetBackMapping: Mapping;
    mergedNodes: TemplateSourceMapNode[];
}
export interface TemplateSourceMap {
    [fileName: string]: TemplateSourceMapNode[];
}
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
export declare function generateSourceMap(tsModule: T_TypeScript, syntheticSourceFile: ts.SourceFile, validSourceFile: ts.SourceFile): TemplateSourceMapNode[];
/**
 * Map a range from actual `.vue` file to `.vue.template` file
 */
export declare function mapFromPositionToOffset(document: TextDocument, position: Position, sourceMap: TemplateSourceMap): number;
/**
 * Map a range from actual `.vue` file to `.vue.template` file
 */
export declare function mapToRange(toDocument: TextDocument, from: ts.TextSpan, sourceMap: TemplateSourceMap): Range;
/**
 * Map a range from virtual `.vue.template` file back to original `.vue` file
 */
export declare function mapBackRange(fromDocumnet: TextDocument, to: ts.TextSpan, sourceMap: TemplateSourceMap): Range;
export declare function printSourceMap(sourceMap: TemplateSourceMap, vueFileSrc: string, tsFileSrc: string): void;
export declare function stringifySourceMapNodes(sourceMapNodes: TemplateSourceMapNode[], vueFileSrc: string, tsFileSrc: string): string;
export {};
