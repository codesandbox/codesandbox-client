import { DocumentColorParams, DocumentFormattingParams, DocumentLinkParams, IConnection, TextDocumentPositionParams, ColorPresentationParams } from 'vscode-languageserver';
import { ColorInformation, CompletionItem, CompletionList, Definition, Diagnostic, DocumentHighlight, DocumentLink, DocumentSymbolParams, Hover, Location, SignatureHelp, SymbolInformation, TextDocument, TextEdit, ColorPresentation } from 'vscode-languageserver-types';
export declare class VLS {
    private workspacePath;
    private lspConnection;
    private documentService;
    private languageModes;
    private pendingValidationRequests;
    private validationDelayMs;
    private validation;
    private vueInfoService;
    constructor(workspacePath: string, lspConnection: IConnection);
    private setupConfigListeners;
    private setupLanguageFeatures;
    private setupFileChangeListeners;
    configure(config: any): void;
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
    onCompletion({ textDocument, position }: TextDocumentPositionParams): CompletionList;
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
    /**
     * Validations
     */
    private triggerValidation;
    cleanPendingValidation(textDocument: TextDocument): void;
    validateTextDocument(textDocument: TextDocument): void;
    doValidate(doc: TextDocument): Diagnostic[];
    removeDocument(doc: TextDocument): void;
    dispose(): void;
}
