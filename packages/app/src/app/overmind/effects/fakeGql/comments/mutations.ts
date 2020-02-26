import gql from 'graphql-tag';
import { Query } from 'overmind-graphql';

export const addComment: Query<any> = gql`
  mutation AddComment(
    $sandboxId: String!
    $comment: String!
    $username: String!
  ) {
    addComment(sandboxId: $sandboxId, comment: $comment, username: $username) {
      id
      originalMessage {
        content
      }
    }
  }
`;
