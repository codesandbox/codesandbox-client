import { gql } from 'overmind-graphql';

export const sandboxFragmentDashboard = gql`
  fragment sandboxFragmentDashboard on Sandbox {
    id
    alias
    title
    description
    lastAccessedAt
    insertedAt
    updatedAt
    removedAt
    privacy
    isFrozen
    isSse
    screenshotUrl
    screenshotOutdated
    viewCount
    likeCount
    alwaysOn
    isV2

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
    type
    description
    creatorId
    avatarUrl
    legacy
    frozen
    settings {
      minimumPrivacy
    }

    userAuthorizations {
      userId
      authorization
      teamManager
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

    subscription(includeCancelled: true) {
      origin
      type
      status
      paymentProvider
    }

    featureFlags {
      ubbBeta
    }
  }
`;

export const currentTeamInfoFragment = gql`
  fragment currentTeamInfoFragment on Team {
    id
    creatorId
    description
    inviteToken
    name
    type
    avatarUrl
    legacy
    frozen
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
      teamManager
    }

    settings {
      minimumPrivacy
      preventSandboxExport
      preventSandboxLeaving
      defaultAuthorization
      aiConsent {
        privateRepositories
        privateSandboxes
        publicRepositories
        publicSandboxes
      }
    }

    subscription(includeCancelled: true) {
      billingInterval
      cancelAt
      cancelAtPeriodEnd
      currency
      id
      nextBillDate
      origin
      paymentMethodAttached
      paymentProvider
      quantity
      status
      trialEnd
      trialStart
      type
      unitPrice
      updateBillingUrl
    }

    limits {
      maxEditors
      maxPrivateProjects
      maxPrivateSandboxes
      maxPublicProjects
      maxPublicSandboxes
      onDemandSpendingLimit
      onDemandCreditLimit
    }

    usage {
      editorsQuantity
      privateProjectsQuantity
      privateSandboxesQuantity
      publicProjectsQuantity
      publicSandboxesQuantity
      credits
    }

    featureFlags {
      ubbBeta
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
    sandpackTrustedDomains
  }
`;

export const branchFragment = gql`
  fragment branch on Branch {
    id
    name
    contribution
    lastAccessedAt
    upstream
    project {
      repository {
        ... on GitHubRepository {
          defaultBranch
          name
          owner
          private
        }
      }
      team {
        id
      }
    }
  }
`;

export const projectFragment = gql`
  fragment project on Project {
    appInstalled
    branchCount
    lastAccessedAt
    repository {
      ... on GitHubRepository {
        owner
        name
        defaultBranch
        private
      }
    }
    team {
      id
    }
  }
`;

export const projectWithBranchesFragment = gql`
  fragment projectWithBranches on Project {
    appInstalled
    branches {
      ...branch
    }
    repository {
      ... on GitHubRepository {
        owner
        name
        defaultBranch
        private
      }
    }
    team {
      id
    }
  }
  ${branchFragment}
`;
