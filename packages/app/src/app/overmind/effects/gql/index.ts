import { graphql } from 'overmind-graphql';

import * as teamsQueries from './teams/queries';

import * as dashboardQueries from './dashboard/queries';
import * as dashboardMutations from './dashboard/mutations';

import * as sidebarQueries from './sidebar/queries';

import * as notificationsQueries from './notifications/queries';
import * as notificationsMutations from './notifications/mutations';

export default graphql({
  queries: {
    ...teamsQueries,
    ...dashboardQueries,
    ...sidebarQueries,
    ...notificationsQueries,
  },
  mutations: {
    ...dashboardMutations,
    ...notificationsMutations,
  },
});
