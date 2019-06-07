/// <reference path="thenable.d.ts" />
/// <reference types="node" />
import { TextDocument, TextDocumentChangeEvent, TextDocumentWillSaveEvent, Location, Command, TextEdit, WorkspaceEdit, CompletionItem, CompletionList, Hover, SignatureHelp, Definition, DocumentHighlight, SymbolInformation, DocumentSymbol, WorkspaceSymbolParams, DocumentSymbolParams, CodeLens, DocumentLink, Range, RequestType, RequestType0, RequestHandler, RequestHandler0, GenericRequestHandler, StarRequestHandler, NotificationType, NotificationType0, NotificationHandler, NotificationHandler0, GenericNotificationHandler, StarNotificationHandler, RPCMessageType, MessageReader, MessageWriter, CancellationToken, Disposable, Event, ConnectionStrategy, InitializeParams, InitializeResult, InitializeError, InitializedParams, MessageActionItem, DidChangeConfigurationParams, DidOpenTextDocumentParams, DidChangeTextDocumentParams, DidCloseTextDocumentParams, DidSaveTextDocumentParams, WillSaveTextDocumentParams, DidChangeWatchedFilesParams, PublishDiagnosticsParams, TextDocumentPositionParams, CompletionParams, TextDocumentSyncKind, ReferenceParams, CodeActionParams, CodeLensParams, DocumentFormattingParams, DocumentRangeFormattingParams, DocumentOnTypeFormattingParams, RenameParams, DocumentLinkParams, ExecuteCommandParams, ApplyWorkspaceEditParams, ApplyWorkspaceEditResponse, ClientCapabilities, ServerCapabilities, DocumentColorParams, ColorInformation, ColorPresentationParams, ColorPresentation, CodeAction, FoldingRangeParams, FoldingRange, Declaration, DeclarationLink, DefinitionLink } from 'vscode-languageserver-protocol';
import { Configuration } from './configuration';
import { WorkspaceFolders } from './workspaceFolders';
export * from 'vscode-languageserver-protocol';
export { Event };
import * as fm from './files';
export declare namespace Files {
    let uriToFilePath: typeof fm.uriToFilePath;
    let resolveGlobalNodePath: typeof fm.resolveGlobalNodePath;
    let resolveGlobalYarnPath: typeof fm.resolveGlobalYarnPath;
    let resolve: typeof fm.resolve;
    let resolveModule: typeof fm.resolveModule;
    let resolveModule2: typeof fm.resolveModule2;
    let resolveModulePath: typeof fm.resolveModulePath;
}
/**
 * A manager for simple text documents
 */
export declare class TextDocuments {
    private _documents;
    private _onDidChangeContent;
    private _onDidOpen;
    private _onDidClose;
    private _onDidSave;
    private _onWillSave;
    private _willSaveWaitUntil;
    /**
     * Create a new text document manager.
     */
    constructor();
    /**
     * Returns the [TextDocumentSyncKind](#TextDocumentSyncKind) used by
     * this text document manager.
     */
    readonly syncKind: TextDocumentSyncKind;
    /**
     * An event that fires when a text document managed by this manager
     * has been opened or the content changes.
     */
    readonly onDidChangeContent: Event<TextDocumentChangeEvent>;
    /**
     * An event that fires when a text document managed by this manager
     * has been opened.
     */
    readonly onDidOpen: Event<TextDocumentChangeEvent>;
    /**
     * An event that fires when a text document managed by this manager
     * will be saved.
     */
    readonly onWillSave: Event<TextDocumentWillSaveEvent>;
    /**
     * Sets a handler that will be called if a participant wants to provide
     * edits during a text document save.
     */
    onWillSaveWaitUntil(handler: RequestHandler<TextDocumentWillSaveEvent, TextEdit[], void>): void;
    /**
     * An event that fires when a text document managed by this manager
     * has been saved.
     */
    readonly onDidSave: Event<TextDocumentChangeEvent>;
    /**
     * An event that fires when a text document managed by this manager
     * has been closed.
     */
    readonly onDidClose: Event<TextDocumentChangeEvent>;
    /**
     * Returns the document for the given URI. Returns undefined if
     * the document is not mananged by this instance.
     *
     * @param uri The text document's URI to retrieve.
     * @return the text document or `undefined`.
     */
    get(uri: string): TextDocument | undefined;
    /**
     * Returns all text documents managed by this instance.
     *
     * @return all text documents.
     */
    all(): TextDocument[];
    /**
     * Returns the URIs of all text documents managed by this instance.
     *
     * @return the URI's of all text documents.
     */
    keys(): string[];
    /**
     * Listens for `low level` notification on the given connection to
     * update the text documents managed by this instance.
     *
     * @param connection The connection to listen on.
     */
    listen(connection: IConnection): void;
}
/**
 * An empty interface for new proposed API.
 */
