import { graphql } from 'overmind-graphql';

import * as collaboratorsMutations from './collaborators/mutations';
import * as collaboratorsQueries from './collaborators/queries';
import * as collaboratorsSubscriptions from './collaborators/subscriptions';
import * as commentsMutations from './comments/mutations';
import * as commentsQueries from './comments/queries';
import * as commentSubscriptions from './comments/subscriptions';
import * as teamsQueries from './teams/queries';

import * as dashboardQueries from './dashboard/queries';

export default graphql({
  subscriptions: {
    ...collaboratorsSubscriptions,
    ...commentSubscriptions,
  },
  queries: {
    ...collaboratorsQueries,
    ...commentsQueries,
    ...teamsQueries,
    ...dashboardQueries,
  },
  mutations: {
    ...collaboratorsMutations,
    ...commentsMutations,
  },
});
