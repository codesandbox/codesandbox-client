import gql from 'graphql-tag';
import { Query } from 'overmind-graphql';

import {
  CommentResponse,
  CommentVariables,
  CommentsResponse,
  CommentsVariables,
} from './types';

export const allComments: Query<CommentsResponse, CommentsVariables> = gql`
  query Comments($sandboxId: String!) {
    comments(sandboxId: $sandboxId) {
      id
      isResolved
      originalMessage {
        id
        content
        author {
          id
          avatarUrl
          username
        }
      }
      replies {
        id
        content
        author {
          avatarUrl
          username
        }
      }
      insertedAt
      updatedAt
      metadata
    }
  }
`;

export const comment: Query<CommentResponse, CommentVariables> = gql`
  query Comment($sandboxId: String!, $id: String!) {
    comment(sandboxId: $sandboxId, id: $id) {
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
        content
        author {
          avatarUrl
          username
        }
      }
      insertedAt
      updatedAt
      metadata
    }
  }
`;