export interface _ {
}
/**
 * Helps tracking error message. Equal occurences of the same
 * message are only stored once. This class is for example
 * useful if text documents are validated in a loop and equal
 * error message should be folded into one.
 */
export declare class ErrorMessageTracker {
    private _messages;
    constructor();
    /**
     * Add a message to the tracker.
     *
     * @param message The message to add.
     */
    add(message: string): void;
    /**
     * Send all tracked messages to the connection's window.
     *
     * @param connection The connection established between client and server.
     */
    sendErrors(connection: {
        window: RemoteWindow;
    }): void;
}
/**
 *
 */
export interface Remote {
    /**
     * Attach the remote to the given connection.
     *
     * @param connection The connection this remote is operating on.
     */
    attach(connection: IConnection): void;
    /**
     * The connection this remote is attached to.
     */
    connection: IConnection;
    /**
     * Called to initialize the remote with the given
     * client capabilities
     *
     * @param capabilities The client capabilities
     */
    initialize(capabilities: ClientCapabilities): void;
    /**
     * Called to fill in the server capabilities this feature implements.
     *
     * @param capabilities The server capabilities to fill.
     */
    fillServerCapabilities(capabilities: ServerCapabilities): void;
}
/**
 * The RemoteConsole interface contains all functions to interact with
 * the tools / clients console or log system. Interally it used `window/logMessage`
 * notifications.
 */
export interface RemoteConsole extends Remote {
    /**
     * Show an error message.
     *
     * @param message The message to show.
     */
    error(message: string): void;
    /**
     * Show a warning message.
     *
     * @param message The message to show.
     */
    warn(message: string): void;
    /**
     * Show an information message.
     *
     * @param message The message to show.
     */
    info(message: string): void;
    /**
     * Log a message.
     *
     * @param message The message to log.
     */
    log(message: string): void;
}
/**
 * The RemoteWindow interface contains all functions to interact with
 * the visual window of VS Code.
 */
export interface RemoteWindow extends Remote {
    /**
     * Show an error message.
     *
     * @param message The message to show.
     */
    showErrorMessage(message: string): void;
    showErrorMessage<T extends MessageActionItem>(message: string, ...actions: T[]): Thenable<T | undefined>;
    /**
     * Show a warning message.
     *
     * @param message The message to show.
     */
    showWarningMessage(message: string): void;
    showWarningMessage<T extends MessageActionItem>(message: string, ...actions: T[]): Thenable<T | undefined>;
    /**
     * Show an information message.
     *
     * @param message The message to show.
     */
    showInformationMessage(message: string): void;
    showInformationMessage<T extends MessageActionItem>(message: string, ...actions: T[]): Thenable<T | undefined>;
}
/**
 * A bulk registration manages n single registration to be able to register
 * for n notifications or requests using one register request.
 */
