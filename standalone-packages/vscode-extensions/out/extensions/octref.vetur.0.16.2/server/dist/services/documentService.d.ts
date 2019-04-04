import { IConnection } from 'vscode-languageserver';
/**
 * Service responsible for managing documents being syned through LSP
 * Todo - Switch to incremental sync
 */
export declare class DocumentService {
    private documents;
    constructor();
    listen(conn: IConnection): void;
    getDocument(uri: string): import("vscode-languageserver-types").TextDocument | undefined;
    getAllDocuments(): import("vscode-languageserver-types").TextDocument[];
    readonly onDidChangeContent: import("vscode-jsonrpc/lib/events").Event<import("vscode-languageserver-types").TextDocumentChangeEvent>;
    readonly onDidClose: import("vscode-jsonrpc/lib/events").Event<import("vscode-languageserver-types").TextDocumentChangeEvent>;
}
