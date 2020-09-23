import { Connection } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
/**
 * Service responsible for managing documents being syned through LSP
 * Todo - Switch to incremental sync
 */
export declare class DocumentService {
    private documents;
    constructor(conn: Connection);
    getDocument(uri: string): TextDocument | undefined;
    getAllDocuments(): TextDocument[];
    get onDidChangeContent(): import("vscode-languageserver").Event<import("vscode-languageserver").TextDocumentChangeEvent<TextDocument>>;
    get onDidClose(): import("vscode-languageserver").Event<import("vscode-languageserver").TextDocumentChangeEvent<TextDocument>>;
}
