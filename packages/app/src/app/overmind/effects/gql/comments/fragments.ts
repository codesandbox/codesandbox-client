import { gql } from 'overmind-graphql';

export const codeReferenceMetadataFragment = gql`
  fragment CodeReferenceMetadata on CodeReferenceMetadata {
    anchor
    code
    head
    path
  }
`;

export const userReferenceMetadataFragment = gql`
  fragment UserReferenceMetadata on UserReferenceMetadata {
    username
    userId
  }
`;

export const imageReferenceMetadataFragment = gql`
  fragment ImageReferenceMetadata on ImageReferenceMetadata {
    fileName
  }
`;

export const previewReferenceMetadataFragment = gql`
  fragment PreviewReferenceMetadata on PreviewReferenceMetadata {
    width
    height
    x
    y
    screenshotUrl
    responsive
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
        ... on PreviewReferenceMetadata {
          ...PreviewReferenceMetadata
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
        ... on ImageReferenceMetadata {
          ...ImageReferenceMetadata
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
  ${userReferenceMetadataFragment}
  ${imageReferenceMetadataFragment}
  ${previewReferenceMetadataFragment}
`;

export const commentWithRepliesFragment = gql`
  fragment CommentWithReplies on Comment {
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
        ... on PreviewReferenceMetadata {
          ...PreviewReferenceMetadata
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
        ... on ImageReferenceMetadata {
          ...ImageReferenceMetadata
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
  ${userReferenceMetadataFragment}
  ${imageReferenceMetadataFragment}
  ${previewReferenceMetadataFragment}
`;
