import gql from 'graphql-tag';

/**
 * Recent sandbox
 * 
 * USED:
 * 
 * - id (always)
 * 
 * - lastAccessedAt (used for sorting and visible on bottom left of sandbox card)
 * - title
 * - privacy
 * - isFrozen
 * - isV2 (devbox or sandbox)
 * - draft
 * - restricted (if restricted and !draft it's restricted, try to understand this logic better)
 * - customTemplate (if !customTemplate isFrozen is never true on the client, try to understand this logic better)
 * - author { username }
 * - permissions {
      preventSandboxLeaving (in context menu)
      preventSandboxExport (in context menu)
    }
 * 
 * 
 * REMOVED:
 * - alias (is currently unnecessarily used as backup if title is not set (never happens))
 * - description
 * - insertedAt
 * - updatedAt (not used for recent sandboxes, only for non-recent page sandboxes)
 * - removedAt
 * - viewCount
 * - likeCount
 * - source
 * - forkedTemplate
 * - collection (used for folder name which is not used for recent sandboxes)
 * - authorId
 * - teamId
 */

export const RECENTLY_ACCESSED_SANDBOX_FRAGMENT = gql`
  fragment RecentlyAccessedSandboxFragment on Sandbox {
    id

    author {
      username
    }

    customTemplate {
      id
      iconUrl
    }

    draft
    isFrozen
    isV2
    lastAccessedAt
    privacy
    restricted
    title
  }
`;

export const RECENTLY_ACCESSED_SANDBOXES_QUERY = gql`
  query RecentlyAccessedSandboxes($limit: Int!, $teamId: UUID4) {
    me {
      id
      
      recentlyAccessedSandboxes(limit: $limit, teamId: $teamId) {
        ...RecentlyAccessedSandboxFragment
      }
    }
  }

  ${RECENTLY_ACCESSED_SANDBOX_FRAGMENT}
`;

/**
 * Recent branch
 */

export const RECENTLY_ACCESSED_BRANCH_REPOSITORY_FRAGMENT = gql`
  fragment RecentlyAccessedBranchRepositoryFragment on GitHubRepository {
    id

    defaultBranch
    name
    owner
    private
  }
`;

export const RECENTLY_ACCESSED_BRANCH_FRAGMENT = gql`
  fragment RecentlyAccessedBranchFragment on Branch {
    id

    contribution # nice to have, could be removed if we want
    lastAccessedAt
    name

    project {
      id

      repository {
        ...RecentlyAccessedBranchRepositoryFragment
      }

      team {
        id
      }
    }

    upstream
  }

  ${RECENTLY_ACCESSED_BRANCH_REPOSITORY_FRAGMENT}
`;

export const RECENTLY_ACCESSED_BRANCHES_QUERY = gql`
  query RecentlyAccessedBranches($limit: Int!, $teamId: UUID4) {
    me {
      id

      recentBranches(limit: $limit, teamId: $teamId) {
        ...RecentlyAccessedBranchFragment
      }
    }
  }

  ${RECENTLY_ACCESSED_BRANCH_FRAGMENT}
`;