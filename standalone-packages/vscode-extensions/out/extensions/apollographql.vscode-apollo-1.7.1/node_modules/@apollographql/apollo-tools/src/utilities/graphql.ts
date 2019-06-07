import {
  ASTNode,
  TypeDefinitionNode,
  TypeExtensionNode,
  DocumentNode,
  Kind
} from "graphql";

// FIXME: We should add proper type guards for these predicate functions
// to `@types/graphql`.
declare module "graphql/language/predicates" {
  function isTypeDefinitionNode(node: ASTNode): node is TypeDefinitionNode;
  function isTypeExtensionNode(node: ASTNode): node is TypeExtensionNode;
}

export function isNode(maybeNode: any): maybeNode is ASTNode {
  return maybeNode && typeof maybeNode.kind === "string";
}

export function isDocumentNode(node: ASTNode): node is DocumentNode {
  return isNode(node) && node.kind === Kind.DOCUMENT;
}
