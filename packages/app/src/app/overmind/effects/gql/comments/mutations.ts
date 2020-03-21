import {
  CreateCommentMutation,
  CreateCommentMutationVariables,
  CreateCommentThreadMutation,
  CreateCommentThreadMutationVariables,
  DeleteCommentMutation,
  DeleteCommentMutationVariables,
  ToggleCommentThreadResolvedMutation,
  ToggleCommentThreadResolvedMutationVariables,
  UpdateCommentMutation,
  UpdateCommentMutationVariables,
} from 'app/graphql/types';
import gql from 'graphql-tag';
import { Query } from 'overmind-graphql';

import { commentFragment, commentThreadFragment } from './fragments';

export const createCommentThread: Query<
  CreateCommentThreadMutation,
  CreateCommentThreadMutationVariables
> = gql`
  mutation CreateCommentThread($codeReference: CodeReference!, $sandboxId: ID!, $content: String!) {
    createCommentThread(sandboxId: $sandboxId, content: $content, codeReference: $codeReference) {
      ...CommentThread
    }
    ${commentThreadFragment}
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

export const toggleCommentThreadResolved: Query<
  ToggleCommentThreadResolvedMutation,
  ToggleCommentThreadResolvedMutationVariables
> = gql`
  mutation ToggleCommentThreadResolved(
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
      updatedAt
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
      ...Comment
    }
    ${commentFragment}
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
