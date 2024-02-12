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
      team(id: $id) {
        sandboxes(hasOriginalGit: true) {
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
