import { DataSourceConfig } from "apollo-datasource";
import { ApolloLink, execute, GraphQLRequest, makePromise } from "apollo-link";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { createHttpLink } from "apollo-link-http";
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError
} from "apollo-server-errors";
import to from "await-to-js";
import { GraphQLError } from "graphql";
import { fetch } from "apollo-env";

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}
export class GraphQLDataSource<TContext = any> {
  public baseURL!: string;
  public context!: TContext;

  public initialize(config: DataSourceConfig<TContext>): void {
    this.context = config.context;
  }

  // XXX can we kill the casting here?
  public async execute<T>(
    operation: GraphQLRequest
  ): Promise<GraphQLResponse<T>> {
    return this.executeSingleOperation(operation) as Promise<
      GraphQLResponse<T>
    >;
  }

  protected willSendRequest?(request: any): any;

  private composeLinks(): ApolloLink {
    const uri = this.resolveUri();

    return ApolloLink.from([
      this.onErrorLink(),
      this.onRequestLink(),
      createHttpLink({ fetch, uri })
    ]);
  }

  private didEncounterError(error: any) {
    const status = error.statusCode ? error.statusCode : null;
    const message = error.bodyText
      ? error.bodyText
      : error.message
      ? error.message
      : null;

    let apolloError: ApolloError;

    switch (status) {
      case 401:
        apolloError = new AuthenticationError(message);
        break;
      case 403:
        apolloError = new ForbiddenError(message);
        break;
      default:
        apolloError = new ApolloError(message);
    }

    throw apolloError;
  }

  private async executeSingleOperation(operation: GraphQLRequest) {
    const link = this.composeLinks();

    const [error, response] = await to(makePromise(execute(link, operation)));

    if (error) {
      this.didEncounterError(error);
    }

    return response;
  }

  private resolveUri(): string {
    const baseURL = this.baseURL;

    if (!baseURL) {
      throw new ApolloError(
        "Cannot make request to GraphQL API, missing baseURL"
      );
    }

    return baseURL;
  }

  private onRequestLink() {
    return setContext((_, request) => {
      if (this.willSendRequest) {
        this.willSendRequest(request);
      }

      return request;
    });
  }

  private onErrorLink() {
    return onError(({ graphQLErrors, networkError, operation }) => {
      const { result, response } = operation.getContext();
      if (graphQLErrors) {
        graphQLErrors.map(graphqlError =>
          console.error(`[GraphQL error]: ${graphqlError.message}`)
        );
      }

      if (networkError) {
        console.log(`[Network Error]: ${networkError}`);
      }

      if (response && response.status >= 400) {
        console.log(`[Network Error] ${response.bodyText}`);
      }
    });
  }
}
