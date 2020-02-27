import gql from 'graphql-tag';
import { Query } from 'overmind-graphql';

export const addComment: Query<any, any> = gql`
  mutation AddComment(
    $sandboxId: String!
    $comment: String!
    $username: String!
  ) {
    addComment(sandboxId: $sandboxId, comment: $comment, username: $username) {
      id
      isResolved
      originalMessage {
        id
        content
        author {
          avatarUrl
          username
        }
      }
      replies {
        id
      }
      insertedAt
      updatedAt
    }
  }
`;

export const deleteComment: Query<any, any> = gql`
  mutation DeleteComment($id: String!) {
    deleteComment(id: $id) {
      id
    }
  }
`;
