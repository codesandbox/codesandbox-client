import { gql } from 'overmind-graphql';

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
    isFrozen
    screenshotUrl
    screenshotOutdated
    viewCount
    likeCount
    alwaysOn

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

    permissions {
      preventSandboxLeaving
      preventSandboxExport
    }
  }
`;

export const repoFragmentDashboard = gql`
  fragment repoFragmentDashboard on Sandbox {
    ...sandboxFragmentDashboard
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

  ${sandboxFragmentDashboard}
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
      ...sandboxFragmentDashboard

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
  ${sandboxFragmentDashboard}
`;

export const teamFragmentDashboard = gql`
  fragment teamFragmentDashboard on Team {
    id
    name
    description
    creatorId
    avatarUrl
    joinedPilotAt
    settings {
      minimumPrivacy
    }

    userAuthorizations {
      userId
      authorization
    }

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

    subscription {
      origin
      type
      paymentProvider
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
    avatarUrl

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

    userAuthorizations {
      userId
      authorization
    }

    settings {
      minimumPrivacy
      preventSandboxExport
      preventSandboxLeaving
      defaultAuthorization
    }

    subscription {
      id
      type
      status
      origin
      quantity
      unitPrice
      currency
      billingInterval
      updateBillingUrl
      nextBillDate
      paymentProvider
      cancelAt
    }
  }
`;

export const npmRegistryFragment = gql`
  fragment npmRegistry on PrivateRegistry {
    id
    authType
    enabledScopes
    limitToScopes
    proxyEnabled
    registryAuthKey
    registryType
    registryUrl
    teamId
  }
`;
