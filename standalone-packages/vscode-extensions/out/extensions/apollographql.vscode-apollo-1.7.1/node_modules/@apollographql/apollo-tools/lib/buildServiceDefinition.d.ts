import { GraphQLSchema, DocumentNode, GraphQLError } from "graphql";
import { GraphQLResolverMap } from "./schema/resolverMap";
export interface GraphQLSchemaModule {
    typeDefs: DocumentNode;
    resolvers?: GraphQLResolverMap<any>;
}
interface GraphQLServiceDefinition {
    schema?: GraphQLSchema;
    errors?: GraphQLError[];
}
export declare function buildServiceDefinition(modules: GraphQLSchemaModule[]): GraphQLServiceDefinition;
export {};
//# sourceMappingURL=buildServiceDefinition.d.ts.map