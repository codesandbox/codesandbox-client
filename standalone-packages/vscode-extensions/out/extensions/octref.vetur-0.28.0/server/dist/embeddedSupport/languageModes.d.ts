import { CompletionItem, Location, SignatureHelp, Definition, TextEdit, TextDocument, Diagnostic, DocumentLink, Range, Hover, DocumentHighlight, CompletionList, Position, FormattingOptions, SymbolInformation, CodeActionContext, ColorInformation, Color, ColorPresentation, CodeAction, WorkspaceEdit, FoldingRange } from 'vscode-languageserver-types';
import { LanguageId, LanguageRange } from './embeddedSupport';
import { DocumentContext, RefactorAction } from '../types';
import { VueInfoService } from '../services/vueInfoService';
import { DependencyService } from '../services/dependencyService';
import { VLSFullConfig } from '../config';
export interface VLSServices {
    infoService?: VueInfoService;
    dependencyService?: DependencyService;
}
export interface LanguageMode {
    getId(): string;
    configure?(options: VLSFullConfig): void;
    updateFileInfo?(doc: TextDocument): void;
    doValidation?(document: TextDocument): Diagnostic[];
    getCodeActions?(document: TextDocument, range: Range, formatParams: FormattingOptions, context: CodeActionContext): CodeAction[];
    getRefactorEdits?(doc: TextDocument, args: RefactorAction): WorkspaceEdit;
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
    getFoldingRanges?(document: TextDocument): FoldingRange[];
    onDocumentChanged?(filePath: string): void;
    onDocumentRemoved(document: TextDocument): void;
    dispose(): void;
}
export interface LanguageModeRange extends LanguageRange {
    mode: LanguageMode;
}
export declare class LanguageModes {
    private modes;
    private documentRegions;
    private modelCaches;
    private serviceHost;
    constructor();
    init(workspacePath: string, services: VLSServices, globalSnippetDir?: string): Promise<void>;
    getModeAtPosition(document: TextDocument, position: Position): LanguageMode | undefined;
    getAllLanguageModeRangesInDocument(document: TextDocument): LanguageModeRange[];
    getAllModes(): LanguageMode[];
    getMode(languageId: LanguageId): LanguageMode | undefined;
    onDocumentRemoved(document: TextDocument): void;
    dispose(): void;
}
