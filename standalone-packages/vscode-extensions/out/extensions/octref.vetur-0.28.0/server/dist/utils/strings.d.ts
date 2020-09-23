import { VLSFormatConfig } from '../config';
import { MarkupContent } from 'vscode-languageserver';
export declare function getWordAtText(text: string, offset: number, wordDefinition: RegExp): {
    start: number;
    length: number;
};
export declare function removeQuotes(str: string): string;
/**
 *  wrap text in section tags like <template>, <style>
 *  add leading and trailing newline and optional indentation
 */
export declare function indentSection(text: string, options: VLSFormatConfig): string;
export declare function toMarkupContent(value: string | MarkupContent | undefined): "" | MarkupContent;
