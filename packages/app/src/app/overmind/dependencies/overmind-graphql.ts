import * as withAbsintheSocket from '@absinthe/socket';
import { GraphQLClient } from 'graphql-request';
import {
  Headers as HttpHeaders,
  Options,
} from 'graphql-request/dist/src/types';
import { print } from 'graphql/language/printer';
import { Socket as PhoenixSocket } from 'phoenix';

export { default as gql } from 'graphql-tag';

export interface Query<Result extends any, Payload extends any = void> {
  (payload: Payload): Result;
}

type Variable = string | number | boolean | null;

interface NoPayloadSubscription<R> {
  (action: (result: R) => void): void;
  dispose(): void;
  disposeWhere(cb: (variables: { [variables: string]: Variable }) => boolean);
}

interface PayloadSubscription<P, R> {
  (payload: P, action: (result: R) => void): void;
  dispose(): void;
  disposeWhere(cb: (variables: { [variables: string]: Variable }) => boolean);
}

interface Subscription {
  variables: { [key: string]: Variable };
  dispose: () => void;
}

type Http = {
  endpoint: string;
  headers?: () => HttpHeaders;
  options?: Options;
};

type Ws =
  | {
      endpoint: string;
      params?: () => { [key: string]: string | number | boolean };
    }
  | PhoenixSocket;

type Queries = {
  queries?: {
    [key: string]: (payload: any) => any;
  };
  mutations?: {
    [key: string]: (payload: any) => any;
  };
  subscriptions?: {
    [key: string]: (payload: any) => any;
  };
};

export type Graphql<T extends Queries> = {
  initialize(http: Http, ws?: Ws): void;
} & {
  queries: {
    [N in keyof T['queries']]: T['queries'][N] extends (
      payload: infer P
    ) => infer R
      ? P extends void
        ? () => Promise<R>
        : (payload: P) => Promise<R>
      : never;
  };
  mutations: {
    [N in keyof T['mutations']]: T['mutations'][N] extends (
      payload: infer P
    ) => infer R
      ? P extends void
        ? () => Promise<R>
        : (payload: P) => Promise<R>
      : never;
  };
  subscriptions: {
    [N in keyof T['subscriptions']]: T['subscriptions'][N] extends (
      payload: infer P
    ) => infer R
      ? P extends void
        ? NoPayloadSubscription<R>
        : PayloadSubscription<P, R>
      : never;
  };
};

function createError(message: string) {
  throw new Error(`OVERMIND-GRAPHQL: ${message}`);
}

const _clients: { [url: string]: GraphQLClient } = {};
const _subscriptions: {
  [query: string]: Subscription[];
} = {};

export const graphql: <T extends Queries>(
  queries: T
) => Graphql<T> = queries => {
  let _http: Http;
  let _ws: Ws;

  function getClient(): GraphQLClient | null {
    if (_http) {
      const headers = // eslint-disable-next-line
        typeof _http.headers === 'function'
          ? _http.headers()
          : _http.options && _http.options.headers
          ? _http.options.headers
          : {};

      if (_clients[_http.endpoint]) {
        _clients[_http.endpoint].setHeaders(headers);
      } else {
        _clients[_http.endpoint] = new GraphQLClient(_http.endpoint, {
          ..._http.options,
          headers,
        });
      }

      return _clients[_http.endpoint];
    }

    return null;
  }

  function getWsClient(): PhoenixSocket | null {
    if (_ws) {
      return withAbsintheSocket.create(_ws);
    }

    return null;
  }

  const evaluatedQueries = {
    queries: Object.keys(queries.queries || {}).reduce((aggr, key) => {
      aggr[key] = variables => {
        const query = queries.queries![key] as any;
        const client = getClient();

        if (client) {
          return client.request(print(query), variables);
        }

        throw createError(
          'You are running a query, though there is no HTTP endpoint configured'
        );
      };
      return aggr;
    }, {}),
    mutations: Object.keys(queries.mutations || {}).reduce((aggr, key) => {
      aggr[key] = variables => {
        const query = queries.mutations![key] as any;
        const client = getClient();

        if (client) {
          return client.request(print(query), variables);
        }

        throw createError(
          'You are running a query, though there is no HTTP endpoint configured'
        );
      };
      return aggr;
    }, {}),
    subscriptions: Object.keys(queries.subscriptions || {}).reduce(
      (aggr, key) => {
        const query = queries.subscriptions![key] as any;
        const queryString = print(query);

        if (!_subscriptions[queryString]) {
          _subscriptions[queryString] = [];
        }

        function subscription(arg1, arg2) {
          const client = getWsClient();

          if (client) {
            const variables = arg2 ? arg1 : {};
            const action = arg2 || arg1;
            const notifier = withAbsintheSocket.send(client, {
              operation: queryString,
              variables,
            });

            const observer = withAbsintheSocket.observe(client, notifier, {
              onResult: ({ data }) => {
                action(data);
              },
            });

            _subscriptions[queryString].push({
              variables,
              dispose: () =>
                withAbsintheSocket.unobserve(client, notifier, observer),
            });
          } else {
            throw createError('There is no ws client available for this query');
          }
        }

        subscription.dispose = () => {
          _subscriptions[queryString].forEach(sub => {
            sub.dispose();
          });
          _subscriptions[queryString].length = 0;
        };

        subscription.disposeWhere = cb => {
          _subscriptions[queryString] = _subscriptions[queryString].reduce<
            Subscription[]
          >((subAggr, sub) => {
            if (cb(sub.variables)) {
              return subAggr;
            }
            return subAggr.concat(sub);
          }, []);
        };

        aggr[key] = subscription;

        return aggr;
      },
      {}
    ),
  };

  return {
    initialize(http: Http, ws?: Ws) {
      _http = http;
      if (ws) {
        _ws = ws;
      }
    },
    ...evaluatedQueries,
  } as any;
};
