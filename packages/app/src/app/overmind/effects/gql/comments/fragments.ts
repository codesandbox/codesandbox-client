import gql from 'graphql-tag';

export const commentFragment = gql`
  fragment Comment on Comment {
    id
    content
    insertedAt
    updatedAt
    user {
      id
      name
      username
      avatarUrl
    }
  }
`;

export const commentThreadFragment = gql`
  fragment CommentThread on CommentThread {
    id
    initialComment {
      ...Comment
    }
    reference {
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
    comments {
      ...Comment
    }
    insertedAt
    isResolved
    updatedAt
  }
  ${commentFragment}
`;
