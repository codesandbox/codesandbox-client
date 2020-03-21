import {
  SandboxCommentThreadQuery,
  SandboxCommentThreadQueryVariables,
  SandboxCommentThreadsQuery,
  SandboxCommentThreadsQueryVariables,
} from 'app/graphql/types';
import gql from 'graphql-tag';
import { Query } from 'overmind-graphql';

import { commentFragment, commentThreadFragment } from './fragments';

export const comments: Query<
  SandboxCommentThreadQuery,
  SandboxCommentThreadQueryVariables
> = gql`
  query SandboxCommentThread($sandboxId: ID!, $commentThreadId: ID!) {
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
        ...CommentThread
      }
    }
    ${commentThreadFragment}
  }
`;
