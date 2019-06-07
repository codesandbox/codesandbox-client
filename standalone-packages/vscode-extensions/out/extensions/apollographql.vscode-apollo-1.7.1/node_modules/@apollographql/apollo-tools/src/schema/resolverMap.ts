import { GraphQLFieldResolver } from "graphql";

export interface GraphQLResolverMap<TContext> {
  [typeName: string]: {
    [fieldName: string]:
      | GraphQLFieldResolver<any, TContext>
      | {
          requires?: string;
          resolve: GraphQLFieldResolver<any, TContext>;
        };
  };
}
