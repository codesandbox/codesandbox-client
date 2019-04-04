import { CompletionItem, Location, SignatureHelp, Definition, TextEdit, TextDocument, Diagnostic, DocumentLink, Range, Hover, DocumentHighlight, CompletionList, Position, FormattingOptions, SymbolInformation, ColorInformation, Color, ColorPresentation } from 'vscode-languageserver-types';
import { DocumentContext } from '../types';
import { VueInfoService } from '../services/vueInfoService';
export interface LanguageMode {
    getId(): string;
    configure?(options: any): void;
    configureService?(infoService: VueInfoService): void;
    updateFileInfo?(doc: TextDocument): void;
    doValidation?(document: TextDocument): Diagnostic[];
    doComplete?(document: TextDocument, position: Position): CompletionList;
    doResolve?(document: TextDocument, item: CompletionItem): CompletionItem;
    doHover?(document: TextDocument, position: Position): Hover;
    doSignatureHelp?(document: TextDocument, position: Position): SignatureHelp | null;
    findDocumentHighlight?(document: TextDocument, position: Position): DocumentHighlight[];
    findDocumentSymbols?(document: TextDocument): SymbolInformation[];
    findDocumentLinks?(document: TextDocument, documentContext: DocumentContext): DocumentLink[];
    findDefinition?(document: TextDocument, position: Position): Definition;
    findReferences?(document: TextDocument, position: Position): Location[];
    format?(document: TextDocument, range: Range, options: FormattingOptions): TextEdit[];
    findDocumentColors?(document: TextDocument): ColorInformation[];
    getColorPresentations?(document: TextDocument, color: Color, range: Range): ColorPresentation[];
    onDocumentChanged?(filePath: string): void;
    onDocumentRemoved(document: TextDocument): void;
    dispose(): void;
}
export interface LanguageModes {
    getModeAtPosition(document: TextDocument, position: Position): LanguageMode | null;
    getModesInRange(document: TextDocument, range: Range): LanguageModeRange[];
    getAllModes(): LanguageMode[];
    getAllModesInDocument(document: TextDocument): LanguageMode[];
    getMode(languageId: string): LanguageMode;
    onDocumentRemoved(document: TextDocument): void;
    dispose(): void;
}
export interface LanguageModeRange extends Range {
    mode: LanguageMode;
    attributeValue?: boolean;
}
export declare function getLanguageModes(workspacePath: string | null | undefined): LanguageModes;
