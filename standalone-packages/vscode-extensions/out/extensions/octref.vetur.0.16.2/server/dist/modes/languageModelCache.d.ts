import { TextDocument } from 'vscode-languageserver';
export interface LanguageModelCache<T> {
    get(document: TextDocument): T;
    onDocumentRemoved(document: TextDocument): void;
    dispose(): void;
}
export declare function getLanguageModelCache<T>(maxEntries: number, cleanupIntervalTimeInSec: number, parse: (document: TextDocument) => T): LanguageModelCache<T>;
