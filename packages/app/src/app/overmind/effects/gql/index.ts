import { graphql } from 'overmind-graphql';

import * as collaboratorsMutations from './collaborators/mutations';
import * as collaboratorsQueries from './collaborators/queries';
import * as collaboratorsSubscriptions from './collaborators/subscriptions';
import * as commentsMutations from './comments/mutations';
import * as commentsQueries from './comments/queries';
import * as commentSubscriptions from './comments/subscriptions';

export default graphql({
  subscriptions: {
    ...collaboratorsSubscriptions,
    ...commentSubscriptions,
  },
  queries: {
    ...collaboratorsQueries,
    ...commentsQueries,
  },
  mutations: {
    ...collaboratorsMutations,
    ...commentsMutations,
  },
});
