import {
  SandboxCommentRepliesQuery,
  SandboxCommentRepliesQueryVariables,
  SandboxCommentThreadsQuery,
  SandboxCommentThreadsQueryVariables,
} from 'app/graphql/types';
import gql from 'graphql-tag';
import { Query } from 'overmind-graphql';

import { commentFragment } from './fragments';

export const comments: Query<
  SandboxCommentRepliesQuery,
  SandboxCommentRepliesQueryVariables
> = gql`
  query SandboxCommentReplies($sandboxId: ID!, $commentThreadId: ID!) {
    sandbox(sandboxId: $sandboxId) {
      commentThread(commentThreadId: $commentThreadId) {
        id
        comments {
         ...Comment
        }
      }
    }
    ${commentFragment}
  }
`;

export const commentThreads: Query<
  SandboxCommentThreadsQuery,
  SandboxCommentThreadsQueryVariables
> = gql`
  query SandboxCommentThreads($sandboxId: ID!) {
    sandbox(sandboxId: $sandboxId) {
      commentThreads {
        id
        initialComment {
          ...Comment
        }
        comments {
          ...Comment
        }
        insertedAt
        isResolved
        updatedAt
      }
    }
    ${commentFragment}
  }
`;
