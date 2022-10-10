import { gql, Query } from 'overmind-graphql';

import {
  PersonalSidebarDataQuery,
  TeamSidebarDataQuery,
  TeamSidebarDataQueryVariables,
} from 'app/graphql/types';

import {
  sidebarSyncedSandboxFragment,
  sidebarTemplateFragment,
} from './fragments';

export const getPersonalSidebarData: Query<
  PersonalSidebarDataQuery,
  undefined
> = gql`
  query PersonalSidebarData {
    me {
      sandboxes(hasOriginalGit: true) {
        ...sidebarSyncedSandboxFragment
      }
      templates {
        ...sidebarTemplateFragment
      }
    }
  }
  ${sidebarSyncedSandboxFragment}
  ${sidebarTemplateFragment}
`;

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
      }
    }
  }
  ${sidebarSyncedSandboxFragment}
  ${sidebarTemplateFragment}
`;
