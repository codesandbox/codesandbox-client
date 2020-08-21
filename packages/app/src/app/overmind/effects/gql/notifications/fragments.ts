import { gql } from 'overmind-graphql';

export const recentNotificationFragment = gql`
  fragment RecentNotification on Notification {
    id
    type
    data
    insertedAt
    read
  }
`;
