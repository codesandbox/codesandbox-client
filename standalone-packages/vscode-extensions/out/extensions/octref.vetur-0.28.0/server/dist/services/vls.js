"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VLS = void 0;
const path = require("path");
const paths_1 = require("../utils/paths");
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_uri_1 = require("vscode-uri");
const languageModes_1 = require("../embeddedSupport/languageModes");
const nullMode_1 = require("../modes/nullMode");
const vueInfoService_1 = require("./vueInfoService");
const dependencyService_1 = require("./dependencyService");
const _ = require("lodash");
const documentService_1 = require("./documentService");
const log_1 = require("../log");
const config_1 = require("../config");
const javascript_1 = require("../modes/script/javascript");
class VLS {
    constructor(lspConnection) {
        this.lspConnection = lspConnection;
        this.pendingValidationRequests = {};
        this.validationDelayMs = 200;
        this.validation = {
            'vue-html': true,
            html: true,
            css: true,
            scss: true,
            less: true,
            postcss: true,
            javascript: true
        };
        this.templateInterpolationValidation = false;
        this.documentService = new documentService_1.DocumentService(this.lspConnection);
        this.vueInfoService = new vueInfoService_1.VueInfoService();
        this.dependencyService = new dependencyService_1.DependencyService();
        this.languageModes = new languageModes_1.LanguageModes();
    }
    init(params) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const config = ((_a = params.initializationOptions) === null || _a === void 0 ? void 0 : _a.config) ? _.merge(config_1.getDefaultVLSConfig(), params.initializationOptions.config)
                : config_1.getDefaultVLSConfig();
            const workspacePath = params.rootPath;
            if (!workspacePath) {
                console.error('No workspace path found. Vetur initialization failed.');
                return {
                    capabilities: {}
                };
            }
            this.workspacePath = workspacePath;
            yield this.vueInfoService.init(this.languageModes);
            yield this.dependencyService.init(workspacePath, config.vetur.useWorkspaceDependencies, config.typescript.tsdk);
            yield this.languageModes.init(workspacePath, {
                infoService: this.vueInfoService,
                dependencyService: this.dependencyService
            }, (_b = params.initializationOptions) === null || _b === void 0 ? void 0 : _b.globalSnippetDir);
            this.setupConfigListeners();
            this.setupLSPHandlers();
            this.setupCustomLSPHandlers();
            this.setupFileChangeListeners();
            this.lspConnection.onShutdown(() => {
                this.dispose();
            });
            this.configure(config);
        });
    }
    listen() {
        this.lspConnection.listen();
    }
    setupConfigListeners() {
        this.lspConnection.onDidChangeConfiguration(({ settings }) => __awaiter(this, void 0, void 0, function* () {
            if (settings) {
                this.configure(settings);
                // onDidChangeConfiguration will fire for Language Server startup
                yield this.setupDynamicFormatters(settings);
            }
        }));
        this.documentService.getAllDocuments().forEach(this.triggerValidation);
    }
    setupLSPHandlers() {
        this.lspConnection.onCompletion(this.onCompletion.bind(this));
        this.lspConnection.onCompletionResolve(this.onCompletionResolve.bind(this));
        this.lspConnection.onDefinition(this.onDefinition.bind(this));
        this.lspConnection.onDocumentFormatting(this.onDocumentFormatting.bind(this));
        this.lspConnection.onDocumentHighlight(this.onDocumentHighlight.bind(this));
        this.lspConnection.onDocumentLinks(this.onDocumentLinks.bind(this));
        this.lspConnection.onDocumentSymbol(this.onDocumentSymbol.bind(this));
        this.lspConnection.onHover(this.onHover.bind(this));
        this.lspConnection.onReferences(this.onReferences.bind(this));
        this.lspConnection.onSignatureHelp(this.onSignatureHelp.bind(this));
        this.lspConnection.onFoldingRanges(this.onFoldingRanges.bind(this));
        this.lspConnection.onCodeAction(this.onCodeAction.bind(this));
        this.lspConnection.onDocumentColor(this.onDocumentColors.bind(this));
        this.lspConnection.onColorPresentation(this.onColorPresentations.bind(this));
        this.lspConnection.onExecuteCommand(this.executeCommand.bind(this));
    }
    setupCustomLSPHandlers() {
        this.lspConnection.onRequest('$/queryVirtualFileInfo', ({ fileName, currFileText }) => {
            return this.languageModes.getMode('vue-html').queryVirtualFileInfo(fileName, currFileText);
        });
        this.lspConnection.onRequest('$/getDiagnostics', params => {
            const doc = this.documentService.getDocument(params.uri);
            if (doc) {
                return this.doValidate(doc);
            }
            return [];
        });
    }
    setupDynamicFormatters(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            if (settings.vetur.format.enable === true) {
                if (!this.documentFormatterRegistration) {
                    this.documentFormatterRegistration = yield this.lspConnection.client.register(vscode_languageserver_1.DocumentFormattingRequest.type, {
                        documentSelector: ['vue']
                    });
                }
            }
            else {
                if (this.documentFormatterRegistration) {
                    this.documentFormatterRegistration.dispose();
                }
            }
        });
    }
    setupFileChangeListeners() {
        this.documentService.onDidChangeContent(change => {
            this.triggerValidation(change.document);
        });
        this.documentService.onDidClose(e => {
            this.removeDocument(e.document);
            this.lspConnection.sendDiagnostics({ uri: e.document.uri, diagnostics: [] });
        });
        this.lspConnection.onDidChangeWatchedFiles(({ changes }) => {
            const jsMode = this.languageModes.getMode('javascript');
            if (!jsMode) {
                throw Error(`Can't find JS mode.`);
            }
            changes.forEach(c => {
                if (c.type === vscode_languageserver_1.FileChangeType.Changed) {
                    const fsPath = paths_1.getFileFsPath(c.uri);
                    jsMode.onDocumentChanged(fsPath);
                }
            });
            this.documentService.getAllDocuments().forEach(d => {
                this.triggerValidation(d);
            });
        });
    }
    configure(config) {
        this.config = config;
        const veturValidationOptions = config.vetur.validation;
        this.validation['vue-html'] = veturValidationOptions.template;
        this.validation.css = veturValidationOptions.style;
        this.validation.postcss = veturValidationOptions.style;
        this.validation.scss = veturValidationOptions.style;
        this.validation.less = veturValidationOptions.style;
        this.validation.javascript = veturValidationOptions.script;
        this.templateInterpolationValidation = config.vetur.experimental.templateInterpolationService;
        this.languageModes.getAllModes().forEach(m => {
            if (m.configure) {
                m.configure(config);
            }
        });
        log_1.logger.setLevel(config.vetur.dev.logLevel);
    }
    /**
     * Custom Notifications
     */
    displayInfoMessage(msg) {
        this.lspConnection.sendNotification('$/displayInfo', msg);
    }
    displayWarningMessage(msg) {
        this.lspConnection.sendNotification('$/displayWarning', msg);
    }
    displayErrorMessage(msg) {
        this.lspConnection.sendNotification('$/displayError', msg);
    }
    /**
     * Language Features
     */
    onDocumentFormatting({ textDocument, options }) {
        const doc = this.documentService.getDocument(textDocument.uri);
        const modeRanges = this.languageModes.getAllLanguageModeRangesInDocument(doc);
        const allEdits = [];
        const errMessages = [];
        modeRanges.forEach(modeRange => {
            if (modeRange.mode && modeRange.mode.format) {
                try {
                    const edits = modeRange.mode.format(doc, this.toSimpleRange(modeRange), options);
                    for (const edit of edits) {
                        allEdits.push(edit);
                    }
                }
                catch (err) {
                    errMessages.push(err.toString());
                }
            }
        });
        if (errMessages.length !== 0) {
            this.displayErrorMessage('Formatting failed: "' + errMessages.join('\n') + '"');
            return [];
        }
        return allEdits;
    }
    toSimpleRange(modeRange) {
        return {
            start: modeRange.start,
            end: modeRange.end
        };
    }
    onCompletion({ textDocument, position, context }) {
        var _a;
        const doc = this.documentService.getDocument(textDocument.uri);
        const mode = this.languageModes.getModeAtPosition(doc, position);
        if (mode && mode.doComplete) {
            /**
             * Only use space as trigger character in `vue-html` mode
             */
            if (mode.getId() !== 'vue-html' &&
                context &&
                (context === null || context === void 0 ? void 0 : context.triggerKind) === vscode_languageserver_1.CompletionTriggerKind.TriggerCharacter &&
                context.triggerCharacter === ' ') {
                return nullMode_1.NULL_COMPLETION;
            }
            /**
             * Do not use `'` and `"` as trigger character in js/ts mode
             */
            if (mode.getId() === 'javascript' &&
                (context === null || context === void 0 ? void 0 : context.triggerKind) === vscode_languageserver_1.CompletionTriggerKind.TriggerCharacter && ((_a = context.triggerCharacter) === null || _a === void 0 ? void 0 : _a.match(/['"]/))) {
                return nullMode_1.NULL_COMPLETION;
            }
            return mode.doComplete(doc, position);
        }
        return nullMode_1.NULL_COMPLETION;
    }
    onCompletionResolve(item) {
        if (item.data) {
            const uri = item.data.uri;
            const languageId = item.data.languageId;
            /**
             * Template files need to go through HTML-template service
             */
            if (uri.endsWith('.template')) {
                const doc = this.documentService.getDocument(uri.slice(0, -'.template'.length));
                const mode = this.languageModes.getMode(languageId);
                if (doc && mode && mode.doResolve) {
                    return mode.doResolve(doc, item);
                }
            }
            if (uri && languageId) {
                const doc = this.documentService.getDocument(uri);
                const mode = this.languageModes.getMode(languageId);
                if (doc && mode && mode.doResolve) {
                    return mode.doResolve(doc, item);
                }
            }
        }
        return item;
    }
    onHover({ textDocument, position }) {
        const doc = this.documentService.getDocument(textDocument.uri);
        const mode = this.languageModes.getModeAtPosition(doc, position);
        if (mode && mode.doHover) {
            return mode.doHover(doc, position);
        }
        return nullMode_1.NULL_HOVER;
    }
    onDocumentHighlight({ textDocument, position }) {
        const doc = this.documentService.getDocument(textDocument.uri);
        const mode = this.languageModes.getModeAtPosition(doc, position);
        if (mode && mode.findDocumentHighlight) {
            return mode.findDocumentHighlight(doc, position);
        }
        return [];
    }
    onDefinition({ textDocument, position }) {
        const doc = this.documentService.getDocument(textDocument.uri);
        const mode = this.languageModes.getModeAtPosition(doc, position);
        if (mode && mode.findDefinition) {
            return mode.findDefinition(doc, position);
        }
        return [];
    }
    onReferences({ textDocument, position }) {
        const doc = this.documentService.getDocument(textDocument.uri);
        const mode = this.languageModes.getModeAtPosition(doc, position);
        if (mode && mode.findReferences) {
            return mode.findReferences(doc, position);
        }
        return [];
    }
    onDocumentLinks({ textDocument }) {
        const doc = this.documentService.getDocument(textDocument.uri);
        const documentContext = {
            resolveReference: ref => {
                if (this.workspacePath && ref[0] === '/') {
                    return vscode_uri_1.URI.file(path.resolve(this.workspacePath, ref)).toString();
                }
                const fsPath = paths_1.getFileFsPath(doc.uri);
                return vscode_uri_1.URI.file(path.resolve(fsPath, '..', ref)).toString();
            }
        };
        const links = [];
        this.languageModes.getAllLanguageModeRangesInDocument(doc).forEach(m => {
            if (m.mode.findDocumentLinks) {
                pushAll(links, m.mode.findDocumentLinks(doc, documentContext));
            }
        });
        return links;
    }
    onDocumentSymbol({ textDocument }) {
        const doc = this.documentService.getDocument(textDocument.uri);
        const symbols = [];
        this.languageModes.getAllLanguageModeRangesInDocument(doc).forEach(m => {
            if (m.mode.findDocumentSymbols) {
                pushAll(symbols, m.mode.findDocumentSymbols(doc));
            }
        });
        return symbols;
    }
    onDocumentColors({ textDocument }) {
        const doc = this.documentService.getDocument(textDocument.uri);
        const colors = [];
        const distinctModes = new Set();
        this.languageModes.getAllLanguageModeRangesInDocument(doc).forEach(m => {
            distinctModes.add(m.mode);
        });
        for (const mode of distinctModes) {
            if (mode.findDocumentColors) {
                pushAll(colors, mode.findDocumentColors(doc));
            }
        }
        return colors;
    }
    onColorPresentations({ textDocument, color, range }) {
        const doc = this.documentService.getDocument(textDocument.uri);
        const mode = this.languageModes.getModeAtPosition(doc, range.start);
        if (mode && mode.getColorPresentations) {
            return mode.getColorPresentations(doc, color, range);
        }
        return [];
    }
    onSignatureHelp({ textDocument, position }) {
        const doc = this.documentService.getDocument(textDocument.uri);
        const mode = this.languageModes.getModeAtPosition(doc, position);
        if (mode && mode.doSignatureHelp) {
            return mode.doSignatureHelp(doc, position);
        }
        return nullMode_1.NULL_SIGNATURE;
    }
    onFoldingRanges({ textDocument }) {
        const doc = this.documentService.getDocument(textDocument.uri);
        const lmrs = this.languageModes.getAllLanguageModeRangesInDocument(doc);
        const result = [];
        lmrs.forEach(lmr => {
            if (lmr.mode.getFoldingRanges) {
                lmr.mode.getFoldingRanges(doc).forEach(r => result.push(r));
            }
            result.push({
                startLine: lmr.start.line,
                startCharacter: lmr.start.character,
                endLine: lmr.end.line,
                endCharacter: lmr.end.character
            });
        });
        return result;
    }
    onCodeAction({ textDocument, range, context }) {
        if (!this.config.vetur.languageFeatures.codeActions) {
            return [];
        }
        const doc = this.documentService.getDocument(textDocument.uri);
        const mode = this.languageModes.getModeAtPosition(doc, range.start);
        if (this.languageModes.getModeAtPosition(doc, range.end) !== mode) {
            return [];
        }
        if (mode && mode.getCodeActions) {
            return mode.getCodeActions(doc, range, /*formatParams*/ {}, context);
        }
        return [];
    }
    getRefactorEdits(refactorAction) {
        const uri = vscode_uri_1.URI.file(refactorAction.fileName).toString();
        const doc = this.documentService.getDocument(uri);
        const startPos = doc.positionAt(refactorAction.textRange.pos);
        const mode = this.languageModes.getModeAtPosition(doc, startPos);
        if (mode && mode.getRefactorEdits) {
            return mode.getRefactorEdits(doc, refactorAction);
        }
        return undefined;
    }
    triggerValidation(textDocument) {
        if (textDocument.uri.includes('node_modules')) {
            return;
        }
        this.cleanPendingValidation(textDocument);
        this.pendingValidationRequests[textDocument.uri] = setTimeout(() => {
            delete this.pendingValidationRequests[textDocument.uri];
            this.validateTextDocument(textDocument);
        }, this.validationDelayMs);
    }
    cleanPendingValidation(textDocument) {
        const request = this.pendingValidationRequests[textDocument.uri];
        if (request) {
            clearTimeout(request);
            delete this.pendingValidationRequests[textDocument.uri];
        }
    }
    validateTextDocument(textDocument) {
        const diagnostics = this.doValidate(textDocument);
        this.lspConnection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
    }
    doValidate(doc) {
        const diagnostics = [];
        if (doc.languageId === 'vue') {
            this.languageModes.getAllLanguageModeRangesInDocument(doc).forEach(lmr => {
                if (lmr.mode.doValidation) {
                    if (this.validation[lmr.mode.getId()]) {
                        pushAll(diagnostics, lmr.mode.doValidation(doc));
                    }
                    // Special case for template type checking
                    else if (lmr.mode.getId() === 'vue-html' && this.templateInterpolationValidation) {
                        pushAll(diagnostics, lmr.mode.doValidation(doc));
                    }
                }
            });
        }
        return diagnostics;
    }
    executeCommand(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (arg.command === javascript_1.APPLY_REFACTOR_COMMAND && arg.arguments) {
                const edit = this.getRefactorEdits(arg.arguments[0]);
                if (edit) {
                    this.lspConnection.sendRequest(vscode_languageserver_1.ApplyWorkspaceEditRequest.type, { edit });
                }
                return;
            }
            log_1.logger.logInfo(`Unknown command ${arg.command}.`);
        });
    }
    removeDocument(doc) {
        this.languageModes.onDocumentRemoved(doc);
    }
    dispose() {
        this.languageModes.dispose();
    }
    get capabilities() {
        return {
            textDocumentSync: vscode_languageserver_1.TextDocumentSyncKind.Full,
            completionProvider: { resolveProvider: true, triggerCharacters: ['.', ':', '<', '"', "'", '/', '@', '*', ' '] },
            signatureHelpProvider: { triggerCharacters: ['('] },
            documentFormattingProvider: false,
            hoverProvider: true,
            documentHighlightProvider: true,
            documentLinkProvider: {
                resolveProvider: false
            },
            documentSymbolProvider: true,
            definitionProvider: true,
            referencesProvider: true,
            codeActionProvider: true,
            colorProvider: true,
            executeCommandProvider: {
                commands: [javascript_1.APPLY_REFACTOR_COMMAND]
            },
            foldingRangeProvider: true
        };
    }
}
exports.VLS = VLS;
function pushAll(to, from) {
    if (from) {
        for (let i = 0; i < from.length; i++) {
            to.push(from[i]);
        }
    }
}
//# sourceMappingURL=vls.js.map