export interface BulkRegistration {
    /**
     * Adds a single registration.
     * @param type the notification type to register for.
     * @param registerParams special registration parameters.
     */
    add<RO>(type: NotificationType0<RO>, registerParams: RO): void;
    add<P, RO>(type: NotificationType<P, RO>, registerParams: RO): void;
    /**
     * Adds a single registration.
     * @param type the request type to register for.
     * @param registerParams special registration parameters.
     */
    add<R, E, RO>(type: RequestType0<R, E, RO>, registerParams: RO): void;
    add<P, R, E, RO>(type: RequestType<P, R, E, RO>, registerParams: RO): void;
}
export declare namespace BulkRegistration {
    /**
     * Creates a new bulk registration.
     * @return an empty bulk registration.
     */
    function create(): BulkRegistration;
}
/**
 * A `BulkUnregistration` manages n unregistrations.
 */
export interface BulkUnregistration extends Disposable {
    /**
     * Disposes a single registration. It will be removed from the
     * `BulkUnregistration`.
     */
    disposeSingle(arg: string | RPCMessageType): boolean;
}
export declare namespace BulkUnregistration {
    function create(): BulkUnregistration;
}
/**
 * Interface to register and unregister `listeners` on the client / tools side.
 */
export interface RemoteClient extends Remote {
    /**
     * Registers a listener for the given notification.
     * @param type the notification type to register for.
     * @param registerParams special registration parameters.
     * @return a `Disposable` to unregister the listener again.
     */
    register<RO>(type: NotificationType0<RO>, registerParams?: RO): Thenable<Disposable>;
    register<P, RO>(type: NotificationType<P, RO>, registerParams?: RO): Thenable<Disposable>;
    /**
     * Registers a listener for the given notification.
     * @param unregisteration the unregistration to add a corresponding unregister action to.
     * @param type the notification type to register for.
     * @param registerParams special registration parameters.
     * @return the updated unregistration.
     */
    register<RO>(unregisteration: BulkUnregistration, type: NotificationType0<RO>, registerParams?: RO): Thenable<BulkUnregistration>;
    register<P, RO>(unregisteration: BulkUnregistration, type: NotificationType<P, RO>, registerParams?: RO): Thenable<BulkUnregistration>;
    /**
     * Registers a listener for the given request.
     * @param type the request type to register for.
     * @param registerParams special registration parameters.
     * @return a `Disposable` to unregister the listener again.
     */
    register<R, E, RO>(type: RequestType0<R, E, RO>, registerParams?: RO): Thenable<Disposable>;
    register<P, R, E, RO>(type: RequestType<P, R, E, RO>, registerParams?: RO): Thenable<Disposable>;
    /**
     * Registers a listener for the given request.
     * @param unregisteration the unregistration to add a corresponding unregister action to.
     * @param type the request type to register for.
     * @param registerParams special registration parameters.
     * @return the updated unregistration.
     */
    register<R, E, RO>(unregisteration: BulkUnregistration, type: RequestType0<R, E, RO>, registerParams?: RO): Thenable<BulkUnregistration>;
    register<P, R, E, RO>(unregisteration: BulkUnregistration, type: RequestType<P, R, E, RO>, registerParams?: RO): Thenable<BulkUnregistration>;
    /**
     * Registers a set of listeners.
     * @param registrations the bulk registration
     * @return a `Disposable` to unregister the listeners again.
     */
    register(registrations: BulkRegistration): Thenable<BulkUnregistration>;
}
/**
 * Represents the workspace managed by the client.
 */
export interface _RemoteWorkspace extends Remote {
    /**
     * Applies a `WorkspaceEdit` to the workspace
     * @param param the workspace edit params.
     * @return a thenable that resolves to the `ApplyWorkspaceEditResponse`.
     */
    applyEdit(paramOrEdit: ApplyWorkspaceEditParams | WorkspaceEdit): Thenable<ApplyWorkspaceEditResponse>;
}
export declare type RemoteWorkspace = _RemoteWorkspace & Configuration & WorkspaceFolders;
/**
 * Interface to log telemetry events. The events are actually send to the client
 * and the client needs to feed the event into a proper telemetry system.
 */
