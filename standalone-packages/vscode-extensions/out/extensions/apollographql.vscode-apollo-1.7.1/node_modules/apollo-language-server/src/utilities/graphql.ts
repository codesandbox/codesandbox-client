import {
  GraphQLSchema,
  GraphQLCompositeType,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLField,
  FieldNode,
  SchemaMetaFieldDef,
  TypeMetaFieldDef,
  TypeNameMetaFieldDef,
  ASTNode,
  Kind,
  NameNode,
  visit,
  DirectiveNode,
  OperationDefinitionNode,
  SelectionSetNode
} from "graphql";

export function isNode(maybeNode: any): maybeNode is ASTNode {
  return maybeNode && typeof maybeNode.kind === "string";
}

export type NamedNode = ASTNode & {
  name: NameNode;
};

export function isNamedNode(node: ASTNode): node is NamedNode {
  return "name" in node;
}

export function highlightNodeForNode(node: ASTNode): ASTNode {
  switch (node.kind) {
    case Kind.VARIABLE_DEFINITION:
      return node.variable;
    default:
      return isNamedNode(node) ? node.name : node;
  }
}

/**
 * Not exactly the same as the executor's definition of getFieldDef, in this
 * statically evaluated environment we do not always have an Object type,
 * and need to handle Interface and Union types.
 */
export function getFieldDef(
  schema: GraphQLSchema,
  parentType: GraphQLCompositeType,
  fieldAST: FieldNode
): GraphQLField<any, any> | undefined {
  const name = fieldAST.name.value;
  if (
    name === SchemaMetaFieldDef.name &&
    schema.getQueryType() === parentType
  ) {
    return SchemaMetaFieldDef;
  }
  if (name === TypeMetaFieldDef.name && schema.getQueryType() === parentType) {
    return TypeMetaFieldDef;
  }
  if (
    name === TypeNameMetaFieldDef.name &&
    (parentType instanceof GraphQLObjectType ||
      parentType instanceof GraphQLInterfaceType ||
      parentType instanceof GraphQLUnionType)
  ) {
    return TypeNameMetaFieldDef;
  }
  if (
    parentType instanceof GraphQLObjectType ||
    parentType instanceof GraphQLInterfaceType
  ) {
    return parentType.getFields()[name];
  }

  return undefined;
}

export function removeDirectives(ast: ASTNode, directiveNames: string[]) {
  if (!directiveNames.length) return ast;
  return visit(ast, {
    Directive(node: DirectiveNode): DirectiveNode | null {
      if (!!directiveNames.find(name => name === node.name.value)) return null;
      return node;
    }
  });
}

// remove fields where a given directive is found
export function removeDirectiveAnnotatedFields(
  ast: ASTNode,
  directiveNames: string[]
) {
  if (!directiveNames.length) return ast;
  return visit(ast, {
    Field(node: FieldNode): FieldNode | null {
      if (
        node.directives &&
        node.directives.find(
          directive =>
            !!directiveNames.find(name => name === directive.name.value)
        )
      )
        return null;
      return node;
    },
    OperationDefinition: {
      leave(node: OperationDefinitionNode): OperationDefinitionNode | null {
        if (!node.selectionSet.selections.length) return null;
        return node;
      }
    }
  });
}

const typenameField = {
  kind: Kind.FIELD,
  name: { kind: Kind.NAME, value: "__typename" }
};

export function withTypenameFieldAddedWhereNeeded(ast: ASTNode) {
  return visit(ast, {
    enter: {
      SelectionSet(node: SelectionSetNode) {
        return {
          ...node,
          selections: node.selections.filter(
            selection =>
              !(
                selection.kind === "Field" &&
                (selection as FieldNode).name.value === "__typename"
              )
          )
        };
      }
    },
    leave(node: ASTNode) {
      if (
        !(
          node.kind === Kind.FIELD ||
          node.kind === Kind.FRAGMENT_DEFINITION ||
          node.kind === Kind.INLINE_FRAGMENT
        )
      ) {
        return undefined;
      }
      if (!node.selectionSet) return undefined;

      if (true) {
        return {
          ...node,
          selectionSet: {
            ...node.selectionSet,
            selections: [typenameField, ...node.selectionSet.selections]
          }
        };
      } else {
        return undefined;
      }
    }
  });
}
