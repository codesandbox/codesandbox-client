import gql from 'graphql-tag';

export const BOOKMARK_TEMPLATE_FRAGMENT = gql`
  fragment BookmarkTemplateFields on Template {
    id
    bookmarked {
      isBookmarked
      entity {
        __typename
        ... on User {
          id
          name: username
        }
        ... on Team {
          id
          name
        }
      }
    }
  }
`;

export const BOOKMARKED_SANDBOX_INFO = gql`
  query BookmarkedSandboxInfo($sandboxId: ID!) {
    sandbox(sandboxId: $sandboxId) {
      id
      author {
        id
        name: username
      }
      customTemplate {
        ...BookmarkTemplateFields
      }
    }
  }

  ${BOOKMARK_TEMPLATE_FRAGMENT}
`;
