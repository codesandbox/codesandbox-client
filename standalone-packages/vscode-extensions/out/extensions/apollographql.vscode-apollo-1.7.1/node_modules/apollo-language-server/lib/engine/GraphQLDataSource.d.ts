import { DataSourceConfig } from "apollo-datasource";
import { GraphQLRequest } from "apollo-link";
import { GraphQLError } from "graphql";
export interface GraphQLResponse<T> {
    data?: T;
    errors?: GraphQLError[];
}
export declare class GraphQLDataSource<TContext = any> {
    baseURL: string;
    context: TContext;
    initialize(config: DataSourceConfig<TContext>): void;
    execute<T>(operation: GraphQLRequest): Promise<GraphQLResponse<T>>;
    protected willSendRequest?(request: any): any;
    private composeLinks;
    private didEncounterError;
    private executeSingleOperation;
    private resolveUri;
    private onRequestLink;
    private onErrorLink;
}
//# sourceMappingURL=GraphQLDataSource.d.ts.map