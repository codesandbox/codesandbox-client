/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import * as errors from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import * as paths from '../../../base/common/paths.js';
import * as platform from '../../../base/common/platform.js';
import Severity from '../../../base/common/severity.js';
import { URI } from '../../../base/common/uri.js';
import { TextEditorCursorStyle } from '../../../editor/common/config/editorOptions.js';
import { OverviewRulerLane } from '../../../editor/common/model.js';
import * as languageConfiguration from '../../../editor/common/modes/languageConfiguration.js';
import { score } from '../../../editor/common/modes/languageSelector.js';
import * as files from '../../../platform/files/common/files.js';
import pkg from '../../../platform/node/package.js';
import product from '../../../platform/node/product.js';
import { ExtHostContext, MainContext } from './extHost.protocol.js';
import { ExtHostApiCommands } from './extHostApiCommands.js';
import { ExtHostClipboard } from './extHostClipboard.js';
import { ExtHostCommands } from './extHostCommands.js';
import { ExtHostDecorations } from './extHostDecorations.js';
import { ExtHostDiagnostics } from './extHostDiagnostics.js';
import { ExtHostDialogs } from './extHostDialogs.js';
import { ExtHostDocumentContentProvider } from './extHostDocumentContentProviders.js';
import { ExtHostDocumentSaveParticipant } from './extHostDocumentSaveParticipant.js';
import { ExtHostDocuments } from './extHostDocuments.js';
import { ExtHostDocumentsAndEditors } from './extHostDocumentsAndEditors.js';
import { ExtensionActivatedByAPI } from './extHostExtensionActivator.js';
import { ExtHostFileSystem } from './extHostFileSystem.js';
import { ExtHostFileSystemEventService } from './extHostFileSystemEventService.js';
import { ExtHostHeapService } from './extHostHeapService.js';
import { ExtHostLanguageFeatures } from './extHostLanguageFeatures.js';
import { ExtHostLanguages } from './extHostLanguages.js';
import { ExtHostMessageService } from './extHostMessageService.js';
import { ExtHostProgress } from './extHostProgress.js';
import { ExtHostQuickOpen } from './extHostQuickOpen.js';
import { ExtHostStatusBar } from './extHostStatusBar.js';
import { ExtHostEditors } from './extHostTextEditors.js';
import * as typeConverters from './extHostTypeConverters.js';
import * as extHostTypes from './extHostTypes.js';
import { ExtHostUrls } from './extHostUrls.js';
import { ExtHostWindow } from './extHostWindow.js';
import { throwProposedApiError, checkProposedApiEnabled, nullExtensionDescription } from '../../services/extensions/common/extensions.js';
function proposedApiFunction(extension, fn) {
    if (extension.enableProposedApi) {
        return fn;
    }
    else {
        return throwProposedApiError.bind(null, extension);
    }
}
/**
 * This method instantiates and returns the extension API surface
 */
