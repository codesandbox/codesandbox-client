import { Source, ASTNode, TypeInfo, GraphQLSchema, Visitor, ASTKindToNode } from "graphql";
import { SourceLocation } from "graphql/language/location";
import { Position, Range } from "vscode-languageserver";
export declare function visitWithTypeInfo(typeInfo: TypeInfo, visitor: Visitor<ASTKindToNode>): Visitor<ASTKindToNode>;
export declare function positionFromPositionInContainingDocument(source: Source, position: Position): Position;
export declare function positionInContainingDocument(source: Source, position: Position): Position;
export declare function rangeInContainingDocument(source: Source, range: Range): Range;
export declare function rangeForASTNode(node: ASTNode): Range;
export declare function positionFromSourceLocation(source: Source, location: SourceLocation): Position;
export declare function positionToOffset(source: Source, position: Position): number;
export declare function getASTNodeAndTypeInfoAtPosition(source: Source, position: Position, root: ASTNode, schema: GraphQLSchema): [ASTNode, TypeInfo] | null;
//# sourceMappingURL=source.d.ts.map