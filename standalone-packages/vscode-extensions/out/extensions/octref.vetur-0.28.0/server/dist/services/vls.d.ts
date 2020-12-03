import { DocumentColorParams, DocumentFormattingParams, DocumentLinkParams, Connection, TextDocumentPositionParams, ColorPresentationParams, InitializeParams, ServerCapabilities, DocumentSymbolParams, CodeActionParams, CompletionParams, ExecuteCommandParams, FoldingRangeParams } from 'vscode-languageserver';
import { ColorInformation, CompletionItem, CompletionList, Definition, Diagnostic, DocumentHighlight, DocumentLink, Hover, Location, SignatureHelp, SymbolInformation, TextDocument, TextEdit, ColorPresentation, FoldingRange } from 'vscode-languageserver-types';
import { RefactorAction } from '../types';
import { VLSConfig } from '../config';
export declare class VLS {
    private lspConnection;
    private workspacePath;
    private documentService;
    private vueInfoService;
    private dependencyService;
    private languageModes;
    private pendingValidationRequests;
    private validationDelayMs;
    private validation;
    private templateInterpolationValidation;
    private documentFormatterRegistration;
    private config;
    constructor(lspConnection: Connection);
    init(params: InitializeParams): Promise<{
        capabilities: {};
    } | undefined>;
    listen(): void;
    private setupConfigListeners;
    private setupLSPHandlers;
    private setupCustomLSPHandlers;
    private setupDynamicFormatters;
    private setupFileChangeListeners;
    configure(config: VLSConfig): void;
    /**
     * Custom Notifications
     */
    displayInfoMessage(msg: string): void;
    displayWarningMessage(msg: string): void;
    displayErrorMessage(msg: string): void;
    /**
     * Language Features
     */
    onDocumentFormatting({ textDocument, options }: DocumentFormattingParams): TextEdit[];
    private toSimpleRange;
    onCompletion({ textDocument, position, context }: CompletionParams): CompletionList;
    onCompletionResolve(item: CompletionItem): CompletionItem;
    onHover({ textDocument, position }: TextDocumentPositionParams): Hover;
    onDocumentHighlight({ textDocument, position }: TextDocumentPositionParams): DocumentHighlight[];
    onDefinition({ textDocument, position }: TextDocumentPositionParams): Definition;
    onReferences({ textDocument, position }: TextDocumentPositionParams): Location[];
    onDocumentLinks({ textDocument }: DocumentLinkParams): DocumentLink[];
    onDocumentSymbol({ textDocument }: DocumentSymbolParams): SymbolInformation[];
    onDocumentColors({ textDocument }: DocumentColorParams): ColorInformation[];
    onColorPresentations({ textDocument, color, range }: ColorPresentationParams): ColorPresentation[];
    onSignatureHelp({ textDocument, position }: TextDocumentPositionParams): SignatureHelp | null;
    onFoldingRanges({ textDocument }: FoldingRangeParams): FoldingRange[];
    onCodeAction({ textDocument, range, context }: CodeActionParams): import("vscode-languageserver-types").CodeAction[];
    getRefactorEdits(refactorAction: RefactorAction): import("vscode-languageserver-types").WorkspaceEdit | undefined;
    private triggerValidation;
    cleanPendingValidation(textDocument: TextDocument): void;
    validateTextDocument(textDocument: TextDocument): void;
    doValidate(doc: TextDocument): Diagnostic[];
    executeCommand(arg: ExecuteCommandParams): Promise<void>;
    removeDocument(doc: TextDocument): void;
    dispose(): void;
    get capabilities(): ServerCapabilities;
}
