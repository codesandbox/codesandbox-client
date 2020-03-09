import gql from 'graphql-tag';
import { Query } from 'overmind-graphql';
import {
  AddCommentResponse,
  AddCommentVariables,
  DeleteCommentVariables,
  DeleteCommentResponse,
  UpdateCommentVariables,
  UpdateCommentResponse,
  DeleteReplyVariables,
  DeleteReplyResponse,
  UpdateReplyResponse,
  UpdateReplyVariables,
} from './types';

export const addComment: Query<AddCommentResponse, AddCommentVariables> = gql`
  mutation AddComment(
    $sandboxId: String!
    $comment: String!
    $username: String!
    $metadata: String
  ) {
    addComment(
      sandboxId: $sandboxId
      comment: $comment
      username: $username
      metadata: $metadata
    ) {
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
      metadata
      insertedAt
      updatedAt
    }
  }
`;

export const deleteComment: Query<
  DeleteCommentResponse,
  DeleteCommentVariables
> = gql`
  mutation DeleteComment($id: String!) {
    deleteComment(id: $id) {
      id
    }
  }
`;

export const updateComment: Query<
  UpdateCommentResponse,
  UpdateCommentVariables
> = gql`
  mutation UpdateComment(
    $id: String!
    $comment: String
    $isResolved: Boolean
    $metadata: String
  ) {
    updateComment(
      id: $id
      data: { comment: $comment, isResolved: $isResolved, metadata: $metadata }
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
        insertedAt
        updatedAt
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

export const deleteReply: Query<
  DeleteReplyResponse,
  DeleteReplyVariables
> = gql`
  mutation deleteReply($replyId: String!, $commentId: String!) {
    deleteReply(replyId: $replyId, commentId: $commentId) {
      id
      replies {
        insertedAt
        updatedAt
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

export const updateReply: Query<
  UpdateReplyResponse,
  UpdateReplyVariables
> = gql`
  mutation updateReply(
    $replyId: String!
    $commentId: String!
    $comment: String!
  ) {
    updateReply(replyId: $replyId, commentId: $commentId, comment: $comment) {
      id
      replies {
        insertedAt
        updatedAt
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
