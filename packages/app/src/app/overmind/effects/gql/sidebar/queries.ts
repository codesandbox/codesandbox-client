import { gql, Query } from 'overmind-graphql';

import {
  PersonalSidebarDataQuery,
  TeamSidebarDataQuery,
  TeamSidebarDataQueryVariables,
} from 'app/graphql/types';

import {
  sidebarCollectionFragment,
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
      collections {
        ...sidebarCollectionFragment
      }
      templates {
        ...sidebarTemplateFragment
      }
    }
  }
  ${sidebarSyncedSandboxFragment}
  ${sidebarCollectionFragment}
  ${sidebarTemplateFragment}
`;
/**
 * 👆 fragments might actually be a bit too much for this
 */

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
        collections {
          ...sidebarCollectionFragment
        }
        templates {
          ...sidebarTemplateFragment
        }
      }
    }
  }
  ${sidebarSyncedSandboxFragment}
  ${sidebarCollectionFragment}
  ${sidebarTemplateFragment}
`;
/**
 * 👆 fragments might actually be a bit too much for this
 */
