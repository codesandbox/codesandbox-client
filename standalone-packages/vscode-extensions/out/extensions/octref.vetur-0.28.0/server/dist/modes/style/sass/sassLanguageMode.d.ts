import { LanguageMode } from '../../../embeddedSupport/languageModes';
import { TextDocument, Range, FormattingOptions, CompletionList } from 'vscode-languageserver-types/lib/umd/main';
import { TextEdit, Position } from 'vscode-css-languageservice';
export declare class SassLanguageMode implements LanguageMode {
    private config;
    constructor();
    getId(): string;
    configure(c: any): void;
    doComplete(document: TextDocument, position: Position): CompletionList;
    format(document: TextDocument, range: Range, formattingOptions: FormattingOptions): TextEdit[];
    onDocumentRemoved(document: TextDocument): void;
    dispose(): void;
}
