import { TextDocument } from 'vscode-languageserver';
export interface LanguageModelCache<T> {
    /**
     * - Feed updated document
     * - Use `parse` function to re-compute model
     * - Return re-computed model
     */
    refreshAndGet(document: TextDocument): T;
    onDocumentRemoved(document: TextDocument): void;
    dispose(): void;
}
export declare function getLanguageModelCache<T>(maxEntries: number, cleanupIntervalTimeInSec: number, parse: (document: TextDocument) => T): LanguageModelCache<T>;