export function createApiFactory(initData, rpcProtocol, extHostWorkspace, extHostConfiguration, extensionService, extHostLogService, extHostStorage) {
    var schemeTransformer = null;
    // Addressable instances
    rpcProtocol.set(ExtHostContext.ExtHostLogService, extHostLogService);
    var extHostHeapService = rpcProtocol.set(ExtHostContext.ExtHostHeapService, new ExtHostHeapService());
    var extHostDecorations = rpcProtocol.set(ExtHostContext.ExtHostDecorations, new ExtHostDecorations(rpcProtocol));
    // const extHostWebviews = rpcProtocol.set(ExtHostContext.ExtHostWebviews, new ExtHostWebviews(rpcProtocol));
    var extHostUrls = rpcProtocol.set(ExtHostContext.ExtHostUrls, new ExtHostUrls(rpcProtocol));
    var extHostDocumentsAndEditors = rpcProtocol.set(ExtHostContext.ExtHostDocumentsAndEditors, new ExtHostDocumentsAndEditors(rpcProtocol));
    var extHostDocuments = rpcProtocol.set(ExtHostContext.ExtHostDocuments, new ExtHostDocuments(rpcProtocol, extHostDocumentsAndEditors));
    var extHostDocumentContentProviders = rpcProtocol.set(ExtHostContext.ExtHostDocumentContentProviders, new ExtHostDocumentContentProvider(rpcProtocol, extHostDocumentsAndEditors, extHostLogService));
    var extHostDocumentSaveParticipant = rpcProtocol.set(ExtHostContext.ExtHostDocumentSaveParticipant, new ExtHostDocumentSaveParticipant(extHostLogService, extHostDocuments, rpcProtocol.getProxy(MainContext.MainThreadTextEditors)));
    var extHostEditors = rpcProtocol.set(ExtHostContext.ExtHostEditors, new ExtHostEditors(rpcProtocol, extHostDocumentsAndEditors));
    var extHostCommands = rpcProtocol.set(ExtHostContext.ExtHostCommands, new ExtHostCommands(rpcProtocol, extHostHeapService, extHostLogService));
    // const extHostTreeViews = rpcProtocol.set(ExtHostContext.ExtHostTreeViews, new ExtHostTreeViews(rpcProtocol.getProxy(MainContext.MainThreadTreeViews), extHostCommands, extHostLogService));
    rpcProtocol.set(ExtHostContext.ExtHostWorkspace, extHostWorkspace);
    rpcProtocol.set(ExtHostContext.ExtHostConfiguration, extHostConfiguration);
    var extHostDiagnostics = rpcProtocol.set(ExtHostContext.ExtHostDiagnostics, new ExtHostDiagnostics(rpcProtocol));
    var extHostLanguageFeatures = rpcProtocol.set(ExtHostContext.ExtHostLanguageFeatures, new ExtHostLanguageFeatures(rpcProtocol, schemeTransformer, extHostDocuments, extHostCommands, extHostHeapService, extHostDiagnostics, extHostLogService));
    var extHostFileSystem = rpcProtocol.set(ExtHostContext.ExtHostFileSystem, new ExtHostFileSystem(rpcProtocol, extHostLanguageFeatures));
    var extHostFileSystemEvent = rpcProtocol.set(ExtHostContext.ExtHostFileSystemEventService, new ExtHostFileSystemEventService(rpcProtocol, extHostDocumentsAndEditors));
    var extHostQuickOpen = rpcProtocol.set(ExtHostContext.ExtHostQuickOpen, new ExtHostQuickOpen(rpcProtocol, extHostWorkspace, extHostCommands));
    // const extHostTerminalService = rpcProtocol.set(ExtHostContext.ExtHostTerminalService, new ExtHostTerminalService(rpcProtocol, extHostConfiguration, extHostLogService));
    // const extHostDebugService = rpcProtocol.set(ExtHostContext.ExtHostDebugService, new ExtHostDebugService(rpcProtocol, extHostWorkspace, extensionService, extHostDocumentsAndEditors, extHostConfiguration, extHostTerminalService, extHostCommands));
    // const extHostSCM = rpcProtocol.set(ExtHostContext.ExtHostSCM, new ExtHostSCM(rpcProtocol, extHostCommands, extHostLogService));
    // const extHostSearch = rpcProtocol.set(ExtHostContext.ExtHostSearch, new ExtHostSearch(rpcProtocol, schemeTransformer, extHostLogService, extHostConfiguration));
    // const extHostTask = rpcProtocol.set(ExtHostContext.ExtHostTask, new ExtHostTask(rpcProtocol, extHostWorkspace, extHostDocumentsAndEditors, extHostConfiguration));
    var extHostWindow = rpcProtocol.set(ExtHostContext.ExtHostWindow, new ExtHostWindow(rpcProtocol));
    rpcProtocol.set(ExtHostContext.ExtHostExtensionService, extensionService);
    var extHostProgress = rpcProtocol.set(ExtHostContext.ExtHostProgress, new ExtHostProgress(rpcProtocol.getProxy(MainContext.MainThreadProgress)));
    // const exthostCommentProviders = rpcProtocol.set(ExtHostContext.ExtHostComments, new ExtHostComments(rpcProtocol, extHostCommands.converter, extHostDocuments));
    // const extHostOutputService = rpcProtocol.set(ExtHostContext.ExtHostOutputService, new ExtHostOutputService(initData.logsLocation, rpcProtocol));
    rpcProtocol.set(ExtHostContext.ExtHostStorage, extHostStorage);
    // Check that no named customers are missing
    var expected = Object.keys(ExtHostContext).map(function (key) { return ExtHostContext[key]; });
    rpcProtocol.assertRegistered(expected);
    // Other instances
    var extHostClipboard = new ExtHostClipboard(rpcProtocol);
    var extHostMessageService = new ExtHostMessageService(rpcProtocol);
    var extHostDialogs = new ExtHostDialogs(rpcProtocol);
    var extHostStatusBar = new ExtHostStatusBar(rpcProtocol);
    var extHostLanguages = new ExtHostLanguages(rpcProtocol, extHostDocuments);
    // Register an output channel for exthost log
    // const name = localize('extensionsLog', "Extension Host");
    // extHostOutputService.createOutputChannelFromLogFile(name, extHostLogService.logFile);
    // Register API-ish commands
    ExtHostApiCommands.register(extHostCommands);
    return function (extension) {
        var _this = this;
        // Check document selectors for being overly generic. Technically this isn't a problem but
        // in practice many extensions say they support `fooLang` but need fs-access to do so. Those
        // extension should specify then the `file`-scheme, e.g `{ scheme: 'fooLang', language: 'fooLang' }`
        // We only inform once, it is not a warning because we just want to raise awareness and because
        // we cannot say if the extension is doing it right or wrong...
        var checkSelector = (function () {
            var done = (!extension.isUnderDevelopment);
            function informOnce(selector) {
                if (!done) {
                    console.info("Extension '" + extension.id + "' uses a document selector without scheme. Learn more about this: https://go.microsoft.com/fwlink/?linkid=872305");
                    done = true;
                }
            }
            return function perform(selector) {
                if (Array.isArray(selector)) {
                    selector.forEach(perform);
                }
                else if (typeof selector === 'string') {
                    informOnce(selector);
                }
                else {
                    if (typeof selector.scheme === 'undefined') {
                        informOnce(selector);
                    }
                    if (!extension.enableProposedApi && typeof selector.exclusive === 'boolean') {
                        throwProposedApiError(extension);
                    }
                }
                return selector;
            };
        })();
        // Warn when trying to use the vscode.previewHtml command as it does not work properly in all scenarios and
        // has security concerns.
        var checkCommand = (function () {
            var done = !extension.isUnderDevelopment;
            var informOnce = function () {
                if (!done) {
                    done = true;
                    console.warn("Extension '" + extension.id + "' uses the 'vscode.previewHtml' command which is deprecated and will be removed. Please update your extension to use the Webview API: https://go.microsoft.com/fwlink/?linkid=2039309");
                }
            };
            return function (commandId) {
                if (commandId === 'vscode.previewHtml') {
                    informOnce();
                }
                return commandId;
            };
        })();
        // namespace: commands
        var commands = {
            registerCommand: function (id, command, thisArgs) {
                return extHostCommands.registerCommand(true, id, command, thisArgs);
            },
            registerTextEditorCommand: function (id, callback, thisArg) {
                return extHostCommands.registerCommand(true, id, function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var activeTextEditor = extHostEditors.getActiveTextEditor();
                    if (!activeTextEditor) {
                        console.warn('Cannot execute ' + id + ' because there is no active text editor.');
                        return undefined;
                    }
                    return activeTextEditor.edit(function (edit) {
                        args.unshift(activeTextEditor, edit);
                        callback.apply(thisArg, args);
                    }).then(function (result) {
                        if (!result) {
                            console.warn('Edits from command ' + id + ' were not applied.');
                        }
                    }, function (err) {
                        console.warn('An error occurred while running command ' + id, err);
                    });
                });
            },
            registerDiffInformationCommand: proposedApiFunction(extension, function (id, callback, thisArg) {
                return extHostCommands.registerCommand(true, id, function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return __awaiter(_this, void 0, void 0, function () {
                        var activeTextEditor, diff;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    activeTextEditor = extHostEditors.getActiveTextEditor();
                                    if (!activeTextEditor) {
                                        console.warn('Cannot execute ' + id + ' because there is no active text editor.');
                                        return [2 /*return*/, undefined];
                                    }
                                    return [4 /*yield*/, extHostEditors.getDiffInformation(activeTextEditor.id)];
                                case 1:
                                    diff = _a.sent();
                                    callback.apply(thisArg, [diff].concat(args));
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
            }),
            executeCommand: function (id) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return extHostCommands.executeCommand.apply(extHostCommands, [checkCommand(id)].concat(args));
            },
            getCommands: function (filterInternal) {
                if (filterInternal === void 0) { filterInternal = false; }
                return extHostCommands.getCommands(filterInternal);
            }
        };
        // namespace: env
        var env = Object.freeze({
            get machineId() { return initData.telemetryInfo.machineId; },
            get sessionId() { return initData.telemetryInfo.sessionId; },
            get language() { return platform.language; },
            get appName() { return product.nameLong; },
            get appRoot() { return initData.environment.appRoot.fsPath; },
            get logLevel() {
                checkProposedApiEnabled(extension);
                return extHostLogService.getLevel();
            },
            get onDidChangeLogLevel() {
                checkProposedApiEnabled(extension);
                return extHostLogService.onDidChangeLogLevel;
            },
            get clipboard() {
                return extHostClipboard;
            }
        });
        // namespace: extensions
        var extensions = {
            getExtension: function (extensionId) {
                var desc = extensionService.getExtensionDescription(extensionId);
                if (desc) {
                    return new Extension(extensionService, desc);
                }
                return undefined;
            },
            get all() {
                return extensionService.getAllExtensionDescriptions().map(function (desc) { return new Extension(extensionService, desc); });
            }
        };
        // namespace: languages
        var languages = {
            createDiagnosticCollection: function (name) {
                return extHostDiagnostics.createDiagnosticCollection(name);
            },
            get onDidChangeDiagnostics() {
                return extHostDiagnostics.onDidChangeDiagnostics;
            },
            getDiagnostics: function (resource) {
                return extHostDiagnostics.getDiagnostics(resource);
            },
            getLanguages: function () {
                return extHostLanguages.getLanguages();
            },
            setTextDocumentLanguage: function (document, languageId) {
                return extHostLanguages.changeLanguage(document.uri, languageId);
            },
            match: function (selector, document) {
                return score(typeConverters.LanguageSelector.from(selector), document.uri, document.languageId, true);
            },
            registerCodeActionsProvider: function (selector, provider, metadata) {
                return extHostLanguageFeatures.registerCodeActionProvider(extension, checkSelector(selector), provider, metadata);
            },
            registerCodeLensProvider: function (selector, provider) {
                return extHostLanguageFeatures.registerCodeLensProvider(extension, checkSelector(selector), provider);
            },
            registerDefinitionProvider: function (selector, provider) {
                return extHostLanguageFeatures.registerDefinitionProvider(extension, checkSelector(selector), provider);
            },
            registerDeclarationProvider: function (selector, provider) {
                return extHostLanguageFeatures.registerDeclarationProvider(extension, checkSelector(selector), provider);
            },
            registerImplementationProvider: function (selector, provider) {
                return extHostLanguageFeatures.registerImplementationProvider(extension, checkSelector(selector), provider);
            },
            registerTypeDefinitionProvider: function (selector, provider) {
                return extHostLanguageFeatures.registerTypeDefinitionProvider(extension, checkSelector(selector), provider);
            },
            registerHoverProvider: function (selector, provider) {
                return extHostLanguageFeatures.registerHoverProvider(extension, checkSelector(selector), provider, extension.id);
            },
            registerDocumentHighlightProvider: function (selector, provider) {
                return extHostLanguageFeatures.registerDocumentHighlightProvider(extension, checkSelector(selector), provider);
            },
            registerReferenceProvider: function (selector, provider) {
                return extHostLanguageFeatures.registerReferenceProvider(extension, checkSelector(selector), provider);
            },
            registerRenameProvider: function (selector, provider) {
                return extHostLanguageFeatures.registerRenameProvider(extension, checkSelector(selector), provider);
            },
            registerDocumentSymbolProvider: function (selector, provider) {
                return extHostLanguageFeatures.registerDocumentSymbolProvider(extension, checkSelector(selector), provider);
            },
            registerWorkspaceSymbolProvider: function (provider) {
                return extHostLanguageFeatures.registerWorkspaceSymbolProvider(extension, provider);
            },
            registerDocumentFormattingEditProvider: function (selector, provider) {
                return extHostLanguageFeatures.registerDocumentFormattingEditProvider(extension, checkSelector(selector), provider);
            },
            registerDocumentRangeFormattingEditProvider: function (selector, provider) {
                return extHostLanguageFeatures.registerDocumentRangeFormattingEditProvider(extension, checkSelector(selector), provider);
            },
            registerOnTypeFormattingEditProvider: function (selector, provider, firstTriggerCharacter) {
                var moreTriggerCharacters = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    moreTriggerCharacters[_i - 3] = arguments[_i];
                }
                return extHostLanguageFeatures.registerOnTypeFormattingEditProvider(extension, checkSelector(selector), provider, [firstTriggerCharacter].concat(moreTriggerCharacters));
            },
            registerSignatureHelpProvider: function (selector, provider, firstItem) {
                var remaining = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    remaining[_i - 3] = arguments[_i];
                }
                if (typeof firstItem === 'object') {
                    return extHostLanguageFeatures.registerSignatureHelpProvider(extension, checkSelector(selector), provider, firstItem);
                }
                return extHostLanguageFeatures.registerSignatureHelpProvider(extension, checkSelector(selector), provider, typeof firstItem === 'undefined' ? [] : [firstItem].concat(remaining));
            },
            registerCompletionItemProvider: function (selector, provider) {
                var triggerCharacters = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    triggerCharacters[_i - 2] = arguments[_i];
                }
                return extHostLanguageFeatures.registerCompletionItemProvider(extension, checkSelector(selector), provider, triggerCharacters);
            },
            registerDocumentLinkProvider: function (selector, provider) {
                return extHostLanguageFeatures.registerDocumentLinkProvider(extension, checkSelector(selector), provider);
            },
            registerColorProvider: function (selector, provider) {
                return extHostLanguageFeatures.registerColorProvider(extension, checkSelector(selector), provider);
            },
            registerFoldingRangeProvider: function (selector, provider) {
                return extHostLanguageFeatures.registerFoldingRangeProvider(extension, checkSelector(selector), provider);
            },
            setLanguageConfiguration: function (language, configuration) {
                return extHostLanguageFeatures.setLanguageConfiguration(language, configuration);
            }
        };
        // namespace: window
        var window = {
            get activeTextEditor() {
                return extHostEditors.getActiveTextEditor();
            },
            get visibleTextEditors() {
                return extHostEditors.getVisibleTextEditors();
            },
            get activeTerminal() {
                return {};
                // return extHostTerminalService.activeTerminal;
            },
            get terminals() {
                return [];
                // return extHostTerminalService.terminals;
            },
            showTextDocument: function (documentOrUri, columnOrOptions, preserveFocus) {
                var documentPromise;
                if (URI.isUri(documentOrUri)) {
                    documentPromise = Promise.resolve(workspace.openTextDocument(documentOrUri));
                }
                else {
                    documentPromise = Promise.resolve(documentOrUri);
                }
                return documentPromise.then(function (document) {
                    return extHostEditors.showTextDocument(document, columnOrOptions, preserveFocus);
                });
            },
            createTextEditorDecorationType: function (options) {
                return extHostEditors.createTextEditorDecorationType(options);
            },
            onDidChangeActiveTextEditor: function (listener, thisArg, disposables) {
                return extHostEditors.onDidChangeActiveTextEditor(listener, thisArg, disposables);
            },
            onDidChangeVisibleTextEditors: function (listener, thisArg, disposables) {
                return extHostEditors.onDidChangeVisibleTextEditors(listener, thisArg, disposables);
            },
            onDidChangeTextEditorSelection: function (listener, thisArgs, disposables) {
                return extHostEditors.onDidChangeTextEditorSelection(listener, thisArgs, disposables);
            },
            onDidChangeTextEditorOptions: function (listener, thisArgs, disposables) {
                return extHostEditors.onDidChangeTextEditorOptions(listener, thisArgs, disposables);
            },
            onDidChangeTextEditorVisibleRanges: function (listener, thisArgs, disposables) {
                return extHostEditors.onDidChangeTextEditorVisibleRanges(listener, thisArgs, disposables);
            },
            onDidChangeTextEditorViewColumn: function (listener, thisArg, disposables) {
                return extHostEditors.onDidChangeTextEditorViewColumn(listener, thisArg, disposables);
            },
            onDidCloseTerminal: function (listener, thisArg, disposables) {
                throw new Error('CodeSandbox does not support this yet');
                // return extHostTerminalService.onDidCloseTerminal(listener, thisArg, disposables);
            },
            onDidOpenTerminal: function (listener, thisArg, disposables) {
                throw new Error('CodeSandbox does not support this yet');
                // return extHostTerminalService.onDidOpenTerminal(listener, thisArg, disposables);
            },
            onDidChangeActiveTerminal: function (listener, thisArg, disposables) {
                // throw new Error('CodeSandbox does not support this yet');
                // return extHostTerminalService.onDidChangeActiveTerminal(listener, thisArg, disposables);
                return { dispose: function () { } };
            },
            get state() {
                return extHostWindow.state;
            },
            onDidChangeWindowState: function (listener, thisArg, disposables) {
                return extHostWindow.onDidChangeWindowState(listener, thisArg, disposables);
            },
            showInformationMessage: function (message, first) {
                var rest = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    rest[_i - 2] = arguments[_i];
                }
                return extHostMessageService.showMessage(extension, Severity.Info, message, first, rest);
            },
            showWarningMessage: function (message, first) {
                var rest = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    rest[_i - 2] = arguments[_i];
                }
                return extHostMessageService.showMessage(extension, Severity.Warning, message, first, rest);
            },
            showErrorMessage: function (message, first) {
                var rest = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    rest[_i - 2] = arguments[_i];
                }
                return extHostMessageService.showMessage(extension, Severity.Error, message, first, rest);
            },
            showQuickPick: function (items, options, token) {
                return extHostQuickOpen.showQuickPick(items, extension.enableProposedApi, options, token);
            },
            showWorkspaceFolderPick: function (options) {
                return extHostQuickOpen.showWorkspaceFolderPick(options);
            },
            showInputBox: function (options, token) {
                return extHostQuickOpen.showInput(options, token);
            },
            showOpenDialog: function (options) {
                return extHostDialogs.showOpenDialog(options);
            },
            showSaveDialog: function (options) {
                return extHostDialogs.showSaveDialog(options);
            },
            createStatusBarItem: function (position, priority) {
                return extHostStatusBar.createStatusBarEntry(extension.id, position, priority);
            },
            setStatusBarMessage: function (text, timeoutOrThenable) {
                return extHostStatusBar.setStatusBarMessage(text, timeoutOrThenable);
            },
            withScmProgress: function (task) {
                console.warn("[Deprecation Warning] function 'withScmProgress' is deprecated and should no longer be used. Use 'withProgress' instead.");
                return extHostProgress.withProgress(extension, { location: extHostTypes.ProgressLocation.SourceControl }, function (progress, token) { return task({ report: function (n) { } }); });
            },
            withProgress: function (options, task) {
                return extHostProgress.withProgress(extension, options, task);
            },
            createOutputChannel: function (name) {
                // throw new Error('CodeSandbox does not support this yet');
                console.warn('Creating output channels is not supported in CodeSandbox.');
                return {
                    name: name,
                    append: function (value) { console.log(name, value); },
                    appendLine: function (value) { console.log(name, value); },
                    clear: function () { },
                    show: function (p, preserveFocus) { },
                    hide: function () { },
                    dispose: function () { },
                };
                // return extHostOutputService.createOutputChannel(name);
            },
            createWebviewPanel: function (viewType, title, showOptions, options) {
                // throw new Error('CodeSandbox does not support this yet');
                return { dispose: function () { } };
                // return extHostWebviews.createWebview(extension, viewType, title, showOptions, options);
            },
            createTerminal: function (nameOrOptions, shellPath, shellArgs) {
                // throw new Error('CodeSandbox does not support this yet');
                return { dispose: function () { } };
                // if (typeof nameOrOptions === 'object') {
                // 	return extHostTerminalService.createTerminalFromOptions(<vscode.TerminalOptions>nameOrOptions);
                // }
                // return extHostTerminalService.createTerminal(<string>nameOrOptions, shellPath, shellArgs);
            },
            createTerminalRenderer: proposedApiFunction(extension, function (name) {
                // throw new Error('CodeSandbox does not support this yet');
                return { dispose: function () { } };
                // return extHostTerminalService.createTerminalRenderer(name);
            }),
            registerTreeDataProvider: function (viewId, treeDataProvider) {
                return { dispose: function () { } };
                // return extHostTreeViews.registerTreeDataProvider(viewId, treeDataProvider, extension);
            },
            createTreeView: function (viewId, options) {
                return { dispose: function () { } };
                // return extHostTreeViews.createTreeView(viewId, options, extension);
            },
            registerWebviewPanelSerializer: function (viewType, serializer) {
                // throw new Error('CodeSandbox does not support this yet');
                return { dispose: function () { } };
                // return extHostWebviews.registerWebviewPanelSerializer(viewType, serializer);
            },
            // proposed API
            sampleFunction: proposedApiFunction(extension, function () {
                return extHostMessageService.showMessage(extension, Severity.Info, 'Hello Proposed Api!', {}, []);
            }),
            registerDecorationProvider: proposedApiFunction(extension, function (provider) {
                return extHostDecorations.registerDecorationProvider(provider, extension.id);
            }),
            registerUriHandler: function (handler) {
                return extHostUrls.registerUriHandler(extension.id, handler);
            },
            createQuickPick: function () {
                return extHostQuickOpen.createQuickPick(extension.id, extension.enableProposedApi);
            },
            createInputBox: function () {
                return extHostQuickOpen.createInputBox(extension.id);
            },
        };
        // namespace: workspace
        var workspace = {
            get rootPath() {
                return extHostWorkspace.getPath();
            },
            set rootPath(value) {
                throw errors.readonly();
            },
            getWorkspaceFolder: function (resource) {
                return extHostWorkspace.getWorkspaceFolder(resource);
            },
            get workspaceFolders() {
                return extHostWorkspace.getWorkspaceFolders();
            },
            get name() {
                return extHostWorkspace.name;
            },
            set name(value) {
                throw errors.readonly();
            },
            updateWorkspaceFolders: function (index, deleteCount) {
                var workspaceFoldersToAdd = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    workspaceFoldersToAdd[_i - 2] = arguments[_i];
                }
                return extHostWorkspace.updateWorkspaceFolders.apply(extHostWorkspace, [extension, index, deleteCount || 0].concat(workspaceFoldersToAdd));
            },
            onDidChangeWorkspaceFolders: function (listener, thisArgs, disposables) {
                return extHostWorkspace.onDidChangeWorkspace(listener, thisArgs, disposables);
            },
            asRelativePath: function (pathOrUri, includeWorkspace) {
                return extHostWorkspace.getRelativePath(pathOrUri, includeWorkspace);
            },
            findFiles: function (include, exclude, maxResults, token) {
                return extHostWorkspace.findFiles(typeConverters.GlobPattern.from(include), typeConverters.GlobPattern.from(exclude), maxResults, extension.id, token);
            },
            findTextInFiles: function (query, optionsOrCallback, callbackOrToken, token) {
                var options;
                var callback;
                if (typeof optionsOrCallback === 'object') {
                    options = optionsOrCallback;
                    callback = callbackOrToken;
                }
                else {
                    options = {};
                    callback = optionsOrCallback;
                    token = callbackOrToken;
                }
                return extHostWorkspace.findTextInFiles(query, options || {}, callback, extension.id, token);
            },
            saveAll: function (includeUntitled) {
                return extHostWorkspace.saveAll(includeUntitled);
            },
            applyEdit: function (edit) {
                console.log('applying edit', edit);
                return extHostEditors.applyWorkspaceEdit(edit);
            },
            createFileSystemWatcher: function (pattern, ignoreCreate, ignoreChange, ignoreDelete) {
                return extHostFileSystemEvent.createFileSystemWatcher(typeConverters.GlobPattern.from(pattern), ignoreCreate, ignoreChange, ignoreDelete);
            },
            get textDocuments() {
                return extHostDocuments.getAllDocumentData().map(function (data) { return data.document; });
            },
            set textDocuments(value) {
                throw errors.readonly();
            },
            openTextDocument: function (uriOrFileNameOrOptions) {
                var uriPromise;
                var options = uriOrFileNameOrOptions;
                if (typeof uriOrFileNameOrOptions === 'string') {
                    uriPromise = Promise.resolve(URI.file(uriOrFileNameOrOptions));
                }
                else if (uriOrFileNameOrOptions instanceof URI) {
                    uriPromise = Promise.resolve(uriOrFileNameOrOptions);
                }
                else if (!options || typeof options === 'object') {
                    uriPromise = extHostDocuments.createDocumentData(options);
                }
                else {
                    throw new Error('illegal argument - uriOrFileNameOrOptions');
                }
                return uriPromise.then(function (uri) {
                    return extHostDocuments.ensureDocumentData(uri).then(function () {
                        var data = extHostDocuments.getDocumentData(uri);
                        return data && data.document;
                    });
                });
            },
            onDidOpenTextDocument: function (listener, thisArgs, disposables) {
                return extHostDocuments.onDidAddDocument(listener, thisArgs, disposables);
            },
            onDidCloseTextDocument: function (listener, thisArgs, disposables) {
                return extHostDocuments.onDidRemoveDocument(listener, thisArgs, disposables);
            },
            onDidChangeTextDocument: function (listener, thisArgs, disposables) {
                return extHostDocuments.onDidChangeDocument(listener, thisArgs, disposables);
            },
            onDidSaveTextDocument: function (listener, thisArgs, disposables) {
                return extHostDocuments.onDidSaveDocument(listener, thisArgs, disposables);
            },
            onWillSaveTextDocument: function (listener, thisArgs, disposables) {
                return extHostDocumentSaveParticipant.getOnWillSaveTextDocumentEvent(extension)(listener, thisArgs, disposables);
            },
            onDidChangeConfiguration: function (listener, thisArgs, disposables) {
                return extHostConfiguration.onDidChangeConfiguration(listener, thisArgs, disposables);
            },
            getConfiguration: function (section, resource) {
                resource = arguments.length === 1 ? void 0 : resource;
                return extHostConfiguration.getConfiguration(section, resource, extension.id);
            },
            registerTextDocumentContentProvider: function (scheme, provider) {
                return extHostDocumentContentProviders.registerTextDocumentContentProvider(scheme, provider);
            },
            registerTaskProvider: function (type, provider) {
                return { dispose: function () { } };
                // return extHostTask.registerTaskProvider(extension, provider);
            },
            registerFileSystemProvider: function (scheme, provider, options) {
                return extHostFileSystem.registerFileSystemProvider(scheme, provider, options);
            },
            registerFileSearchProvider: proposedApiFunction(extension, function (scheme, provider) {
                throw new Error('CodeSandbox does not support this yet');
                // return extHostSearch.registerFileSearchProvider(scheme, provider);
            }),
            registerSearchProvider: proposedApiFunction(extension, function () {
                // Temp for live share in Insiders
                return { dispose: function () { } };
            }),
            registerTextSearchProvider: proposedApiFunction(extension, function (scheme, provider) {
                throw new Error('CodeSandbox does not support this yet');
                // return extHostSearch.registerTextSearchProvider(scheme, provider);
            }),
            registerFileIndexProvider: proposedApiFunction(extension, function (scheme, provider) {
                throw new Error('CodeSandbox does not support this yet');
                // return extHostSearch.registerFileIndexProvider(scheme, provider);
            }),
            registerDocumentCommentProvider: proposedApiFunction(extension, function (provider) {
                throw new Error('CodeSandbox does not support this yet');
                // return exthostCommentProviders.registerDocumentCommentProvider(provider);
            }),
            registerWorkspaceCommentProvider: proposedApiFunction(extension, function (provider) {
                // return exthostCommentProviders.registerWorkspaceCommentProvider(extension.id, provider);
                return { dispose: function () { } };
            }),
            onDidRenameFile: proposedApiFunction(extension, function (listener, thisArg, disposables) {
                return extHostFileSystemEvent.onDidRenameFile(listener, thisArg, disposables);
            }),
            onWillRenameFile: proposedApiFunction(extension, function (listener, thisArg, disposables) {
                return extHostFileSystemEvent.getOnWillRenameFileEvent(extension)(listener, thisArg, disposables);
            })
        };
        // namespace: scm
        var scm = {
            get inputBox() {
                // throw new Error('CodeSandbox does not support this yet')
                return {};
                // return extHostSCM.getLastInputBox(extension);
            },
            createSourceControl: function (id, label, rootUri) {
                throw new Error('CodeSandbox does not support this yet');
                // return extHostSCM.createSourceControl(extension, id, label, rootUri);
            }
        };
        // namespace: debug
        var debug = {
        // get activeDebugSession() {
        // 	return extHostDebugService.activeDebugSession;
        // },
        // get activeDebugConsole() {
        // 	return extHostDebugService.activeDebugConsole;
        // },
        // get breakpoints() {
        // 	return extHostDebugService.breakpoints;
        // },
        // onDidStartDebugSession(listener, thisArg?, disposables?) {
        // 	return extHostDebugService.onDidStartDebugSession(listener, thisArg, disposables);
        // },
        // onDidTerminateDebugSession(listener, thisArg?, disposables?) {
        // 	return extHostDebugService.onDidTerminateDebugSession(listener, thisArg, disposables);
        // },
        // onDidChangeActiveDebugSession(listener, thisArg?, disposables?) {
        // 	return extHostDebugService.onDidChangeActiveDebugSession(listener, thisArg, disposables);
        // },
        // onDidReceiveDebugSessionCustomEvent(listener, thisArg?, disposables?) {
        // 	return extHostDebugService.onDidReceiveDebugSessionCustomEvent(listener, thisArg, disposables);
        // },
        // onDidChangeBreakpoints(listener, thisArgs?, disposables?) {
        // 	return extHostDebugService.onDidChangeBreakpoints(listener, thisArgs, disposables);
        // },
        // registerDebugConfigurationProvider(debugType: string, provider: vscode.DebugConfigurationProvider) {
        // 	return extHostDebugService.registerDebugConfigurationProvider(extension, debugType, provider);
        // },
        // startDebugging(folder: vscode.WorkspaceFolder | undefined, nameOrConfig: string | vscode.DebugConfiguration) {
        // 	return extHostDebugService.startDebugging(folder, nameOrConfig);
        // },
        // addBreakpoints(breakpoints: vscode.Breakpoint[]) {
        // 	return extHostDebugService.addBreakpoints(breakpoints);
        // },
        // removeBreakpoints(breakpoints: vscode.Breakpoint[]) {
        // 	return extHostDebugService.removeBreakpoints(breakpoints);
        // }
        };
        var tasks = {
        // registerTaskProvider: (type: string, provider: vscode.TaskProvider) => {
        // 	return extHostTask.registerTaskProvider(extension, provider);
        // },
        // fetchTasks: (filter?: vscode.TaskFilter): Thenable<vscode.Task[]> => {
        // 	return extHostTask.fetchTasks(filter);
        // },
        // executeTask: (task: vscode.Task): Thenable<vscode.TaskExecution> => {
        // 	return extHostTask.executeTask(extension, task);
        // },
        // get taskExecutions(): vscode.TaskExecution[] {
        // 	return extHostTask.taskExecutions;
        // },
        // onDidStartTask: (listeners, thisArgs?, disposables?) => {
        // 	return extHostTask.onDidStartTask(listeners, thisArgs, disposables);
        // },
        // onDidEndTask: (listeners, thisArgs?, disposables?) => {
        // 	return extHostTask.onDidEndTask(listeners, thisArgs, disposables);
        // },
        // onDidStartTaskProcess: (listeners, thisArgs?, disposables?) => {
        // 	return extHostTask.onDidStartTaskProcess(listeners, thisArgs, disposables);
        // },
        // onDidEndTaskProcess: (listeners, thisArgs?, disposables?) => {
        // 	return extHostTask.onDidEndTaskProcess(listeners, thisArgs, disposables);
        // }
        };
        return {
            version: pkg.version,
            // namespaces
            commands: commands,
            debug: debug,
            env: env,
            extensions: extensions,
            languages: languages,
            scm: scm,
            tasks: tasks,
            window: window,
            workspace: workspace,
            // types
            Breakpoint: extHostTypes.Breakpoint,
            CancellationTokenSource: CancellationTokenSource,
            CodeAction: extHostTypes.CodeAction,
            CodeActionKind: extHostTypes.CodeActionKind,
            CodeActionTrigger: extHostTypes.CodeActionTrigger,
            CodeLens: extHostTypes.CodeLens,
            Color: extHostTypes.Color,
            ColorInformation: extHostTypes.ColorInformation,
            ColorPresentation: extHostTypes.ColorPresentation,
            CommentThreadCollapsibleState: extHostTypes.CommentThreadCollapsibleState,
            CompletionItem: extHostTypes.CompletionItem,
            CompletionItemKind: extHostTypes.CompletionItemKind,
            CompletionItemInsertTextRule: extension.enableProposedApi ? extHostTypes.CompletionItemInsertTextRule : null,
            CompletionList: extHostTypes.CompletionList,
            CompletionTriggerKind: extHostTypes.CompletionTriggerKind,
            ConfigurationTarget: extHostTypes.ConfigurationTarget,
            DebugAdapterExecutable: extHostTypes.DebugAdapterExecutable,
            DebugAdapterServer: extHostTypes.DebugAdapterServer,
            DebugAdapterImplementation: extHostTypes.DebugAdapterImplementation,
            DecorationRangeBehavior: extHostTypes.DecorationRangeBehavior,
            Diagnostic: extHostTypes.Diagnostic,
            DiagnosticRelatedInformation: extHostTypes.DiagnosticRelatedInformation,
            DiagnosticSeverity: extHostTypes.DiagnosticSeverity,
            DiagnosticTag: extHostTypes.DiagnosticTag,
            Disposable: extHostTypes.Disposable,
            DocumentHighlight: extHostTypes.DocumentHighlight,
            DocumentHighlightKind: extHostTypes.DocumentHighlightKind,
            DocumentLink: extHostTypes.DocumentLink,
            DocumentSymbol: extHostTypes.DocumentSymbol,
            EndOfLine: extHostTypes.EndOfLine,
            EventEmitter: Emitter,
            FileChangeType: extHostTypes.FileChangeType,
            FileSystemError: extHostTypes.FileSystemError,
            FileType: files.FileType,
            FoldingRange: extHostTypes.FoldingRange,
            FoldingRangeKind: extHostTypes.FoldingRangeKind,
            FunctionBreakpoint: extHostTypes.FunctionBreakpoint,
            Hover: extHostTypes.Hover,
            IndentAction: languageConfiguration.IndentAction,
            Location: extHostTypes.Location,
            LogLevel: extHostTypes.LogLevel,
            MarkdownString: extHostTypes.MarkdownString,
            OverviewRulerLane: OverviewRulerLane,
            ParameterInformation: extHostTypes.ParameterInformation,
            Position: extHostTypes.Position,
            ProcessExecution: extHostTypes.ProcessExecution,
            ProgressLocation: extHostTypes.ProgressLocation,
            QuickInputButtons: extHostTypes.QuickInputButtons,
            Range: extHostTypes.Range,
            RelativePattern: extHostTypes.RelativePattern,
            Selection: extHostTypes.Selection,
            ShellExecution: extHostTypes.ShellExecution,
            ShellQuoting: extHostTypes.ShellQuoting,
            SignatureHelpTriggerReason: extHostTypes.SignatureHelpTriggerReason,
            SignatureHelp: extHostTypes.SignatureHelp,
            SignatureInformation: extHostTypes.SignatureInformation,
            SnippetString: extHostTypes.SnippetString,
            SourceBreakpoint: extHostTypes.SourceBreakpoint,
            SourceControlInputBoxValidationType: extHostTypes.SourceControlInputBoxValidationType,
            StatusBarAlignment: extHostTypes.StatusBarAlignment,
            SymbolInformation: extHostTypes.SymbolInformation,
            SymbolKind: extHostTypes.SymbolKind,
            Task: extHostTypes.Task,
            TaskGroup: extHostTypes.TaskGroup,
            TaskPanelKind: extHostTypes.TaskPanelKind,
            TaskRevealKind: extHostTypes.TaskRevealKind,
            TaskScope: extHostTypes.TaskScope,
            TextDocumentSaveReason: extHostTypes.TextDocumentSaveReason,
            TextEdit: extHostTypes.TextEdit,
            TextEditorCursorStyle: TextEditorCursorStyle,
            TextEditorLineNumbersStyle: extHostTypes.TextEditorLineNumbersStyle,
            TextEditorRevealType: extHostTypes.TextEditorRevealType,
            TextEditorSelectionChangeKind: extHostTypes.TextEditorSelectionChangeKind,
            ThemeColor: extHostTypes.ThemeColor,
            ThemeIcon: extHostTypes.ThemeIcon,
            TreeItem: extHostTypes.TreeItem,
            TreeItem2: extHostTypes.TreeItem,
            TreeItemCollapsibleState: extHostTypes.TreeItemCollapsibleState,
            Uri: URI,
            ViewColumn: extHostTypes.ViewColumn,
            WorkspaceEdit: extHostTypes.WorkspaceEdit,
        };
    };
}
/**
 * Returns the original fs path (using the original casing for the drive letter)
 */
