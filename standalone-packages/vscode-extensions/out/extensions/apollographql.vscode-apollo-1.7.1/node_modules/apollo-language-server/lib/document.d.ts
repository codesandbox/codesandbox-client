import { Source, DocumentNode } from "graphql";
import { TextDocument, Position, Diagnostic } from "vscode-languageserver";
export declare class GraphQLDocument {
    source: Source;
    ast?: DocumentNode;
    syntaxErrors: Diagnostic[];
    constructor(source: Source);
    containsPosition(position: Position): boolean;
}
export declare function extractGraphQLDocuments(document: TextDocument, tagName?: string): GraphQLDocument[] | null;
//# sourceMappingURL=document.d.ts.map