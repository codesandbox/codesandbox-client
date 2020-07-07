import { gql } from 'overmind-graphql';

export const codeReferenceMetadataFragment = gql`
  fragment CodeReferenceMetadata on CodeReferenceMetadata {
    anchor
    code
    head
    path
  }
`;

export const usereferenceMetadataFragment = gql`
  fragment UserReferenceMetadata on UserReferenceMetadata {
    username
    userId
  }
`;

export const commentFragment = gql`
  fragment Comment on Comment {
    id
    content
    insertedAt
    updatedAt
    isResolved
    anchorReference {
      id
      metadata {
        ... on CodeReferenceMetadata {
          ...CodeReferenceMetadata
        }
      }
      resource
      type
    }
    references {
      id
      metadata {
        ... on UserReferenceMetadata {
          ...UserReferenceMetadata
        }
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
  ${usereferenceMetadataFragment}
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
        ... on UserReferenceMetadata {
          ...UserReferenceMetadata
        }
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
  ${usereferenceMetadataFragment}
`;
