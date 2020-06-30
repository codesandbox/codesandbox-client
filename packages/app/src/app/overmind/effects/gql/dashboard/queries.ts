import {
  TeamTemplatesQuery,
  TeamTemplatesQueryVariables,
  RecentlyDeletedPersonalSandboxesQuery,
  RecentlyDeletedPersonalSandboxesQueryVariables,
  RecentlyDeletedTeamSandboxesQuery,
  RecentlyDeletedTeamSandboxesQueryVariables,
  SandboxesByPathQuery,
  SandboxesByPathQueryVariables,
  OwnedTemplatesQuery,
  OwnedTemplatesQueryVariables,
  AllTeamsQuery,
  AllTeamsQueryVariables,
  ListUserTemplatesQuery,
  ListUserTemplatesQueryVariables,
  LatestSandboxesQuery,
  LatestSandboxesQueryVariables,
  RecentlyAccessedSandboxesQuery,
  RecentlyAccessedSandboxesQueryVariables,
  LatestTeamSandboxesQuery,
  LatestTeamSandboxesQueryVariables,
  AllCollectionsQuery,
  AllCollectionsQueryVariables,
  _SearchPersonalSandboxesQuery,
  _SearchPersonalSandboxesQueryVariables,
  _SearchTeamSandboxesQuery,
  _SearchTeamSandboxesQueryVariables,
  GetTeamQuery,
  GetTeamQueryVariables,
  GetReposQueryVariables,
  GetReposQuery,
  TeamDraftsQuery,
  TeamDraftsQueryVariables,
  GetTeamReposQueryVariables,
} from 'app/graphql/types';
import { gql, Query } from 'overmind-graphql';

import {
  sandboxFragmentDashboard,
  sidebarCollectionDashboard,
  templateFragmentDashboard,
  repoFragmentDashboard,
  currentTeamInfoFragment,
} from './fragments';

export const deletedPersonalSandboxes: Query<
  RecentlyDeletedPersonalSandboxesQuery,
  RecentlyDeletedPersonalSandboxesQueryVariables
> = gql`
  query recentlyDeletedPersonalSandboxes {
    me {
      sandboxes(
        showDeleted: true
        orderBy: { field: "updated_at", direction: DESC }
      ) {
        ...sandboxFragmentDashboard
      }
    }
  }
  ${sandboxFragmentDashboard}
`;

export const deletedTeamSandboxes: Query<
  RecentlyDeletedTeamSandboxesQuery,
  RecentlyDeletedTeamSandboxesQueryVariables
> = gql`
  query recentlyDeletedTeamSandboxes($teamId: ID!) {
    me {
      team(id: $teamId) {
        sandboxes(
          showDeleted: true
          orderBy: { field: "updated_at", direction: DESC }
        ) {
          ...sandboxFragmentDashboard
        }
      }
    }
  }
  ${sandboxFragmentDashboard}
`;

export const sandboxesByPath: Query<
  SandboxesByPathQuery,
  SandboxesByPathQueryVariables
> = gql`
  query SandboxesByPath($path: String!, $teamId: ID) {
    me {
      collections(teamId: $teamId) {
        ...sidebarCollectionDashboard
      }
      collection(path: $path, teamId: $teamId) {
        id
        path
        sandboxes {
          ...sandboxFragmentDashboard
        }
      }
    }
  }
  ${sandboxFragmentDashboard}
  ${sidebarCollectionDashboard}
`;

export const getTeamDrafts: Query<
  TeamDraftsQuery,
  TeamDraftsQueryVariables
> = gql`
  query TeamDrafts($teamId: ID!, $authorId: ID) {
    me {
      team(id: $teamId) {
        drafts(authorId: $authorId) {
          ...sandboxFragmentDashboard
        }
      }
    }
  }
  ${sandboxFragmentDashboard}
`;

export const getCollections: Query<
  AllCollectionsQuery,
  AllCollectionsQueryVariables
> = gql`
  query AllCollections($teamId: ID) {
    me {
      collections(teamId: $teamId) {
        ...sidebarCollectionDashboard
      }
    }
  }
  ${sidebarCollectionDashboard}
`;

export const getPersonalRepos: Query<
  GetReposQuery,
  GetReposQueryVariables
> = gql`
  query getPersonalRepos {
    me {
      sandboxes {
        ...repoFragmentDashboard
      }
    }
  }
  ${repoFragmentDashboard}
`;

export const getTeamRepos: Query<
  GetTeamQuery,
  GetTeamReposQueryVariables
