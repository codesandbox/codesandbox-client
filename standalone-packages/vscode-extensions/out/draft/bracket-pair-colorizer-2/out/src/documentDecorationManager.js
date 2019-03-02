"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const documentDecoration_1 = require("./documentDecoration");
const settings_1 = require("./settings");
class DocumentDecorationManager {
    constructor() {
        this.documents = new Map();
        this.settings = new settings_1.default();
    }
    Dispose() {
        this.documents.forEach((document, key) => {
            document.dispose();
        });
        this.settings.dispose();
    }
    expandBracketSelection(editor) {
        const documentDecoration = this.getDocumentDecorations(editor.document);
        if (documentDecoration) {
            documentDecoration.expandBracketSelection(editor);
        }
    }
    undoBracketSelection(editor) {
        const documentDecoration = this.getDocumentDecorations(editor.document);
        if (documentDecoration) {
            documentDecoration.undoBracketSelection(editor);
        }
    }
    updateDocument(document) {
        // console.log("updateDocument");
        const documentDecoration = this.getDocumentDecorations(document);
        if (documentDecoration) {
            documentDecoration.tokenizeDocument();
        }
    }
    onDidOpenTextDocument(document) {
        // console.log("onDidOpenTextDocument");
        const documentDecoration = this.getDocumentDecorations(document);
        if (documentDecoration) {
            documentDecoration.tokenizeDocument();
        }
    }
    onDidChangeTextDocument(event) {
        // console.log("onDidChangeTextDocument");
        const documentDecoration = this.getDocumentDecorations(event.document);
        if (documentDecoration) {
            documentDecoration.onDidChangeTextDocument(event.contentChanges);
        }
    }
    onDidCloseTextDocument(closedDocument) {
        // console.log("onDidCloseTextDocument");
        const uri = closedDocument.uri.toString();
        const document = this.documents.get(uri);
        if (document !== undefined) {
            // console.log("Disposing " + uri);
            document.dispose();
            this.documents.delete(uri);
        }
    }
    onDidChangeSelection(event) {
        // console.log("onDidChangeSelection");
        const documentDecoration = this.getDocumentDecorations(event.textEditor.document);
        if (documentDecoration &&
            (documentDecoration.settings.highlightActiveScope ||
                documentDecoration.settings.showBracketsInGutter ||
                documentDecoration.settings.showVerticalScopeLine ||
                documentDecoration.settings.showHorizontalScopeLine)) {
            documentDecoration.updateScopeDecorations(event);
        }
    }
    updateAllDocuments() {
        // console.log("updateAllDocuments");
        for (const editor of vscode_1.window.visibleTextEditors) {
            this.updateDocument(editor.document);
        }
    }
    getDocumentDecorations(document) {
        if (!this.isValidDocument(document)) {
            return;
        }
        const uri = document.uri.toString();
        // console.log("Looking for " + uri + " from cache");
        let documentDecorations = this.documents.get(uri);
        if (documentDecorations === undefined) {
            const languageConfig = this.tryGetLanguageConfig(document.languageId);
            if (!languageConfig) {
                // console.log("Could not find tokenizer for " + document.languageId);
                return;
            }
            if (languageConfig instanceof Promise) {
                // console.log("Found Tokenizer promise for " + document.languageId);
                languageConfig.then(() => {
                    this.updateDocument(document);
                }).catch((e) => console.error(e));
                return;
            }
            // console.log("Found Tokenizer for " + document.languageId);
            documentDecorations = new documentDecoration_1.default(document, languageConfig, this.settings);
            // console.log("Adding " + uri + " to cache");
            this.documents.set(uri, documentDecorations);
        }
        // console.log("Retrieved " + uri + " from cache");
        return documentDecorations;
    }
    tryGetLanguageConfig(languageID) {
        return this.settings.TextMateLoader.tryGetLanguageConfig(languageID);
    }
    isValidDocument(document) {
        if (document === undefined) {
            console.warn("Ignoring undefined document");
            return false;
        }
        if (document.lineCount === 0) {
            console.warn("Ignoring document with 0 line counter");
            return false;
        }
        if (document.uri.scheme === "vscode") {
            // console.log("Ignoring document with 'vscode' uri");
            return false;
        }
        if (document.uri.scheme === "output") {
            // console.log("Ignoring document with 'output' uri");
            return false;
        }
        if (this.settings.excludedLanguages.has(document.languageId)) {
            // console.log("Ignoring document because language id was ignored in settings");
            return false;
        }
        return true;
    }
}
exports.default = DocumentDecorationManager;
//# sourceMappingURL=documentDecorationManager.js.map