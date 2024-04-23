import { gql, Query } from 'overmind-graphql';

import {
  TeamSidebarDataQuery,
  TeamSidebarDataQueryVariables,
} from 'app/graphql/types';

import {
  sidebarProjectFragment,
  sidebarSyncedSandboxFragment,
  sidebarTemplateFragment,
} from './fragments';
import { sandboxFragmentDashboard } from '../dashboard/fragments';

export const getTeamSidebarData: Query<
  TeamSidebarDataQuery,
  TeamSidebarDataQueryVariables
> = gql`
  query TeamSidebarData($id: UUID4!) {
    me {
      team(id: $id) {
        syncedSandboxes: sandboxes(hasOriginalGit: true) {
          ...sidebarSyncedSandboxFragment
        }
        templates {
          ...sidebarTemplateFragment
        }
        projects(syncData: false) {
          ...sidebarProjectFragment
        }
        sandboxes(limit: 10, orderBy: { field: "updatedAt", direction: DESC }) {
          ...sandboxFragmentDashboard
        }
      }
    }
  }
  ${sidebarSyncedSandboxFragment}
  ${sidebarTemplateFragment}
  ${sidebarProjectFragment}
  ${sandboxFragmentDashboard}
`;
