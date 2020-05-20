import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { NotificationStatus } from '@codesandbox/notifications';
import introspectionQueryResultData from './introspection-result';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const httpLink = new BatchHttpLink({
  uri: '/api/graphql',
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
  link: errorHandler.concat(absintheAfterware.concat(httpLink)),
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
