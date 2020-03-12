import gql from 'graphql-tag';
import { Query } from 'overmind-graphql';

export const commentReplies: Query<any, any> = gql`
  query SandboxCommentReplies($sandboxId: ID!, $commentThreadId: ID!) {
    sandbox(sandboxId: $sandboxId) {
      commentThread(commentThreadId: $commentThreadId) {
        id
        comments {
          content
          id
          insertedAt
          updatedAt
          user {
            id
            username
            avatarUrl
          }
        }
      }
    }
  }
`;

export const commentThreads: Query<any, any> = gql`
  query SandboxCommentThreads($sandboxId: ID!) {
    sandbox(sandboxId: $sandboxId) {
      commentThreads {
        id
        initialComment {
          content
          id
          insertedAt
          updatedAt
          user {
            id
            username
            avatarUrl
          }
        }
        insertedAt
        isResolved
        updatedAt
      }
    }
  }
`;
