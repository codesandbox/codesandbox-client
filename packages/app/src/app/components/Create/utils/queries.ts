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
      forkCount
      viewCount

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
      recentlyUsedTemplates(teamId: $teamId) {
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
      appInstalled
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
