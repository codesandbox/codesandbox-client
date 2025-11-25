import {
  TeamTemplatesQuery,
  TeamTemplatesQueryVariables,
  RecentlyDeletedTeamSandboxesQuery,
  RecentlyDeletedTeamSandboxesQueryVariables,
  SandboxesByPathQuery,
  SandboxesByPathQueryVariables,
  AllTeamsQuery,
  AllTeamsQueryVariables,
  RecentlyAccessedSandboxesLegacyQuery,
  RecentlyAccessedSandboxesLegacyQueryVariables,
  AllCollectionsQuery,
  AllCollectionsQueryVariables,
  _SearchTeamSandboxesQuery,
  _SearchTeamSandboxesQueryVariables,
  GetTeamQuery,
  GetTeamQueryVariables,
  TeamDraftsQuery,
  TeamDraftsQueryVariables,
  GetTeamReposQueryVariables,
  GetTeamReposQuery,
  SharedWithMeSandboxesQuery,
  SharedWithMeSandboxesQueryVariables,
  RecentlyAccessedBranchesLegacyQuery,
  RecentlyAccessedBranchesLegacyQueryVariables,
  ContributionBranchesQuery,
  ContributionBranchesQueryVariables,
  RepositoriesByTeamQuery,
  RepositoriesByTeamQueryVariables,
  RepositoryByDetailsQuery,
  RepositoryByDetailsQueryVariables,
  GetGithubRepoQuery,
  GetGithubRepoQueryVariables,
  GetPartialGitHubAccountReposQuery,
  GetPartialGitHubAccountReposQueryVariables,
  GetFullGitHubAccountReposQuery,
  GetFullGitHubAccountReposQueryVariables,
  GetPartialGitHubOrganizationReposQuery,
  GetPartialGitHubOrganizationReposQueryVariables,
  GetFullGitHubOrganizationReposQuery,
  GetFullGitHubOrganizationReposQueryVariables,
  GetSandboxWithTemplateQuery,
  GetSandboxWithTemplateQueryVariables,
  GetEligibleWorkspacesQuery,
  GetEligibleWorkspacesQueryVariables,
} from 'app/graphql/types';
import { gql, Query } from 'overmind-graphql';

import {
  sidebarCollectionDashboard,
  templateFragmentDashboard,
  repoFragmentDashboard,
  currentTeamInfoFragment,
  teamFragmentDashboard,
  branchFragment,
  branchWithPRFragment,
  projectFragment,
  projectWithBranchesFragment,
  githubRepoFragment,
} from './fragments';

const RECENTLY_DELETED_TEAM_SANDBOXES_FRAGMENT = gql`
fragment recentlyDeletedTeamSandboxes on Sandbox {
  id

  alias

  collection {
    id
    path
  }

  isV2
  removedAt
  title
}
`;

export const deletedTeamSandboxes: Query<
  RecentlyDeletedTeamSandboxesQuery,
  RecentlyDeletedTeamSandboxesQueryVariables
> = gql`
  query recentlyDeletedTeamSandboxes($teamId: UUID4!) {
    me {
      id
      
      team(id: $teamId) {
        sandboxes(
          showDeleted: true
          orderBy: { field: "updated_at", direction: DESC }
        ) {
          ...recentlyDeletedTeamSandboxes
        }
      }
    }
  }
  ${RECENTLY_DELETED_TEAM_SANDBOXES_FRAGMENT}
`;

const SANDBOX_BY_PATH_FRAGMENT = gql`
  fragment sandboxByPath on Sandbox {
    id
    alias
    title
    insertedAt
    updatedAt
    screenshotUrl
    isV2
    isFrozen
    privacy
    restricted
    draft
    viewCount

    source {
      template
    }

    customTemplate {
      id
      iconUrl
    }

    forkedTemplate {
      id
      iconUrl
    }

    collection {
      path
      id
    }

    author {
      username
    }
    teamId

    permissions {
      preventSandboxLeaving
      preventSandboxExport
    }
  }
`;

export const sandboxesByPath: Query<
  SandboxesByPathQuery,
  SandboxesByPathQueryVariables
> = gql`
  query SandboxesByPath($path: String!, $teamId: ID) {
    me {
      id
      
      collections(teamId: $teamId) {
        ...sidebarCollectionDashboard
      }
      collection(path: $path, teamId: $teamId) {
        id
        path
        sandboxes {
          ...sandboxByPath
        }
      }
    }
  }
  ${SANDBOX_BY_PATH_FRAGMENT}
  ${sidebarCollectionDashboard}
`;

