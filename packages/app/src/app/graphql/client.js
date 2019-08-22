import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { setContext } from 'apollo-link-context';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { NotificationStatus } from '@codesandbox/notifications';
// import introspectionQueryResultData from './fragmentTypes.json';

// TODO: Remove this once we can use GraphQL Codegen with the API server
const introspectionQueryResultData = {
  __schema: {
    types: [
      {
        possibleTypes: null,
        name: 'Boolean',
        kind: 'SCALAR',
      },
      {
        possibleTypes: null,
        name: 'Collection',
        kind: 'OBJECT',
      },
      {
        possibleTypes: null,
        name: 'CurrentUser',
        kind: 'OBJECT',
      },
      {
        possibleTypes: null,
        name: 'Direction',
        kind: 'ENUM',
      },
      {
        possibleTypes: [
          {
            name: 'User',
          },
          {
            name: 'Team',
          },
        ],
        name: 'FollowEntity',
        kind: 'UNION',
      },
      {
        possibleTypes: null,
        name: 'Following',
        kind: 'OBJECT',
      },
      {
        possibleTypes: null,
        name: 'ID',
        kind: 'SCALAR',
      },
      {
        possibleTypes: null,
        name: 'Int',
        kind: 'SCALAR',
      },
      {
        possibleTypes: null,
        name: 'RootMutationType',
        kind: 'OBJECT',
      },
      {
        possibleTypes: null,
        name: 'Notification',
        kind: 'OBJECT',
      },
      {
        possibleTypes: null,
        name: 'OrderBy',
        kind: 'INPUT_OBJECT',
      },
      {
        possibleTypes: null,
        name: 'RootQueryType',
        kind: 'OBJECT',
      },
      {
        possibleTypes: null,
        name: 'Sandbox',
        kind: 'OBJECT',
      },
      {
        possibleTypes: null,
        name: 'Source',
        kind: 'OBJECT',
      },
      {
        possibleTypes: null,
        name: 'String',
        kind: 'SCALAR',
      },
      {
        possibleTypes: null,
        name: 'Team',
        kind: 'OBJECT',
      },
      {
        possibleTypes: null,
        name: 'Template',
        kind: 'OBJECT',
      },
      {
        possibleTypes: null,
        name: 'User',
        kind: 'OBJECT',
      },
      {
        possibleTypes: null,
        name: '__DirectiveLocation',
        kind: 'ENUM',
      },
      {
        possibleTypes: null,
        name: '__InputValue',
        kind: 'OBJECT',
      },
      {
        possibleTypes: null,
        name: '__Type',
        kind: 'OBJECT',
      },
      {
        possibleTypes: null,
        name: '__Directive',
        kind: 'OBJECT',
      },
      {
        possibleTypes: null,
        name: '__Field',
        kind: 'OBJECT',
      },
      {
        possibleTypes: null,
        name: '__Schema',
        kind: 'OBJECT',
      },
      {
        possibleTypes: null,
        name: '__EnumValue',
        kind: 'OBJECT',
      },
    ].filter(type => type.possibleTypes !== null),
  },
};

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const httpLink = new BatchHttpLink({
  uri: '/api/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('jwt');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${JSON.parse(token)}` : '',
    },
  };
});

const absintheAfterware = new ApolloLink((operation, forward) =>
  forward(operation).map(({ payload, ...result }) => ({
    ...result,
    errors: payload.errors,
    data: payload.data,
  }))
);

const errorHandler = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      notificationState.addNotification({
        message,
        status: NotificationStatus.ERROR,
      });
    });
  }

  if (networkError) {
    notificationState.addNotification({
      message: `Network Error: ${networkError}`,
      status: NotificationStatus.ERROR,
    });
  }
});

export const client = new ApolloClient({
  link: authLink.concat(
    errorHandler.concat(absintheAfterware.concat(httpLink))
  ),
  cache: new InMemoryCache({
    dataIdFromObject: o => o.id,
    fragmentMatcher,
    cacheRedirects: {
      Query: {
        collection: (_, args, { getCacheKey }) =>
          getCacheKey({ __typename: 'Collection', path: args.path }),
      },
    },
  }),
  queryDeduplication: true,
});
