import gql from 'graphql-tag';
import { Query } from 'overmind-graphql';

export const addComment: Query<any, any> = gql`
  mutation AddComment(
    $sandboxId: String!
    $comment: String!
    $username: String!
  ) {
    addComment(sandboxId: $sandboxId, comment: $comment, username: $username) {
      id
      isResolved
      originalMessage {
        id
        content
        author {
          id
          avatarUrl
          username
        }
      }
      replies {
        id
      }
      insertedAt
      updatedAt
    }
  }
`;

export const deleteComment: Query<any, any> = gql`
  mutation DeleteComment($id: String!) {
    deleteComment(id: $id) {
      id
    }
  }
`;

export const updateComment: Query<any, any> = gql`
  mutation UpdateComment($id: String!, $comment: String, $isResolved: Boolean) {
    updateComment(
      id: $id
      data: { comment: $comment, isResolved: $isResolved }
    ) {
      id
      isResolved
      originalMessage {
        id
        content
      }
    }
  }
`;

export const reply: Query<any, any> = gql`
  mutation replyToComment(
    $id: String!
    $comment: String!
    $username: String!
    $metadata: String
  ) {
    addReply(
      id: $id
      comment: $comment
      username: $username
      metadata: $metadata
    ) {
      id
      replies {
        id
        content
        author {
          id
          avatarUrl
          username
        }
      }
    }
  }
`;
