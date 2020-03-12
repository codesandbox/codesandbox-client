import { graphql } from 'overmind-graphql';

import * as collaboratorsMutations from './collaborators/mutations';
import * as collaboratorsQueries from './collaborators/queries';
import * as collaboratorsSubscriptions from './collaborators/subscriptions';
import * as commentsMutations from './comments/mutations';

export default graphql({
  subscriptions: {
    ...collaboratorsSubscriptions,
  },
  queries: {
    ...collaboratorsQueries,
  },
  mutations: {
    ...collaboratorsMutations,
    ...commentsMutations,
  },
});
