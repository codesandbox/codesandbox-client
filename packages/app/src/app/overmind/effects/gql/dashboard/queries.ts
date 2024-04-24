import {
  TeamTemplatesQuery,
  TeamTemplatesQueryVariables,
  RecentlyDeletedTeamSandboxesQuery,
  RecentlyDeletedTeamSandboxesQueryVariables,
  SandboxesByPathQuery,
  SandboxesByPathQueryVariables,
  AllTeamsQuery,
  AllTeamsQueryVariables,
  RecentlyAccessedSandboxesQuery,
  RecentlyAccessedSandboxesQueryVariables,
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
  RecentlyAccessedBranchesQuery,
  RecentlyAccessedBranchesQueryVariables,
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
  sandboxFragmentDashboard,
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

export const getTeams: Query<AllTeamsQuery, AllTeamsQueryVariables> = gql`
  query AllTeams {
    me {
      primaryWorkspaceId
      workspaces {
        ...teamFragmentDashboard
      }
    }
  }
  ${teamFragmentDashboard}
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

export const recentlyAccessedBranches: Query<
  RecentlyAccessedBranchesQuery,
  RecentlyAccessedBranchesQueryVariables
> = gql`
  query RecentlyAccessedBranches($limit: Int!, $teamId: UUID4) {
    me {
      recentBranches(limit: $limit, teamId: $teamId) {
        ...branch
      }
    }
  }
  ${branchFragment}
`;

export const sharedWithmeSandboxes: Query<
  SharedWithMeSandboxesQuery,
  SharedWithMeSandboxesQueryVariables
> = gql`
  query SharedWithMeSandboxes {
    me {
      collaboratorSandboxes {
        ...sandboxFragmentDashboard
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

export const getContributionBranches: Query<
  ContributionBranchesQuery,
  ContributionBranchesQueryVariables
> = gql`
  query ContributionBranches {
    me {
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
      eligibleWorkspaces {
        id
        avatarUrl
        name
        shortid
      }
    }
  }
`;
