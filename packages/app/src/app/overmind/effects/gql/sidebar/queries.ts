import { gql, Query } from 'overmind-graphql';

import {
  TeamSidebarFlagsQuery,
  TeamSidebarFlagsQueryVariables,
  TeamSidebarProjectsQuery,
  TeamSidebarProjectsQueryVariables,
} from 'app/graphql/types';

import {
  sidebarProjectFragment,
} from './fragments';

// Lightweight query for checking sidebar flags (hasSyncedSandboxes, hasTemplates)
// Uses inline fields instead of fragments to minimize GraphQL overhead
export const getTeamSidebarFlags: Query<
  TeamSidebarFlagsQuery,
  TeamSidebarFlagsQueryVariables
> = gql`
  query TeamSidebarFlags($id: UUID4!) {
    me {
      id
      
      team(id: $id) {
        syncedSandboxes: sandboxes(hasOriginalGit: true, limit: 1) {
          id
        }
        templates {
          id
        }
      }
    }
  }
`;

// Separate query for projects to reduce query complexity
export const getTeamSidebarProjects: Query<
  TeamSidebarProjectsQuery,
  TeamSidebarProjectsQueryVariables
> = gql`
  query TeamSidebarProjects($id: UUID4!) {
    me {
      id
      
      team(id: $id) {
        projects(syncData: false) {
          ...sidebarProjectFragment
        }
      }
    }
  }
  ${sidebarProjectFragment}
`;