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
  GetPersonalReposQueryVariables,
  GetPersonalReposQuery,
  TeamDraftsQuery,
  TeamDraftsQueryVariables,
  GetTeamReposQueryVariables,
  GetTeamReposQuery,
  GetPersonalWorkspaceIdQuery,
  GetPersonalWorkspaceIdQueryVariables,
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
  query recentlyDeletedTeamSandboxes($teamId: UUID4!) {
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
  query TeamDrafts($teamId: UUID4!, $authorId: UUID4) {
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
  GetPersonalReposQuery,
  GetPersonalReposQueryVariables
> = gql`
  query getPersonalRepos {
    me {
      sandboxes(hasOriginalGit: true) {
        ...repoFragmentDashboard
      }
    }
  }
  ${repoFragmentDashboard}
`;

export const getTeamRepos: Query<
  GetTeamReposQuery,
  GetTeamReposQueryVariables
> = gql`
  query getTeamRepos($id: UUID4!) {
    me {
      team(id: $id) {
        sandboxes(hasOriginalGit: true) {
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
  query TeamTemplates($id: UUID4!) {
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
      personalWorkspaceId
      workspaces {
        id
        name
        avatarUrl
        userAuthorizations {
          userId
          authorization
        }
        settings {
          minimumPrivacy
        }
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
  query _SearchTeamSandboxes($teamId: UUID4!) {
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
  query ListUserTemplates($teamId: UUID4) {
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

export const recentPersonalSandboxes: Query<
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
  query RecentlyAccessedSandboxes($limit: Int!, $teamId: UUID4) {
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
    $teamId: UUID4!
  ) {
    me {
      team(id: $teamId) {
        sandboxes(
          limit: $limit
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
  query getTeam($teamId: UUID4!) {
    me {
      team(id: $teamId) {
        ...currentTeamInfoFragment
      }
    }
  }
  ${currentTeamInfoFragment}
`;

export const getPersonalWorkspaceId: Query<
  GetPersonalWorkspaceIdQuery,
  GetPersonalWorkspaceIdQueryVariables
> = gql`
  query getPersonalWorkspaceId {
    me {
      personalWorkspaceId
    }
  }
`;
