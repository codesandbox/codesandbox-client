import { TextDocument, Position, Range } from 'vscode-languageserver-types';
export interface LanguageRange extends Range {
    languageId: string;
    attributeValue?: boolean;
}
export interface VueDocumentRegions {
    getEmbeddedDocument(languageId: string): TextDocument;
    getEmbeddedDocumentByType(type: EmbeddedType): TextDocument;
    getLanguageRangeByType(type: EmbeddedType): LanguageRange | undefined;
    getLanguageRanges(range: Range): LanguageRange[];
    getLanguageAtPosition(position: Position): string;
    getLanguagesInDocument(): string[];
    getImportedScripts(): string[];
}
declare type EmbeddedType = 'template' | 'script' | 'style' | 'custom';
export declare function getDocumentRegions(document: TextDocument): VueDocumentRegions;
export {};
