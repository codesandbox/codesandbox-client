import * as ts from 'typescript';
import { CompletionItemKind, SymbolKind } from 'vscode-languageserver';
export declare function isVueFile(path: string): boolean;
/**
 * If the path ends with `.vue.ts`, it's a `.vue` file pre-processed by Vetur
 * to be used in TS Language Service
 *
 * Note: all files outside any node_modules folder are considered,
 * EXCEPT if they are added to tsconfig via 'files' or 'include' properties
 */
export declare function isVirtualVueFile(path: string, projectFiles: Set<string>): boolean;
/**
 * If the path ends with `.vue.template`, it's a `.vue` file's template part
 * pre-processed by Vetur to calculate template diagnostics in TS Language Service
 */
export declare function isVirtualVueTemplateFile(path: string): boolean;
export declare function findNodeByOffset(root: ts.Node, offset: number): ts.Node | undefined;
export declare function toCompletionItemKind(kind: ts.ScriptElementKind): CompletionItemKind;
export declare function toSymbolKind(kind: ts.ScriptElementKind): SymbolKind;
