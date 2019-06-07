import { ApolloLink, GraphQLRequest } from 'apollo-link';
export declare type ContextSetter = (operation: GraphQLRequest, prevContext: any) => Promise<any> | any;
export declare function setContext(setter: ContextSetter): ApolloLink;
//# sourceMappingURL=index.d.ts.map