export function originalFSPath(uri) {
    var result = uri.fsPath;
    if (/^[a-zA-Z]:/.test(result) && uri.path.charAt(1).toLowerCase() === result.charAt(0)) {
        // Restore original drive letter casing
        return uri.path.charAt(1) + result.substr(1);
    }
    return result;
}
var Extension = /** @class */ (function () {
    function Extension(extensionService, description) {
        this._extensionService = extensionService;
        this.id = description.id;
        this.extensionPath = paths.normalize(originalFSPath(description.extensionLocation), true);
        this.packageJSON = description;
    }
    Object.defineProperty(Extension.prototype, "isActive", {
        get: function () {
            return this._extensionService.isActivated(this.id);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Extension.prototype, "exports", {
        get: function () {
            return this._extensionService.getExtensionExports(this.id);
        },
        enumerable: true,
        configurable: true
    });
    Extension.prototype.activate = function () {
        var _this = this;
        return this._extensionService.activateByIdWithErrors(this.id, new ExtensionActivatedByAPI(false)).then(function () { return _this.exports; });
    };
    return Extension;
}());
export function initializeExtensionApi(extensionService, apiFactory) {
    return extensionService.getExtensionPathIndex().then(function (trie) { return defineAPI(apiFactory, trie); });
}
function defineAPI(factory, extensionPaths) {
    // each extension is meant to get its own api implementation
    var extApiImpl = new Map();
    var defaultApiImpl;
    var node_module = require.__$__nodeRequire('module');
    var original = node_module._load;
    node_module._load = function load(request, parent, isMain) {
        if (request !== 'vscode') {
            return original.apply(this, arguments);
        }
        // get extension id from filename and api for extension
        var ext = extensionPaths.findSubstr(URI.file(parent.filename).fsPath);
        if (ext) {
            var apiImpl = extApiImpl.get(ext.id);
            if (!apiImpl) {
                apiImpl = factory(ext);
                extApiImpl.set(ext.id, apiImpl);
            }
            return apiImpl;
        }
        // fall back to a default implementation
        if (!defaultApiImpl) {
            var extensionPathsPretty_1 = '';
            extensionPaths.forEach(function (value, index) { return extensionPathsPretty_1 += "\t" + index + " -> " + value.id + "\n"; });
            console.warn("Could not identify extension for 'vscode' require call from " + parent.filename + ". These are the extension path mappings: \n" + extensionPathsPretty_1);
            defaultApiImpl = factory(nullExtensionDescription);
        }
        return defaultApiImpl;
    };
}
