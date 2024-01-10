import {
  SandboxCommentQuery,
  SandboxCommentQueryVariables,
  SandboxCommentsQuery,
  SandboxCommentsQueryVariables,
} from 'app/graphql/types';
import { gql, Query } from 'overmind-graphql';

import { commentFragment, commentWithRepliesFragment } from './fragments';

export const comment: Query<
  SandboxCommentQuery,
  SandboxCommentQueryVariables
> = gql`
  query SandboxComment($sandboxId: ID!, $commentId: UUID4!) {
    sandbox(sandboxId: $sandboxId) {
      comment(commentId: $commentId) {
        ...CommentWithReplies
      }
    }
  }
  ${commentWithRepliesFragment}
`;

export const comments: Query<
  SandboxCommentsQuery,
  SandboxCommentsQueryVariables
> = gql`
  query SandboxComments($sandboxId: ID!) {
    sandbox(sandboxId: $sandboxId) {
      comments {
        ...Comment
      }
    }
  }
  ${commentFragment}
`;
