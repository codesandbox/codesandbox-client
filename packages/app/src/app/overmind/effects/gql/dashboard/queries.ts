import {
  RecentSandboxesQuery,
  RecentSandboxesQueryVariables,
  PathedSandboxesQuery,
  PathedSandboxesQueryVariables,
  DeletedSandboxesQuery,
  DeletedSandboxesQueryVariables,
  ListTemplatesQuery,
  ListTemplatesQueryVariables,
  ListPersonalTemplatesQuery,
  ListPersonalTemplatesQueryVariables,
} from 'app/graphql/types';
import gql from 'graphql-tag';
import { Query } from 'overmind-graphql';

import {
  sandboxFragment,
  sidebarCollection,
  templateFragment,
} from './fragments';

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

export const ownedTemplates: Query<
  ListTemplatesQuery,
  ListTemplatesQueryVariables
> = gql`
  query ListTemplates($showAll: Boolean) {
    me {
      templates(showAll: $showAll) {
        ...Template
      }

      teams {
        id
        name
        templates {
          ...Template
        }
      }
    }
  }

  ${templateFragment}
`;

export const listPersonalTemplates: Query<
  ListPersonalTemplatesQuery,
  ListPersonalTemplatesQueryVariables
> = gql`
  query ListPersonalTemplates {
    me {
      templates {
        ...Template
      }

      recentlyUsedTemplates {
        ...Template

        sandbox {
          git {
            id
            username
            commitSha
            path
            repo
            branch
          }
        }
      }

      bookmarkedTemplates {
        ...Template
      }

      teams {
        id
        name
        bookmarkedTemplates {
          ...Template
        }
        templates {
          ...Template
        }
      }
    }
  }

  ${templateFragment}
`;

export const recentSandboxes: Query<
  RecentSandboxesQuery,
  RecentSandboxesQueryVariables
> = gql`
  query RecentSandboxes(
    $limit: Int!
    $orderField: String!
    $orderDirection: Direction!
  ) {
    me {
      sandboxes(
        limit: $limit
        orderBy: { field: $orderField, direction: $orderDirection }
      ) {
        ...Sandbox
      }
    }
  }
  ${sandboxFragment}
`;