export interface Telemetry extends Remote {
    /**
     * Log the given data to telemetry.
     *
     * @param data The data to log. Must be a JSON serializable object.
     */
    logEvent(data: any): void;
}
/**
 * Interface to log traces to the client. The events are sent to the client and the
 * client needs to log the trace events.
 */
export interface Tracer extends Remote {
    /**
     * Log the given data to the trace Log
     */
    log(message: string, verbose?: string): void;
}
/**
 * Interface to describe the shape of the server connection.
 */
export interface Connection<PConsole = _, PTracer = _, PTelemetry = _, PClient = _, PWindow = _, PWorkspace = _> {
    /**
     * Start listening on the input stream for messages to process.
     */
    listen(): void;
    /**
     * Installs a request handler described by the given [RequestType](#RequestType).
     *
     * @param type The [RequestType](#RequestType) describing the request.
     * @param handler The handler to install
     */
    onRequest<R, E, RO>(type: RequestType0<R, E, RO>, handler: RequestHandler0<R, E>): void;
    onRequest<P, R, E, RO>(type: RequestType<P, R, E, RO>, handler: RequestHandler<P, R, E>): void;
    /**
     * Installs a request handler for the given method.
     *
     * @param method The method to register a request handler for.
     * @param handler The handler to install.
     */
    onRequest<R, E>(method: string, handler: GenericRequestHandler<R, E>): void;
    /**
     * Installs a request handler that is invoked if no specific request handler can be found.
     *
     * @param handler a handler that handles all requests.
     */
    onRequest(handler: StarRequestHandler): void;
    /**
     * Send a request to the client.
     *
     * @param type The [RequestType](#RequestType) describing the request.
     * @param params The request's parameters.
     */
    sendRequest<R, E, RO>(type: RequestType0<R, E, RO>, token?: CancellationToken): Thenable<R>;
    sendRequest<P, R, E, RO>(type: RequestType<P, R, E, RO>, params: P, token?: CancellationToken): Thenable<R>;
    /**
     * Send a request to the client.
     *
     * @param method The method to invoke on the client.
     * @param params The request's parameters.
     */
    sendRequest<R>(method: string, token?: CancellationToken): Thenable<R>;
    sendRequest<R>(method: string, params: any, token?: CancellationToken): Thenable<R>;
    /**
     * Installs a notification handler described by the given [NotificationType](#NotificationType).
     *
     * @param type The [NotificationType](#NotificationType) describing the notification.
     * @param handler The handler to install.
     */
    onNotification<RO>(type: NotificationType0<RO>, handler: NotificationHandler0): void;
    onNotification<P, RO>(type: NotificationType<P, RO>, handler: NotificationHandler<P>): void;
    /**
     * Installs a notification handler for the given method.
     *
     * @param method The method to register a request handler for.
     * @param handler The handler to install.
     */
    onNotification(method: string, handler: GenericNotificationHandler): void;
    /**
     * Installs a notification handler that is invoked if no specific notification handler can be found.
     *
     * @param handler a handler that handles all notifications.
     */
    onNotification(handler: StarNotificationHandler): void;
    /**
     * Send a notification to the client.
     *
     * @param type The [NotificationType](#NotificationType) describing the notification.
     * @param params The notification's parameters.
     */
    sendNotification<RO>(type: NotificationType0<RO>): void;
    sendNotification<P, RO>(type: NotificationType<P, RO>, params: P): void;
    /**
     * Send a notification to the client.
     *
     * @param method The method to invoke on the client.
     * @param params The notification's parameters.
     */
    sendNotification(method: string, params?: any): void;
    /**
     * Installs a handler for the initialize request.
     *
     * @param handler The initialize handler.
     */
    onInitialize(handler: RequestHandler<InitializeParams, InitializeResult, InitializeError>): void;
    /**
     * Installs a handler for the initialized notification.
     *
     * @param handler The initialized handler.
     */
    onInitialized(handler: NotificationHandler<InitializedParams>): void;
    /**
     * Installs a handler for the shutdown request.
     *
     * @param handler The initialize handler.
     */
    onShutdown(handler: RequestHandler0<void, void>): void;
    /**
     * Installs a handler for the exit notification.
     *
     * @param handler The exit handler.
     */
    onExit(handler: NotificationHandler0): void;
    /**
     * A proxy for VSCode's development console. See [RemoteConsole](#RemoteConsole)
     */
    console: RemoteConsole & PConsole;
    /**
     * A proxy to send trace events to the client.
     */
    tracer: Tracer & PTracer;
    /**
     * A proxy to send telemetry events to the client.
     */
    telemetry: Telemetry & PTelemetry;
    /**
     * A proxy interface for the language client interface to register for requests or
     * notifications.
     */
    client: RemoteClient & PClient;
    /**
     * A proxy for VSCode's window. See [RemoteWindow](#RemoteWindow)
     */
    window: RemoteWindow & PWindow;
    /**
     * A proxy to talk to the client's workspace.
     */
    workspace: RemoteWorkspace & PWorkspace;
    /**
     * Installs a handler for the `DidChangeConfiguration` notification.
     *
     * @param handler The corresponding handler.
     */
    onDidChangeConfiguration(handler: NotificationHandler<DidChangeConfigurationParams>): void;
    /**
     * Installs a handler for the `DidChangeWatchedFiles` notification.
     *
     * @param handler The corresponding handler.
     */
    onDidChangeWatchedFiles(handler: NotificationHandler<DidChangeWatchedFilesParams>): void;
    /**
     * Installs a handler for the `DidOpenTextDocument` notification.
     *
     * @param handler The corresponding handler.
     */
    onDidOpenTextDocument(handler: NotificationHandler<DidOpenTextDocumentParams>): void;
    /**
     * Installs a handler for the `DidChangeTextDocument` notification.
     *
     * @param handler The corresponding handler.
     */
    onDidChangeTextDocument(handler: NotificationHandler<DidChangeTextDocumentParams>): void;
    /**
     * Installs a handler for the `DidCloseTextDocument` notification.
     *
     * @param handler The corresponding handler.
     */
    onDidCloseTextDocument(handler: NotificationHandler<DidCloseTextDocumentParams>): void;
    /**
     * Installs a handler for the `WillSaveTextDocument` notification.
     *
     * Note that this notification is opt-in. The client will not send it unless
     * your server has the `textDocumentSync.willSave` capability or you've
     * dynamically registered for the `textDocument/willSave` method.
     *
     * @param handler The corresponding handler.
     */
    onWillSaveTextDocument(handler: NotificationHandler<WillSaveTextDocumentParams>): void;
    /**
     * Installs a handler for the `WillSaveTextDocumentWaitUntil` request.
     *
     * Note that this request is opt-in. The client will not send it unless
     * your server has the `textDocumentSync.willSaveWaitUntil` capability,
     * or you've dynamically registered for the `textDocument/willSaveWaitUntil`
     * method.
     *
     * @param handler The corresponding handler.
     */
    onWillSaveTextDocumentWaitUntil(handler: RequestHandler<WillSaveTextDocumentParams, TextEdit[] | undefined | null, void>): void;
    /**
     * Installs a handler for the `DidSaveTextDocument` notification.
     *
     * @param handler The corresponding handler.
     */
    onDidSaveTextDocument(handler: NotificationHandler<DidSaveTextDocumentParams>): void;
    /**
     * Sends diagnostics computed for a given document to VSCode to render them in the
     * user interface.
     *
     * @param params The diagnostic parameters.
     */
    sendDiagnostics(params: PublishDiagnosticsParams): void;
    /**
     * Installs a handler for the `Hover` request.
     *
     * @param handler The corresponding handler.
     */
    onHover(handler: RequestHandler<TextDocumentPositionParams, Hover | undefined | null, void>): void;
    /**
     * Installs a handler for the `Completion` request.
     *
     * @param handler The corresponding handler.
     */
    onCompletion(handler: RequestHandler<CompletionParams, CompletionItem[] | CompletionList | undefined | null, void>): void;
    /**
     * Installs a handler for the `CompletionResolve` request.
     *
     * @param handler The corresponding handler.
     */
    onCompletionResolve(handler: RequestHandler<CompletionItem, CompletionItem, void>): void;
    /**
     * Installs a handler for the `SignatureHelp` request.
     *
     * @param handler The corresponding handler.
     */
    onSignatureHelp(handler: RequestHandler<TextDocumentPositionParams, SignatureHelp | undefined | null, void>): void;
    /**
     * Installs a handler for the `Declaration` request.
     *
     * @param handler The corresponding handler.
     */
    onDeclaration(handler: RequestHandler<TextDocumentPositionParams, Declaration | DeclarationLink[] | undefined | null, void>): void;
    /**
     * Installs a handler for the `Definition` request.
     *
     * @param handler The corresponding handler.
     */
    onDefinition(handler: RequestHandler<TextDocumentPositionParams, Definition | DefinitionLink[] | undefined | null, void>): void;
    /**
     * Installs a handler for the `Type Definition` request.
     *
     * @param handler The corresponding handler.
     */
    onTypeDefinition(handler: RequestHandler<TextDocumentPositionParams, Definition | undefined | null, void>): void;
    /**
     * Installs a handler for the `Implementation` request.
     *
     * @param handler The corresponding handler.
     */
    onImplementation(handler: RequestHandler<TextDocumentPositionParams, Definition | undefined | null, void>): void;
    /**
     * Installs a handler for the `References` request.
     *
     * @param handler The corresponding handler.
     */
    onReferences(handler: RequestHandler<ReferenceParams, Location[] | undefined | null, void>): void;
    /**
     * Installs a handler for the `DocumentHighlight` request.
     *
     * @param handler The corresponding handler.
     */
    onDocumentHighlight(handler: RequestHandler<TextDocumentPositionParams, DocumentHighlight[] | undefined | null, void>): void;
    /**
     * Installs a handler for the `DocumentSymbol` request.
     *
     * @param handler The corresponding handler.
     */
    onDocumentSymbol(handler: RequestHandler<DocumentSymbolParams, SymbolInformation[] | DocumentSymbol[] | undefined | null, void>): void;
    /**
     * Installs a handler for the `WorkspaceSymbol` request.
     *
     * @param handler The corresponding handler.
     */
    onWorkspaceSymbol(handler: RequestHandler<WorkspaceSymbolParams, SymbolInformation[] | undefined | null, void>): void;
    /**
     * Installs a handler for the `CodeAction` request.
     *
     * @param handler The corresponding handler.
     */
    onCodeAction(handler: RequestHandler<CodeActionParams, (Command | CodeAction)[] | undefined | null, void>): void;
    /**
     * Compute a list of [lenses](#CodeLens). This call should return as fast as possible and if
     * computing the commands is expensive implementers should only return code lens objects with the
     * range set and handle the resolve request.
     *
     * @param handler The corresponding handler.
     */
    onCodeLens(handler: RequestHandler<CodeLensParams, CodeLens[] | undefined | null, void>): void;
    /**
     * This function will be called for each visible code lens, usually when scrolling and after
     * the onCodeLens has been called.
     *
     * @param handler The corresponding handler.
     */
    onCodeLensResolve(handler: RequestHandler<CodeLens, CodeLens, void>): void;
    /**
     * Installs a handler for the document formatting request.
     *
     * @param handler The corresponding handler.
     */
    onDocumentFormatting(handler: RequestHandler<DocumentFormattingParams, TextEdit[] | undefined | null, void>): void;
    /**
     * Installs a handler for the document range formatting request.
     *
     * @param handler The corresponding handler.
     */
    onDocumentRangeFormatting(handler: RequestHandler<DocumentRangeFormattingParams, TextEdit[] | undefined | null, void>): void;
    /**
     * Installs a handler for the document on type formatting request.
     *
     * @param handler The corresponding handler.
     */
    onDocumentOnTypeFormatting(handler: RequestHandler<DocumentOnTypeFormattingParams, TextEdit[] | undefined | null, void>): void;
    /**
     * Installs a handler for the rename request.
     *
     * @param handler The corresponding handler.
     */
    onRenameRequest(handler: RequestHandler<RenameParams, WorkspaceEdit | undefined | null, void>): void;
    /**
     * Installs a handler for the prepare rename request.
     *
     * @param handler The corresponding handler.
     */
    onPrepareRename(handler: RequestHandler<TextDocumentPositionParams, Range | {
        range: Range;
        placeholder: string;
    } | undefined | null, void>): void;
    /**
     * Installs a handler for the document links request.
     *
     * @param handler The corresponding handler.
     */
    onDocumentLinks(handler: RequestHandler<DocumentLinkParams, DocumentLink[] | undefined | null, void>): void;
    /**
     * Installs a handler for the document links resolve request.
     *
     * @param handler The corresponding handler.
     */
    onDocumentLinkResolve(handler: RequestHandler<DocumentLink, DocumentLink | undefined | null, void>): void;
    /**
     * Installs a handler for the document color request.
     *
     * @param handler The corresponding handler.
     */
    onDocumentColor(handler: RequestHandler<DocumentColorParams, ColorInformation[] | undefined | null, void>): void;
    /**
     * Installs a handler for the document color request.
     *
     * @param handler The corresponding handler.
     */
    onColorPresentation(handler: RequestHandler<ColorPresentationParams, ColorPresentation[] | undefined | null, void>): void;
    /**
     * Installs a handler for the folding ranges request.
     *
     * @param handler The corresponding handler.
     */
    onFoldingRanges(handler: RequestHandler<FoldingRangeParams, FoldingRange[] | undefined | null, void>): void;
    /**
     * Installs a handler for the execute command request.
     *
     * @param handler The corresponding handler.
     */
    onExecuteCommand(handler: RequestHandler<ExecuteCommandParams, any | undefined | null, void>): void;
    /**
     * Disposes the connection
     */
    dispose(): void;
}
export interface IConnection extends Connection {
}
export interface Feature<B, P> {
    (Base: new () => B): new () => B & P;
}
export declare type ConsoleFeature<P> = Feature<RemoteConsole, P>;
export declare function combineConsoleFeatures<O, T>(one: ConsoleFeature<O>, two: ConsoleFeature<T>): ConsoleFeature<O & T>;
export declare type TelemetryFeature<P> = Feature<Telemetry, P>;
export declare function combineTelemetryFeatures<O, T>(one: TelemetryFeature<O>, two: TelemetryFeature<T>): TelemetryFeature<O & T>;
export declare type TracerFeature<P> = Feature<Tracer, P>;
export declare function combineTracerFeatures<O, T>(one: TracerFeature<O>, two: TracerFeature<T>): TracerFeature<O & T>;
export declare type ClientFeature<P> = Feature<RemoteClient, P>;
export declare function combineClientFeatures<O, T>(one: ClientFeature<O>, two: ClientFeature<T>): ClientFeature<O & T>;
export declare type WindowFeature<P> = Feature<RemoteWindow, P>;
export declare function combineWindowFeatures<O, T>(one: WindowFeature<O>, two: WindowFeature<T>): WindowFeature<O & T>;
export declare type WorkspaceFeature<P> = Feature<RemoteWorkspace, P>;
export declare function combineWorkspaceFeatures<O, T>(one: WorkspaceFeature<O>, two: WorkspaceFeature<T>): WorkspaceFeature<O & T>;
export interface Features<PConsole = _, PTracer = _, PTelemetry = _, PClient = _, PWindow = _, PWorkspace = _> {
    __brand: 'features';
    console?: ConsoleFeature<PConsole>;
    tracer?: TracerFeature<PTracer>;
    telemetry?: TelemetryFeature<PTelemetry>;
    client?: ClientFeature<PClient>;
    window?: WindowFeature<PWindow>;
    workspace?: WorkspaceFeature<PWorkspace>;
}
export declare function combineFeatures<OConsole, OTracer, OTelemetry, OClient, OWindow, OWorkspace, TConsole, TTracer, TTelemetry, TClient, TWindow, TWorkspace>(one: Features<OConsole, OTracer, OTelemetry, OClient, OWindow, OWorkspace>, two: Features<TConsole, TTracer, TTelemetry, TClient, TWindow, TWorkspace>): Features<OConsole & TConsole, OTracer & TTracer, OTelemetry & TTelemetry, OClient & TClient, OWindow & TWindow, OWorkspace & TWorkspace>;
/**
 * Creates a new connection based on the processes command line arguments:
 *
 * @param strategy An optional connection strategy to control additional settings
 */
