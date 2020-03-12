import {
  CreateCommentMutation,
  CreateCommentMutationVariables,
  CreateCommentThreadMutation,
  CreateCommentThreadMutationVariables,
  DeleteCommentMutation,
  DeleteCommentMutationVariables,
  UpdateCommentMutation,
  UpdateCommentMutationVariables,
  UpdateCommentThreadMutation,
  UpdateCommentThreadMutationVariables,
} from 'app/graphql/types';
import gql from 'graphql-tag';
import { Query } from 'overmind-graphql';

export const createCommentThread: Query<
  CreateCommentThreadMutation,
  CreateCommentThreadMutationVariables
> = gql`
  mutation CreateCommentThread($sandboxId: ID!, $content: String!) {
    createCommentThread(sandboxId: $sandboxId, content: $content) {
      id
      isResolved
      insertedAt
      updatedAt
    }
  }
`;

export const deleteComment: Query<
  DeleteCommentMutation,
  DeleteCommentMutationVariables
> = gql`
  mutation DeleteComment($commentId: ID!, $sandboxId: ID!) {
    deleteComment(commentId: $commentId, sandboxId: $sandboxId) {
      id
    }
  }
`;

export const updateCommentThread: Query<
  UpdateCommentThreadMutation,
  UpdateCommentThreadMutationVariables
> = gql`
  mutation UpdateCommentThread(
    $commentThreadId: ID!
    $isResolved: Boolean
    $sandboxId: ID!
  ) {
    updateCommentThread(
      commentThreadId: $commentThreadId
      sandboxId: $sandboxId
      isResolved: $isResolved
    ) {
      id
      isResolved
    }
  }
`;

export const createComment: Query<
  CreateCommentMutation,
  CreateCommentMutationVariables
> = gql`
  mutation CreateComment(
    $commentThreadId: ID!
    $content: String!
    $sandboxId: ID!
  ) {
    createComment(
      commentThreadId: $commentThreadId
      content: $content
      sandboxId: $sandboxId
    ) {
      id
    }
  }
`;

export const updateComment: Query<
  UpdateCommentMutation,
  UpdateCommentMutationVariables
> = gql`
  mutation UpdateComment($commentId: ID!, $content: String!, $sandboxId: ID!) {
    updateComment(
      commentId: $commentId
      content: $content
      sandboxId: $sandboxId
    ) {
      id
    }
  }
`;
