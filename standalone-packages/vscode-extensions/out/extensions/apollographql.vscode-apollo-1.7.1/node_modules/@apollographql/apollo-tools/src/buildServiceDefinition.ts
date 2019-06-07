import {
  GraphQLSchema,
  DocumentNode,
  TypeDefinitionNode,
  DirectiveDefinitionNode,
  isTypeDefinitionNode,
  TypeExtensionNode,
  isTypeExtensionNode,
  GraphQLError,
  buildASTSchema,
  Kind,
  extendSchema,
  isObjectType,
  SchemaDefinitionNode,
  OperationTypeNode,
  SchemaExtensionNode
} from "graphql";
import { isNode, isDocumentNode } from "./utilities/graphql";
import { GraphQLResolverMap } from "./schema/resolverMap";
import { isNotNullOrUndefined } from "./utilities/predicates";

export interface GraphQLSchemaModule {
  typeDefs: DocumentNode;
  resolvers?: GraphQLResolverMap<any>;
}

interface GraphQLServiceDefinition {
  schema?: GraphQLSchema;
  errors?: GraphQLError[];
}

export function buildServiceDefinition(
  modules: GraphQLSchemaModule[]
): GraphQLServiceDefinition {
  const errors: GraphQLError[] = [];

  const typeDefinitionsMap: {
    [name: string]: TypeDefinitionNode[];
  } = Object.create(null);

  const typeExtensionsMap: {
    [name: string]: TypeExtensionNode[];
  } = Object.create(null);

  const directivesMap: {
    [name: string]: DirectiveDefinitionNode[];
  } = Object.create(null);

  const schemaDefinitions: SchemaDefinitionNode[] = [];
  const schemaExtensions: SchemaExtensionNode[] = [];

  for (let module of modules) {
    if (isNode(module) && isDocumentNode(module)) {
      module = { typeDefs: module };
    }
    for (const definition of module.typeDefs.definitions) {
      if (isTypeDefinitionNode(definition)) {
        const typeName = definition.name.value;

        if (typeDefinitionsMap[typeName]) {
          typeDefinitionsMap[typeName].push(definition);
        } else {
          typeDefinitionsMap[typeName] = [definition];
        }
      } else if (isTypeExtensionNode(definition)) {
        const typeName = definition.name.value;

        if (typeExtensionsMap[typeName]) {
          typeExtensionsMap[typeName].push(definition);
        } else {
          typeExtensionsMap[typeName] = [definition];
        }
      } else if (definition.kind === Kind.DIRECTIVE_DEFINITION) {
        const directiveName = definition.name.value;

        if (directivesMap[directiveName]) {
          directivesMap[directiveName].push(definition);
        } else {
          directivesMap[directiveName] = [definition];
        }
      } else if (definition.kind === Kind.SCHEMA_DEFINITION) {
        schemaDefinitions.push(definition);
      } else if (definition.kind === Kind.SCHEMA_EXTENSION) {
        schemaExtensions.push(definition);
      }
    }
  }

  for (const [typeName, typeDefinitions] of Object.entries(
    typeDefinitionsMap
  )) {
    if (typeDefinitions.length > 1) {
      errors.push(
        new GraphQLError(
          `Type "${typeName}" was defined more than once.`,
          typeDefinitions
        )
      );
    }
  }

  for (const [directiveName, directives] of Object.entries(directivesMap)) {
    if (directives.length > 1) {
      errors.push(
        new GraphQLError(
          `Directive "${directiveName}" was defined more than once.`,
          directives
        )
      );
    }
  }

  let operationTypeMap: { [operation in OperationTypeNode]?: string };

  if (schemaDefinitions.length > 0 || schemaExtensions.length > 0) {
    operationTypeMap = {};

    // We should report an error if more than one schema definition is included,
    // but this matches the current 'last definition wins' behavior of `buildASTSchema`.
    const schemaDefinition = schemaDefinitions[schemaDefinitions.length - 1];

    const operationTypes = [schemaDefinition, ...schemaExtensions]
      .map(node => node.operationTypes)
      .filter(isNotNullOrUndefined)
      .flat();

    for (const operationType of operationTypes) {
      const typeName = operationType.type.name.value;
      const operation = operationType.operation;

      if (operationTypeMap[operation]) {
        throw new GraphQLError(
          `Must provide only one ${operation} type in schema.`,
          [schemaDefinition]
        );
      }
      if (!(typeDefinitionsMap[typeName] || typeExtensionsMap[typeName])) {
        throw new GraphQLError(
          `Specified ${operation} type "${typeName}" not found in document.`,
          [schemaDefinition]
        );
      }
      operationTypeMap[operation] = typeName;
    }
  } else {
    operationTypeMap = {
      query: "Query",
      mutation: "Mutation",
      subscription: "Subscription"
    };
  }

  for (const [typeName, typeExtensions] of Object.entries(typeExtensionsMap)) {
    if (!typeDefinitionsMap[typeName]) {
      if (Object.values(operationTypeMap).includes(typeName)) {
        typeDefinitionsMap[typeName] = [
          {
            kind: Kind.OBJECT_TYPE_DEFINITION,
            name: {
              kind: Kind.NAME,
              value: typeName
            }
          }
        ];
      } else {
        errors.push(
          new GraphQLError(
            `Cannot extend type "${typeName}" because it does not exist in the existing schema.`,
            typeExtensions
          )
        );
      }
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  try {
    const typeDefinitions = Object.values(typeDefinitionsMap).flat();
    const directives = Object.values(directivesMap).flat();

    let schema = buildASTSchema({
      kind: Kind.DOCUMENT,
      definitions: [...typeDefinitions, ...directives]
    });

    const typeExtensions = Object.values(typeExtensionsMap).flat();

    if (typeExtensions.length > 0) {
      schema = extendSchema(schema, {
        kind: Kind.DOCUMENT,
        definitions: typeExtensions
      });
    }

    for (const module of modules) {
      if (!module.resolvers) continue;

      addResolversToSchema(schema, module.resolvers);
    }

    return { schema };
  } catch (error) {
    return { errors: [error] };
  }
}

function addResolversToSchema(
  schema: GraphQLSchema,
  resolvers: GraphQLResolverMap<any>
) {
  for (const [typeName, fieldConfigs] of Object.entries(resolvers)) {
    const type = schema.getType(typeName);
    if (!isObjectType(type)) continue;

    const fieldMap = type.getFields();

    for (const [fieldName, fieldConfig] of Object.entries(fieldConfigs)) {
      if (fieldName.startsWith("__")) {
        (type as any)[fieldName.substring(2)] = fieldConfig;
        continue;
      }

      const field = fieldMap[fieldName];
      if (!field) continue;

      if (typeof fieldConfig === "function") {
        field.resolve = fieldConfig;
      } else {
        field.resolve = fieldConfig.resolve;
      }
    }
  }
}
