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

export const LIST_PERSONAL_TEMPLATES = gql`
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

  ${TEMPLATE_FRAGMENT}
`;

export const GET_GITHUB_REPO = gql`
  query GetGithubRepo($owner: String!, $name: String!) {
    githubRepo(owner: $owner, repo: $name) {
      name
      fullName
      updatedAt
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
  }
`;

const ORGANIZATION_FRAGMENT = gql`
  fragment Organization on GithubOrganization {
    id
    login
  }
`;

export const GET_GITHUB_ORGANIZATIONS = gql`
  query GetGithubOrganizations {
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
