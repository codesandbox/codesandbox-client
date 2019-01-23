import gql from 'graphql-tag';

export const CLEAR_NOTIFICATION_MUTATION = gql`
  mutation ClearNotificationCount {
    clearNotificationCount {
      id
    }
  }
`;
