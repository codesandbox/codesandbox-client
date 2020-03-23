import {
  CreateCodeCommentMutation,
  CreateCodeCommentMutationVariables,
  CreateCommentMutation,
  CreateCommentMutationVariables,
  DeleteCommentMutation,
  DeleteCommentMutationVariables,
  UpdateCommentMutation,
  UpdateCommentMutationVariables,
} from 'app/graphql/types';
import gql from 'graphql-tag';
import { Query } from 'overmind-graphql';

import { commentFragment } from './fragments';

export const createComment: Query<
  CreateCommentMutation,
  CreateCommentMutationVariables
> = gql`
  mutation CreateComment(
    $content: String!
    $sandboxId: ID!
    $parentCommentId: ID
  ) {
    createComment(
      content: $content
      sandboxId: $sandboxId
      parentCommentId: $parentCommentId
    ) {
      ...Comment
    }
    ${commentFragment}
  }
`;

export const createCodeComment: Query<
  CreateCodeCommentMutation,
  CreateCodeCommentMutationVariables
> = gql`
  mutation CreateCodeComment($sandboxId: ID!, $content: String!, $codeReference: CodeReference!) {
    createCodeComment(sandboxId: $sandboxId, content: $content, codeReference: $codeReference) {
      ...Comment
    }
    ${commentFragment}
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

export const updateComment: Query<
  UpdateCommentMutation,
  UpdateCommentMutationVariables
> = gql`
  mutation UpdateComment(
    $commentId: ID!
    $sandboxId: ID!
    $content: String
    $isResolved: Boolean
  ) {
    updateComment(
      commentId: $commentId
      sandboxId: $sandboxId
      content: $content
      isResolved: $isResolved
    ) {
      id
    }
  }
`;
