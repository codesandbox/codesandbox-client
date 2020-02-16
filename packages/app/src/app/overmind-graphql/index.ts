import { GraphQLClient } from 'graphql-request';
import {
  Headers as HttpHeaders,
  Options,
} from 'graphql-request/dist/src/types';
import * as withAbsintheSocket from '@absinthe/socket';
import { Socket as PhoenixSocket } from 'phoenix';
import { print } from 'graphql/language/printer';
import { IConfiguration } from 'overmind';
import { ResolveState } from 'overmind/lib/internalTypes';

export { default as gql } from 'graphql-tag';

export interface Query<Result extends any, Payload extends any = void> {
  (payload: Payload): Result;
}

interface NoPayloadSubscription<R> {
  (action: (result: R) => void): void;
  dispose(variables?: { [variables: string]: string | number | boolean }): void;
}

interface PayloadSubscription<P, R> {
  (payload: P, action: (result: R) => void): void;
  dispose(variables?: { [variables: string]: string | number | boolean }): void;
}

export function graphql<
  C extends IConfiguration,
  G extends {
    endpoint: string;
    headers?: (state: ResolveState<C['state']>) => HttpHeaders;
    params?: (
      state: ResolveState<C['state']>
    ) => { [key: string]: string | number | boolean };
    options?: Options;
    queries?: {
      [key: string]: (payload: any) => any;
    };
    mutations?: {
      [key: string]: (payload: any) => any;
    };
    subscriptions?: {
      [key: string]: (payload: any) => any;
    };
  }
>(
  initialConfig: C,
  options: G
): {
  state: C['state'];
  effects: C['effects'] & {
    queries: {
      [N in keyof G['queries']]: G['queries'][N] extends (
        payload: infer P
      ) => infer R
        ? P extends void
          ? () => Promise<R>
          : (payload: P) => Promise<R>
        : never;
    };
    mutations: {
      [N in keyof G['mutations']]: G['mutations'][N] extends (
        payload: infer P
      ) => infer R
        ? P extends void
          ? () => R
          : (payload: P) => R
        : never;
    };
    subscriptions: {
      [N in keyof G['subscriptions']]: G['subscriptions'][N] extends (
        payload: infer P
      ) => infer R
        ? P extends void
          ? NoPayloadSubscription<R>
          : PayloadSubscription<P, R>
        : never;
    };
  };
  actions: C['actions'];
} {
  const config: any = {};
  let _client: GraphQLClient;
  let _subscriptionClient: any;
  let _state;
  const _subscriptions: {
    [query: string]: { [variables: string]: () => void };
  } = {};

  if (config.effects && config.effects.queries) {
    throw new Error(
      `Overmind Graphql - There is already a "queries" effect on this configuration, please rename that to something else`
    );
  }

  if (config.effects && config.effects.mutations) {
    throw new Error(
      `Overmind Graphql - There is already a "mutations" effect on this configuration, please rename that to something else`
    );
  }

  if (config.effects && config.effects.subscriptions) {
    throw new Error(
      `Overmind Graphql - There is already a "subscriptions" effect on this configuration, please rename that to something else`
    );
  }

  config.onInitialize = (context, payload) => {
    _state = context.state;
    _client = new GraphQLClient(options.endpoint, {
      ...options.options,
      headers:
        typeof options.headers === 'function'
          ? options.headers(context.state)
          : options.options
          ? options.options.headers
          : {},
    });
    return (
      initialConfig.onInitialize && initialConfig.onInitialize(context, payload)
    );
  };
  config.state = initialConfig.state;
  config.effects = Object.assign(initialConfig.effects || {}, {
    queries: Object.keys(options.queries || {}).reduce((aggr, key) => {
      aggr[key] = variables => {
        const query = options.queries[key] as any;

        if (typeof options.headers === 'function') {
          _client.setHeaders(options.headers(_state));
        }

        return _client.request(print(query), variables);
      };
      return aggr;
    }, {}),
    mutations: Object.keys(options.mutations || {}).reduce((aggr, key) => {
      aggr[key] = variables => {
        const query = options.mutations[key] as any;

        if (typeof options.headers === 'function') {
          _client.setHeaders(options.headers(_state));
        }

        return _client.request(print(query), variables);
      };
      return aggr;
    }, {}),
    subscriptions: Object.keys(options.subscriptions || {}).reduce(
      (aggr, key) => {
        const query = options.subscriptions[key] as any;
        const queryString = print(query);

        if (!_subscriptions[queryString]) {
          _subscriptions[queryString] = {};
        }

        function subscription(variables, action) {
          if (!_subscriptionClient) {
            _subscriptionClient = withAbsintheSocket.create(
              new PhoenixSocket('wss://codesandbox.test/graphql-socket', {
                params: options.params ? options.params(_state) : null,
              })
            );
          }
          const notifier = withAbsintheSocket.send(_subscriptionClient, {
            operation: queryString,
            variables,
          });

          const observer = withAbsintheSocket.observe(
            _subscriptionClient,
            notifier,
            {
              onResult: ({ data }) => {
                action(data);
              },
            }
          );

          _subscriptions[queryString][JSON.stringify(variables)] = () =>
            withAbsintheSocket.unobserve(
              _subscriptionClient,
              notifier,
              observer
            );
        }

        subscription.dispose = variables => {
          if (variables && _subscriptions[queryString]) {
            const subscriptionKey = JSON.stringify(variables);
            _subscriptions[queryString][subscriptionKey]();
            delete _subscriptions[queryString][subscriptionKey];
          } else if (_subscriptions[queryString]) {
            Object.keys(_subscriptions[queryString]).forEach(
              subscriptionKey => {
                _subscriptions[queryString][subscriptionKey]();
                delete _subscriptions[queryString][subscriptionKey];
              }
            );
          }
        };

        aggr[key] = subscription;

        return aggr;
      },
      {}
    ),
  });
  config.actions = initialConfig.actions;

  return config as any;
}
