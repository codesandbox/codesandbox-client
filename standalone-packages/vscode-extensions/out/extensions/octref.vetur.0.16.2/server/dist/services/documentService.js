"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
/**
 * Service responsible for managing documents being syned through LSP
 * Todo - Switch to incremental sync
 */
class DocumentService {
    constructor() {
        this.documents = new vscode_languageserver_1.TextDocuments();
    }
    listen(conn) {
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