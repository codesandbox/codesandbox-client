import { graphql } from 'overmind-graphql';

import * as commentsMutations from './comments/mutations';
import * as commentsQueries from './comments/queries';

export default graphql({
  queries: {
    ...commentsQueries,
  },
  mutations: {
    ...commentsMutations,
  },
});
