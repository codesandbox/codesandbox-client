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

export const getTeamSidebarData: Query<
  TeamSidebarDataQuery,
  TeamSidebarDataQueryVariables
> = gql`
  query TeamSidebarData($id: UUID4!) {
    me {
      id
      
      team(id: $id) {
        syncedSandboxes: sandboxes(hasOriginalGit: true, limit: 1) {
          ...sidebarSyncedSandboxFragment
        }
        templates {
          ...sidebarTemplateFragment
        }
        projects(syncData: false) {
          ...sidebarProjectFragment
        }
      }
    }
  }
  ${sidebarSyncedSandboxFragment}
  ${sidebarTemplateFragment}
  ${sidebarProjectFragment}
`;
