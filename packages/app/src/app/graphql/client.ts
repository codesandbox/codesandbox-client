import { ApolloClient, ApolloLink } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { setContext } from '@apollo/client/link/context';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'; // TODO: This package isn't installed?
import { onError } from 'apollo-link-error'; // TODO: This package isn't installed?
import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { NotificationStatus } from '@codesandbox/notifications';
import introspectionQueryResultData from './introspection-result';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const httpLink = new BatchHttpLink({
  uri: '/api/graphql',
});

const authLink = setContext((_, { headers }) => {
  const hasDevAuth = process.env.LOCAL_SERVER || process.env.STAGING;
  if (!hasDevAuth) {
    return {};
  }

  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('devJwt');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const absintheAfterware = new ApolloLink((operation, forward) =>
  // @ts-ignore
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
