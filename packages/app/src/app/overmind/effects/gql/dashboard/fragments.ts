import { gql } from 'overmind-graphql';

export const repoFragmentDashboard = gql`
  fragment repoFragmentDashboard on Sandbox {
    id
    alias
    title
    insertedAt
    updatedAt
    removedAt
    privacy
    screenshotUrl
    screenshotOutdated
    likeCount
    forkCount
    viewCount
    source {
      template
    }
    baseGit {
      branch
      id
      repo
      username
      path
    }
    originalGit {
      branch
      id
      repo
      username
      path
    }
    prNumber
  }
`;

export const sandboxFragmentDashboard = gql`
  fragment sandboxFragmentDashboard on Sandbox {
    id
    alias
    title
    description
    insertedAt
    updatedAt
    removedAt
    privacy
    screenshotUrl
    screenshotOutdated
    likeCount
    forkCount
    viewCount

    source {
      template
    }

    customTemplate {
      id
    }

    forkedTemplate {
      id
      color
      iconUrl
    }

    collection {
      path
    }

    authorId
    teamId
  }
`;

export const sidebarCollectionDashboard = gql`
  fragment sidebarCollectionDashboard on Collection {
    id
    path
    sandboxCount
  }
`;

export const templateFragmentDashboard = gql`
  fragment templateFragmentDashboard on Template {
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
      removedAt
      likeCount
      forkCount
      viewCount
      screenshotUrl
      screenshotOutdated
      privacy

      git {
        id
        username
        commitSha
        path
        repo
        branch
      }

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

export const teamFragmentDashboard = gql`
  fragment teamFragmentDashboard on Team {
    id
    name
    description
    creatorId

    users {
      id
      name
      username
      avatarUrl
    }

    invitees {
      id
      name
      username
      avatarUrl
    }
  }
`;

export const currentTeamInfoFragment = gql`
  fragment currentTeamInfoFragment on Team {
    id
    creatorId
    description
    inviteToken
    joinedPilotAt
    name

    users {
      id
      avatarUrl
      username
    }

    invitees {
      id
      avatarUrl
      username
    }
  }
`;
