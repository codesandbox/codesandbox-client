import gql from 'graphql-tag';

export const commentFragment = gql`
  fragment Comment on Comment {
    id
    content
    insertedAt
    updatedAt
    isResolved
    references {
      id
      metadata {
        ... on CodeReferenceMetadata {
          anchor
          code
          head
          path
        }
      }
      resource
      type
    }
    user {
      id
      name
      username
      avatarUrl
    }
    parentComment {
      id
    }
    comments {
      id
    }
  }
`;

export const commentWithRepliesFragment = gql`
  fragment CommentWithReplies on Comment {
    id
    content
    insertedAt
    updatedAt
    isResolved
    references {
      id
      metadata {
        ... on CodeReferenceMetadata {
          anchor
          code
          head
          path
        }
      }
      resource
      type
    }
    user {
      id
      name
      username
      avatarUrl
    }
    parentComment {
      id
    }
    comments {
      ...Comment
    }
  }
  ${commentFragment}
`;
