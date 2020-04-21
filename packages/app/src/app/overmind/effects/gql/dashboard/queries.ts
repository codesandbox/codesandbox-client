import {
  RecentSandboxesQuery,
  RecentSandboxesQueryVariables,
  PathedSandboxesQuery,
  PathedSandboxesQueryVariables,
  DeletedSandboxesQuery,
  DeletedSandboxesQueryVariables,
} from 'app/graphql/types';
import gql from 'graphql-tag';
import { Query } from 'overmind-graphql';

import { sandboxFragment, sidebarCollection } from './fragments';

export const recentSandboxesPage: Query<
  RecentSandboxesQuery,
  RecentSandboxesQueryVariables
> = gql`
  query RecentSandboxes($orderField: String!, $orderDirection: Direction!) {
    me {
      sandboxes(
        limit: 50
        orderBy: { field: $orderField, direction: $orderDirection }
      ) {
        ...Sandbox
      }
    }
  }
  ${sandboxFragment}
`;

export const deletedSandboxes: Query<
  DeletedSandboxesQuery,
  DeletedSandboxesQueryVariables
> = gql`
  query DeletedSandboxes {
    me {
      sandboxes(
        showDeleted: true
        orderBy: { field: "updated_at", direction: DESC }
      ) {
        ...Sandbox
      }
    }
  }
  ${sandboxFragment}
`;

export const sandboxesByPath: Query<
  PathedSandboxesQuery,
  PathedSandboxesQueryVariables
> = gql`
  query PathedSandboxes($path: String!, $teamId: ID) {
    me {
      collections(teamId: $teamId) {
        ...SidebarCollection
      }
      collection(path: $path, teamId: $teamId) {
        id
        path
        sandboxes {
          ...Sandbox
        }
      }
    }
  }
  ${sandboxFragment}
  ${sidebarCollection}
`;