> = gql`
  query getTeamRepos($id: ID!) {
    me {
      team(id: $id) {
        sandboxes {
          ...repoFragmentDashboard
        }
      }
    }
  }
  ${repoFragmentDashboard}
`;

export const teamTemplates: Query<
  TeamTemplatesQuery,
  TeamTemplatesQueryVariables
> = gql`
  query TeamTemplates($id: ID!) {
    me {
      team(id: $id) {
        id
        name
        templates {
          ...templateFragmentDashboard
        }
      }
    }
  }

  ${templateFragmentDashboard}
`;

export const ownedTemplates: Query<
  OwnedTemplatesQuery,
  OwnedTemplatesQueryVariables
> = gql`
  query OwnedTemplates($showAll: Boolean) {
    me {
      templates(showAll: $showAll) {
        ...templateFragmentDashboard
      }
    }
  }

  ${templateFragmentDashboard}
`;

export const getTeams: Query<AllTeamsQuery, AllTeamsQueryVariables> = gql`
  query AllTeams {
    me {
      teams {
        id
        name
      }
    }
  }
`;

export const searchPersonalSandboxes: Query<
  _SearchPersonalSandboxesQuery,
  _SearchPersonalSandboxesQueryVariables
> = gql`
  query _SearchPersonalSandboxes {
    me {
      sandboxes(orderBy: { field: "updated_at", direction: DESC }) {
        ...sandboxFragmentDashboard
      }
    }
  }
  ${sandboxFragmentDashboard}
`;

export const searchTeamSandboxes: Query<
  _SearchTeamSandboxesQuery,
  _SearchTeamSandboxesQueryVariables
> = gql`
  query _SearchTeamSandboxes($teamId: ID!) {
    me {
      team(id: $teamId) {
        sandboxes(orderBy: { field: "updated_at", direction: DESC }) {
          ...sandboxFragmentDashboard
        }
      }
    }
  }
  ${sandboxFragmentDashboard}
`;

export const listPersonalTemplates: Query<
  ListUserTemplatesQuery,
  ListUserTemplatesQueryVariables
> = gql`
  query ListUserTemplates($teamId: ID) {
    me {
      id
      templates {
        ...templateFragmentDashboard
      }

      recentlyUsedTemplates(teamId: $teamId) {
        ...templateFragmentDashboard
      }

      bookmarkedTemplates {
        ...templateFragmentDashboard
      }

      teams {
        id
        name
        bookmarkedTemplates {
          ...templateFragmentDashboard
        }
        templates {
          ...templateFragmentDashboard
        }
      }
    }
  }

  ${templateFragmentDashboard}
`;

export const recentSandboxes: Query<
  LatestSandboxesQuery,
  LatestSandboxesQueryVariables
> = gql`
  query LatestSandboxes(
    $limit: Int!
    $orderField: String!
    $orderDirection: Direction!
  ) {
    me {
      sandboxes(
        limit: $limit
        orderBy: { field: $orderField, direction: $orderDirection }
      ) {
        ...sandboxFragmentDashboard
      }
    }
  }
  ${sandboxFragmentDashboard}
`;

export const recentlyAccessedSandboxes: Query<
  RecentlyAccessedSandboxesQuery,
  RecentlyAccessedSandboxesQueryVariables
> = gql`
  query RecentlyAccessedSandboxes($limit: Int!, $teamId: ID) {
    me {
      recentlyAccessedSandboxes(limit: $limit, teamId: $teamId) {
        ...sandboxFragmentDashboard
      }
    }
  }
  ${sandboxFragmentDashboard}
`;

export const recentTeamSandboxes: Query<
  LatestTeamSandboxesQuery,
  LatestTeamSandboxesQueryVariables
> = gql`
  query LatestTeamSandboxes(
    $limit: Int!
    $orderField: String!
    $orderDirection: Direction!
    $teamId: ID!
    $authorId: ID!
  ) {
    me {
      team(id: $teamId) {
        sandboxes(
          limit: $limit
          authorId: $authorId
          orderBy: { field: $orderField, direction: $orderDirection }
        ) {
          ...sandboxFragmentDashboard
        }
      }
    }
  }
  ${sandboxFragmentDashboard}
`;

export const getTeam: Query<GetTeamQuery, GetTeamQueryVariables> = gql`
  query getTeam($teamId: ID!) {
    me {
      team(id: $teamId) {
        ...currentTeamInfoFragment
      }
    }
  }
  ${currentTeamInfoFragment}
`;
