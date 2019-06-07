import { ASTNode, TypeDefinitionNode, TypeExtensionNode, DocumentNode } from "graphql";
declare module "graphql/language/predicates" {
    function isTypeDefinitionNode(node: ASTNode): node is TypeDefinitionNode;
    function isTypeExtensionNode(node: ASTNode): node is TypeExtensionNode;
}
export declare function isNode(maybeNode: any): maybeNode is ASTNode;
export declare function isDocumentNode(node: ASTNode): node is DocumentNode;
//# sourceMappingURL=graphql.d.ts.map