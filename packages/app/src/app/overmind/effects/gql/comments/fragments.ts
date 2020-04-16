import gql from 'graphql-tag';

export const codeReferenceMetadataFragment = gql`
  fragment CodeReferenceMetadata on CodeReferenceMetadata {
    anchor
    code
    head
    path
  }
`;

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
          ...CodeReferenceMetadata
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
    replyCount
  }
  ${codeReferenceMetadataFragment}
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
          ...CodeReferenceMetadata
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
    replyCount
    comments {
      ...Comment
    }
  }
  ${commentFragment}
  ${codeReferenceMetadataFragment}
`;