const DRAFT_SANDBOX_FRAGMENT = gql`
  fragment draftSandbox on Sandbox {
    id
    alias
    title
    insertedAt
    updatedAt
    screenshotUrl
    isV2
    isFrozen
    privacy
    restricted
    draft
    viewCount
    authorId
    lastAccessedAt

    source {
      template
    }

    customTemplate {
      id
      iconUrl
    }

    forkedTemplate {
      id
      iconUrl
    }

    collection {
      path
      id
    }

    author {
      username
    }
    teamId

    permissions {
      preventSandboxLeaving
      preventSandboxExport
    }
  }
`;

export const getTeamDrafts: Query<
  TeamDraftsQuery,
  TeamDraftsQueryVariables
> = gql`
  query TeamDrafts($teamId: UUID4!, $authorId: UUID4) {
    me {
      id
      
      team(id: $teamId) {
        drafts(authorId: $authorId) {
          ...draftSandbox
        }
      }
    }
  }
  ${DRAFT_SANDBOX_FRAGMENT}
`;

export const getCollections: Query<
  AllCollectionsQuery,
  AllCollectionsQueryVariables
> = gql`
  query AllCollections($teamId: ID) {
    me {
      id
      
      collections(teamId: $teamId) {
        ...sidebarCollectionDashboard
      }
    }
  }
  ${sidebarCollectionDashboard}
`;

export const getTeamRepos: Query<
  GetTeamReposQuery,
  GetTeamReposQueryVariables
> = gql`
  query getTeamRepos($id: UUID4!) {
    me {
      id
      
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
      id
      
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

export const getTeams: Query<AllTeamsQuery, AllTeamsQueryVariables> = gql`
  query AllTeams {
    me {
      id
      
      primaryWorkspaceId
      workspaces {
        ...teamFragmentDashboard
      }
    }
  }
  ${teamFragmentDashboard}
`;

const SEARCH_TEAM_SANDBOX_FRAGMENT = gql`
  fragment searchTeamSandbox on Sandbox {
    id
    alias
    title
    description
    updatedAt
    viewCount
    isV2
    draft
    restricted
    privacy
    screenshotUrl

    source {
      template
    }

    customTemplate {
      id
      iconUrl
    }

    author {
      username
    }

    collection {
      path
      id
    }
  }
`;

export const searchTeamSandboxes: Query<
  _SearchTeamSandboxesQuery,
  _SearchTeamSandboxesQueryVariables
> = gql`
  query _SearchTeamSandboxes($teamId: UUID4!) {
    me {
      id
      
      team(id: $teamId) {
        sandboxes(orderBy: { field: "updated_at", direction: DESC }) {
          ...searchTeamSandbox
        }
      }
    }
  }
  ${SEARCH_TEAM_SANDBOX_FRAGMENT}
`;

const RECENTLY_ACCESSED_SANDBOX_FRAGMENT = gql`
  fragment recentlyAccessedSandbox on Sandbox {
    id
    alias
    title
    lastAccessedAt
    privacy
    restricted
    draft
    isV2
    screenshotUrl

    source {
      template
    }

    customTemplate {
      id
      iconUrl
    }

    forkedTemplate {
      id
      color
      iconUrl
    }

    collection {
      path
      id
    }

    author {
      username
    }
  }
`;

export const recentlyAccessedSandboxes: Query<
  RecentlyAccessedSandboxesLegacyQuery,
  RecentlyAccessedSandboxesLegacyQueryVariables
> = gql`
  query RecentlyAccessedSandboxesLegacy($limit: Int!, $teamId: UUID4) {
    me {
      id
      
      recentlyAccessedSandboxes(limit: $limit, teamId: $teamId) {
        ...recentlyAccessedSandbox
      }
    }
  }
  ${RECENTLY_ACCESSED_SANDBOX_FRAGMENT}
`;

export const recentlyAccessedBranches: Query<
  RecentlyAccessedBranchesLegacyQuery,
  RecentlyAccessedBranchesLegacyQueryVariables
> = gql`
  query RecentlyAccessedBranchesLegacy($limit: Int!, $teamId: UUID4) {
    me {
      id
      
      recentBranches(limit: $limit, teamId: $teamId) {
        ...branch
      }
    }
  }
  ${branchFragment}
`;

const COLLABORATOR_SANDBOX_FRAGMENT = gql`
  fragment collaboratorSandbox on Sandbox {
    id
    alias
    title
    description
    updatedAt
    viewCount
    isV2
    draft
    restricted
    privacy
    screenshotUrl

    source {
      template
    }

    customTemplate {
      id
      iconUrl
    }

    author {
      username
    }

    collection {
      path
      id
    }
  }
