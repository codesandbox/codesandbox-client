import gql from 'graphql-tag';

const TEMPLATE_FRAGMENT = gql`
  fragment Template on Template {
    id
    color
    iconUrl
    published
    sandbox {
      id
      alias
      title
      description
      insertedAt
      updatedAt
      isV2
      isSse

      team {
        name
      }

      author {
        username
      }

      source {
        template
      }
    }
  }
`;

export const FETCH_TEAM_TEMPLATES = gql`
  query RecentAndWorkspaceTemplates($teamId: UUID4) {
    me {
      recentlyUsedTemplates {
        ...Template
      }

      team(id: $teamId) {
        templates {
          ...Template
        }
      }
    }
  }

  ${TEMPLATE_FRAGMENT}
`;

export const GET_GITHUB_REPO = gql`
  query GetGithubRepo($owner: String!, $name: String!) {
    githubRepo(owner: $owner, repo: $name) {
      name
      fullName
      updatedAt
      pushedAt
      authorization
      private
      owner {
        id
        login
        avatarUrl
      }
    }
  }
`;

const PROFILE_FRAGMENT = gql`
  fragment Profile on GithubProfile {
    id
    login
    name
  }
`;

const ORGANIZATION_FRAGMENT = gql`
  fragment Organization on GithubOrganization {
    id
    login
  }
`;

export const GET_GITHUB_ACCOUNTS = gql`
  query GetGithubAccounts {
    me {
      githubProfile {
        ...Profile
      }
      githubOrganizations {
        ...Organization
      }
    }
  }

  ${PROFILE_FRAGMENT}
  ${ORGANIZATION_FRAGMENT}
`;

// TODO: Remove unnecessary fields
export const GET_GITHUB_ACCOUNT_REPOS = gql`
  query GetGitHubAccountRepos($perPage: Int, $page: Int) {
    me {
      id
      githubRepos(perPage: $perPage, page: $page) {
        id
        authorization
        fullName
        name
        private
        updatedAt
        pushedAt
        owner {
          id
          login
          avatarUrl
        }
      }
    }
  }
`;

// TODO: Remove unnecessary fields
export const GET_GITHUB_ORGANIZATION_REPOS = gql`
  query GetGitHubOrganizationRepos(
    $organization: String!
    $perPage: Int
    $page: Int
  ) {
    githubOrganizationRepos(
      organization: $organization
      perPage: $perPage
      page: $page
    ) {
      id
      authorization
      fullName
      name
      private
      updatedAt
      pushedAt
      owner {
        id
        login
      }
    }
  }
`;

export const GET_REPOSITORY_TEAMS = gql`
  query RepositoryTeams($owner: String!, $name: String!) {
    projects(owner: $owner, name: $name, provider: GITHUB) {
      team {
        id
        name
      }
    }
  }
`;
