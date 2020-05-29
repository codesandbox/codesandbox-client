import {
  CommentAddedSubscription,
  CommentAddedSubscriptionVariables,
  CommentChangedSubscription,
  CommentChangedSubscriptionVariables,
  CommentRemovedSubscription,
  CommentRemovedSubscriptionVariables,
} from 'app/graphql/types';
import { gql, Query } from 'overmind-graphql';

import { commentFragment } from './fragments';

export const commentAdded: Query<
  CommentAddedSubscription,
  CommentAddedSubscriptionVariables
> = gql`
  subscription CommentAdded($sandboxId: ID!) {
    commentAdded(sandboxId: $sandboxId) {
      ...Comment
      sandbox {
        id
      }
    }
  }
  ${commentFragment}
`;

export const commentChanged: Query<
  CommentChangedSubscription,
  CommentChangedSubscriptionVariables
> = gql`
  subscription CommentChanged($sandboxId: ID!) {
    commentChanged(sandboxId: $sandboxId) {
      ...Comment
      sandbox {
        id
      }
    }
  }
  ${commentFragment}
`;

export const commentRemoved: Query<
  CommentRemovedSubscription,
  CommentRemovedSubscriptionVariables
> = gql`
  subscription CommentRemoved($sandboxId: ID!) {
    commentRemoved(sandboxId: $sandboxId) {
      ...Comment
      sandbox {
        id
      }
    }
  }
  ${commentFragment}
`;
