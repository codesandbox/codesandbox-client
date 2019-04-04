"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const vscode_uri_1 = require("vscode-uri");
const languageModes_1 = require("../modes/languageModes");
const nullMode_1 = require("../modes/nullMode");
const documentService_1 = require("./documentService");
const vueInfoService_1 = require("./vueInfoService");
class VLS {
    constructor(workspacePath, lspConnection) {
        this.workspacePath = workspacePath;
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
        this.languageModes = languageModes_1.getLanguageModes(workspacePath);
        this.vueInfoService = new vueInfoService_1.VueInfoService(this.languageModes);
        this.languageModes.getAllModes().forEach(m => {
            if (m.configureService) {
                m.configureService(this.vueInfoService);
            }
        });
        this.documentService = new documentService_1.DocumentService();
        this.documentService.listen(lspConnection);
        this.setupConfigListeners();
        this.setupLanguageFeatures();
        this.setupFileChangeListeners();
        this.lspConnection.onShutdown(() => {
            this.dispose();
        });
    }
    setupConfigListeners() {
        this.lspConnection.onDidChangeConfiguration(({ settings }) => {
            this.configure(settings);
        });
        this.documentService.getAllDocuments().forEach(this.triggerValidation);
    }
    setupLanguageFeatures() {
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
        this.lspConnection.onDocumentColor(this.onDocumentColors.bind(this));
        this.lspConnection.onColorPresentation(this.onColorPresentations.bind(this));
    }
    setupFileChangeListeners() {
        this.documentService.onDidChangeContent((change) => {
            this.triggerValidation(change.document);
        });
        this.documentService.onDidClose(e => {
            this.removeDocument(e.document);
        });
        this.lspConnection.onDidChangeWatchedFiles(({ changes }) => {
            const jsMode = this.languageModes.getMode('javascript');
            changes.forEach(c => {
                if (c.type === vscode_languageserver_1.FileChangeType.Changed) {
                    const fsPath = vscode_uri_1.default.parse(c.uri).fsPath;
                    jsMode.onDocumentChanged(fsPath);
                }
            });
            this.documentService.getAllDocuments().forEach(d => {
                this.triggerValidation(d);
            });
        });
    }
    configure(config) {
        const veturValidationOptions = config.vetur.validation;
        this.validation['vue-html'] = veturValidationOptions.template;
        this.validation.css = veturValidationOptions.style;
        this.validation.postcss = veturValidationOptions.style;
        this.validation.scss = veturValidationOptions.style;
        this.validation.less = veturValidationOptions.style;
        this.validation.javascript = veturValidationOptions.script;
        this.languageModes.getAllModes().forEach(m => {
            if (m.configure) {
                m.configure(config);
            }
        });
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
        const fullDocRange = vscode_languageserver_types_1.Range.create(vscode_languageserver_types_1.Position.create(0, 0), doc.positionAt(doc.getText().length));
        const modeRanges = this.languageModes.getModesInRange(doc, fullDocRange);
        const allEdits = [];
        const errMessages = [];
        modeRanges.forEach(range => {
            if (range.mode && range.mode.format) {
                try {
                    const edits = range.mode.format(doc, range, options);
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
    onCompletion({ textDocument, position }) {
        const doc = this.documentService.getDocument(textDocument.uri);
        const mode = this.languageModes.getModeAtPosition(doc, position);
        if (mode && mode.doComplete) {
            return mode.doComplete(doc, position);
        }
        return nullMode_1.NULL_COMPLETION;
    }
    onCompletionResolve(item) {
        if (item.data) {
            const { uri, languageId } = item.data;
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
                    return vscode_uri_1.default.file(path.resolve(this.workspacePath, ref)).toString();
                }
                const docUri = vscode_uri_1.default.parse(doc.uri);
                return docUri
                    .with({
                    path: path.resolve(docUri.path, ref)
                })
                    .toString();
            }
        };
        const links = [];
        this.languageModes.getAllModesInDocument(doc).forEach(m => {
            if (m.findDocumentLinks) {
                pushAll(links, m.findDocumentLinks(doc, documentContext));
            }
        });
        return links;
    }
    onDocumentSymbol({ textDocument }) {
        const doc = this.documentService.getDocument(textDocument.uri);
        const symbols = [];
        this.languageModes.getAllModesInDocument(doc).forEach(m => {
            if (m.findDocumentSymbols) {
                pushAll(symbols, m.findDocumentSymbols(doc));
            }
        });
        return symbols;
    }
    onDocumentColors({ textDocument }) {
        const doc = this.documentService.getDocument(textDocument.uri);
        const colors = [];
        this.languageModes.getAllModesInDocument(doc).forEach(m => {
            if (m.findDocumentColors) {
                pushAll(colors, m.findDocumentColors(doc));
            }
        });
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
    /**
     * Validations
     */
    triggerValidation(textDocument) {
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
            this.languageModes.getAllModesInDocument(doc).forEach(mode => {
                if (mode.doValidation && this.validation[mode.getId()]) {
                    pushAll(diagnostics, mode.doValidation(doc));
                }
            });
        }
        return diagnostics;
    }
    removeDocument(doc) {
        this.languageModes.onDocumentRemoved(doc);
    }
    dispose() {
        this.languageModes.dispose();
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