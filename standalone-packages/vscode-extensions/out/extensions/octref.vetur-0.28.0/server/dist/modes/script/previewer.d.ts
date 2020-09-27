/**
 * Adapted from https://github.com/microsoft/vscode/blob/8ba70d8bdc3a10e3143cc4a131f333263bc48eef/extensions/typescript-language-features/src/utils/previewer.ts
 */
import * as ts from 'typescript';
export declare function getTagDocumentation(tag: ts.JSDocTagInfo): string | undefined;
export declare function plain(parts: ts.SymbolDisplayPart[] | string): string;
