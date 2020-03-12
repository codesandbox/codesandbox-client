import gql from 'graphql-tag';
import { Query } from 'overmind-graphql';

export const commentThreads: Query<any, any> = gql`
  query SandboxCommentThreads($sandboxId: ID!) {
    sandbox(sandboxId: $sandboxId) {
      commentThreads {
        id
        insertedAt
        isResolved
        updatedAt
      }
    }
  }
`;
