"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentService = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
/**
 * Service responsible for managing documents being syned through LSP
 * Todo - Switch to incremental sync
 */
class DocumentService {
    constructor(conn) {
        this.documents = new vscode_languageserver_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
        this.documents.listen(conn);
    }
    getDocument(uri) {
        return this.documents.get(uri);
    }
    getAllDocuments() {
        return this.documents.all();
    }
    get onDidChangeContent() {
        return this.documents.onDidChangeContent;
    }
    get onDidClose() {
        return this.documents.onDidClose;
    }
}
exports.DocumentService = DocumentService;
//# sourceMappingURL=documentService.js.map