import {
  CreateCodeCommentMutation,
  CreateCodeCommentMutationVariables,
  CreateCommentMutation,
  CreateCommentMutationVariables,
  DeleteCommentMutation,
  DeleteCommentMutationVariables,
  ResolveCommentMutation,
  ResolveCommentMutationVariables,
  UnresolveCommentMutation,
  UnresolveCommentMutationVariables,
  UpdateCommentMutation,
  UpdateCommentMutationVariables,
} from 'app/graphql/types';
import { Query, gql } from 'overmind-graphql';

import { commentFragment } from './fragments';

export const createComment: Query<
  CreateCommentMutation,
  CreateCommentMutationVariables
> = gql`
  mutation CreateComment(
    $id: ID
    $content: String!
    $sandboxId: ID!
    $parentCommentId: ID
    $userReferences: [UserReference!]
    $codeReferences: [CodeReference!]
  ) {
    createComment(
      id: $id
      content: $content
      sandboxId: $sandboxId
      parentCommentId: $parentCommentId
      userReferences: $userReferences
      codeReferences: $codeReferences
    ) {
      ...Comment
    }
  }
  ${commentFragment}
`;

export const createCodeComment: Query<
  CreateCodeCommentMutation,
  CreateCodeCommentMutationVariables
> = gql`
  mutation CreateCodeComment(
    $id: ID
    $content: String!
    $sandboxId: ID!
    $parentCommentId: ID
    $anchorReference: CodeReference!
    $userReferences: [UserReference!]
    $codeReferences: [CodeReference!]
  ) {
    createCodeComment(
      id: $id
      content: $content
      sandboxId: $sandboxId
      parentCommentId: $parentCommentId
      anchorReference: $anchorReference
      userReferences: $userReferences
      codeReferences: $codeReferences
    ) {
      ...Comment
    }
  }
  ${commentFragment}
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
    $userReferences: [UserReference!]
    $codeReferences: [CodeReference!]
  ) {
    updateComment(
      commentId: $commentId
      sandboxId: $sandboxId
      content: $content
      userReferences: $userReferences
      codeReferences: $codeReferences
    ) {
      id
    }
  }
`;

export const resolveComment: Query<
  ResolveCommentMutation,
  ResolveCommentMutationVariables
> = gql`
  mutation ResolveComment($commentId: ID!, $sandboxId: ID!) {
    resolveComment(commentId: $commentId, sandboxId: $sandboxId) {
      id
    }
  }
`;

export const unresolveComment: Query<
  UnresolveCommentMutation,
  UnresolveCommentMutationVariables
> = gql`
  mutation UnresolveComment($commentId: ID!, $sandboxId: ID!) {
    unresolveComment(commentId: $commentId, sandboxId: $sandboxId) {
      id
    }
  }
`;
