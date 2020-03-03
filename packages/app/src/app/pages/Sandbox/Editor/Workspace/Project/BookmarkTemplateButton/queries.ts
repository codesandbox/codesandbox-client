import gql from 'graphql-tag';

export const BOOKMARK_TEMPLATE_FRAGMENT = gql`
  fragment BookmarkTemplateFieldsV2 on Template {
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
  query BookmarkedSandboxInfoV2($sandboxId: ID!) {
    sandbox(sandboxId: $sandboxId) {
      id
      author {
        id
        name: username
      }
      customTemplate {
        ...BookmarkTemplateFieldsV2
      }
    }
  }

  ${BOOKMARK_TEMPLATE_FRAGMENT}
`;