`;

export const sharedWithmeSandboxes: Query<
  SharedWithMeSandboxesQuery,
  SharedWithMeSandboxesQueryVariables
> = gql`
  query SharedWithMeSandboxes {
    me {
      id
      
      collaboratorSandboxes {
        ...collaboratorSandbox
      }
    }
  }
  ${COLLABORATOR_SANDBOX_FRAGMENT}
`;

export const getTeam: Query<GetTeamQuery, GetTeamQueryVariables> = gql`
  query getTeam($teamId: UUID4!) {
    me {
      id
      
      team(id: $teamId) {
        ...currentTeamInfoFragment
      }
    }
  }
  ${currentTeamInfoFragment}
`;

export const getContributionBranches: Query<
  ContributionBranchesQuery,
  ContributionBranchesQueryVariables
> = gql`
  query ContributionBranches {
    me {
      id
      
      recentBranches(contribution: true, limit: 1000) {
        ...branch
      }
    }
  }
  ${branchFragment}
`;

export const getRepositoriesByTeam: Query<
  RepositoriesByTeamQuery,
  RepositoriesByTeamQueryVariables
> = gql`
  query RepositoriesByTeam($teamId: UUID4!, $syncData: Boolean) {
    me {
      id
      
      team(id: $teamId) {
        id
        name
        projects(syncData: $syncData) {
          ...project
        }
      }
    }
  }
  ${projectFragment}
`;

export const getRepositoryByDetails: Query<
  RepositoryByDetailsQuery,
  RepositoryByDetailsQueryVariables
> = gql`
  query RepositoryByDetails($owner: String!, $name: String!, $teamId: ID) {
    project(gitProvider: GITHUB, owner: $owner, repo: $name, team: $teamId) {
      ...projectWithBranches
    }
  }
  ${projectWithBranchesFragment}
  ${branchWithPRFragment}
`;

export const getGithubRepository: Query<
  GetGithubRepoQuery,
  GetGithubRepoQueryVariables
> = gql`
  query GetGithubRepo($owner: String!, $name: String!) {
    githubRepo(owner: $owner, repo: $name) {
      name
      fullName
      updatedAt
      pushedAt
      authorization
      private
      appInstalled
      owner {
        id
        login
        avatarUrl
      }
    }
  }
`;

export const getPartialAccountRepos: Query<
  GetPartialGitHubAccountReposQuery,
  GetPartialGitHubAccountReposQueryVariables
> = gql`
  query GetPartialGitHubAccountRepos {
    me {
      id
      githubRepos(perPage: 10, page: 1, sort: PUSHED, affiliation: OWNER) {
        ...githubRepo
      }
    }
  }
  ${githubRepoFragment}
`;

export const getFullAccountRepos: Query<
  GetFullGitHubAccountReposQuery,
  GetFullGitHubAccountReposQueryVariables
> = gql`
  query GetFullGitHubAccountRepos {
    me {
      id
      githubRepos(sort: PUSHED, affiliation: OWNER) {
        ...githubRepo
      }
    }
  }
  ${githubRepoFragment}
`;

export const getPartialOrganizationRepos: Query<
  GetPartialGitHubOrganizationReposQuery,
  GetPartialGitHubOrganizationReposQueryVariables
> = gql`
  query GetPartialGitHubOrganizationRepos($organization: String!) {
    githubOrganizationRepos(
      organization: $organization
      sort: PUSHED
      perPage: 10
      page: 1
    ) {
      ...githubRepo
    }
  }
  ${githubRepoFragment}
`;

export const getFullOrganizationRepos: Query<
  GetFullGitHubOrganizationReposQuery,
  GetFullGitHubOrganizationReposQueryVariables
> = gql`
  query GetFullGitHubOrganizationRepos($organization: String!) {
    githubOrganizationRepos(organization: $organization, sort: PUSHED) {
      ...githubRepo
    }
  }
  ${githubRepoFragment}
`;

export const getSandboxWithTemplate: Query<
  GetSandboxWithTemplateQuery,
  GetSandboxWithTemplateQueryVariables
> = gql`
  query GetSandboxWithTemplate($id: ID!) {
    sandbox(sandboxId: $id) {
      id
      alias
      title
      description
      forkCount
      viewCount
      isV2
      insertedAt
      updatedAt
      team {
        name
      }
      source {
        template
      }
      customTemplate {
        id
        iconUrl
      }
    }
  }
`;

export const getEligibleWorkspaces: Query<
  GetEligibleWorkspacesQuery,
  GetEligibleWorkspacesQueryVariables
> = gql`
  query GetEligibleWorkspaces {
    me {
      id
      
      eligibleWorkspaces {
        id
        avatarUrl
        name
        shortid
      }
    }
  }
`;
