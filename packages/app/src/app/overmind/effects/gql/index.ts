import { graphql } from 'overmind-graphql';

import * as collaboratorsMutations from './collaborators/mutations';
import * as collaboratorsQueries from './collaborators/queries';
import * as collaboratorsSubscriptions from './collaborators/subscriptions';
import * as commentsMutations from './comments/mutations';
import * as commentsQueries from './comments/queries';
import * as commentSubscriptions from './comments/subscriptions';
import * as dashboardSubscriptions from './dashboard/subscriptions';
import * as teamsQueries from './teams/queries';

import * as dashboardQueries from './dashboard/queries';
import * as dashboardMutations from './dashboard/mutations';

import * as sidebarQueries from './sidebar/queries';

import * as notificationsQueries from './notifications/queries';
import * as notificationsMutations from './notifications/mutations';

export default graphql({
  subscriptions: {
    ...collaboratorsSubscriptions,
    ...commentSubscriptions,
    ...dashboardSubscriptions,
  },
  queries: {
    ...collaboratorsQueries,
    ...commentsQueries,
    ...teamsQueries,
    ...dashboardQueries,
    ...sidebarQueries,
    ...notificationsQueries,
  },
  mutations: {
    ...collaboratorsMutations,
    ...commentsMutations,
    ...dashboardMutations,
    ...notificationsMutations,
  },
});