export declare function createConnection(strategy?: ConnectionStrategy): IConnection;
/**
 * Creates a new connection using a the given streams.
 *
 * @param inputStream The stream to read messages from.
 * @param outputStream The stream to write messages to.
 * @param strategy An optional connection strategy to control additional settings
 * @return a [connection](#IConnection)
 */
export declare function createConnection(inputStream: NodeJS.ReadableStream, outputStream: NodeJS.WritableStream, strategy?: ConnectionStrategy): IConnection;
/**
 * Creates a new connection.
 *
 * @param reader The message reader to read messages from.
 * @param writer The message writer to write message to.
 * @param strategy An optional connection strategy to control additional settings
 */
export declare function createConnection(reader: MessageReader, writer: MessageWriter, strategy?: ConnectionStrategy): IConnection;
/**
 * Creates a new connection based on the processes command line arguments. The new connection surfaces proposed API
 *
 * @param factories: the factories to use to implement the proposed API
 * @param strategy An optional connection strategy to control additional settings
 */
export declare function createConnection<PConsole = _, PTracer = _, PTelemetry = _, PClient = _, PWindow = _, PWorkspace = _>(factories: Features<PConsole, PTracer, PTelemetry, PClient, PWindow, PWorkspace>, strategy?: ConnectionStrategy): Connection<PConsole, PTracer, PTelemetry, PClient, PWindow, PWorkspace>;
/**
 * Creates a new connection using a the given streams.
 *
 * @param inputStream The stream to read messages from.
 * @param outputStream The stream to write messages to.
 * @param strategy An optional connection strategy to control additional settings
 * @return a [connection](#IConnection)
 */
export declare function createConnection<PConsole = _, PTracer = _, PTelemetry = _, PClient = _, PWindow = _, PWorkspace = _>(factories: Features<PConsole, PTracer, PTelemetry, PClient, PWindow, PWorkspace>, inputStream: NodeJS.ReadableStream, outputStream: NodeJS.WritableStream, strategy?: ConnectionStrategy): Connection<PConsole, PTracer, PTelemetry, PClient, PWindow, PWorkspace>;
/**
 * Creates a new connection.
 *
 * @param reader The message reader to read messages from.
 * @param writer The message writer to write message to.
 * @param strategy An optional connection strategy to control additional settings
 */
export declare function createConnection<PConsole = _, PTracer = _, PTelemetry = _, PClient = _, PWindow = _, PWorkspace = _>(factories: Features<PConsole, PTracer, PTelemetry, PClient, PWindow, PWorkspace>, reader: MessageReader, writer: MessageWriter, strategy?: ConnectionStrategy): Connection<PConsole, PTracer, PTelemetry, PClient, PWindow, PWorkspace>;
export declare namespace ProposedFeatures {
    const all: Features<_, _, _, _, _, _>;
}
