import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import TeamInvite from './notifications/TeamInvite';

import {
  Container,
  NoNotifications,
  NotificationsContainer,
  Loading,
  Title,
} from './elements';

const VIEW_QUERY = gql`
  {
    me {
      notifications {
        id
        type
        data
        read
      }
    }
  }
`;

const getNotificationComponent = (type, data, unread) => {
  const parsedData = JSON.parse(data);

  if (type === 'team_invite') {
    return (
      <TeamInvite
        unread={unread}
        teamId={parsedData.team_id}
        teamName={parsedData.team_name}
        userId={parsedData.user_id}
        inviterName={parsedData.inviter_name}
        inviterAvatar={parsedData.inviter_avatar}
      />
    );
  }
};

export default style => (
  <Container style={style}>
    <Title>Notifications</Title>
    <NotificationsContainer>
      <Query query={VIEW_QUERY}>
        {({ loading, error, data }) => {
          if (error) {
            return (
              <NoNotifications>
                Something went wrong while fetching notifications
              </NoNotifications>
            );
          }

          if (loading) {
            return <Loading>Loading Notifications...</Loading>;
          }

          if (data.me.notifications.length === 0) {
            return (
              <NoNotifications>
                You don{"'"}t have any notifications
              </NoNotifications>
            );
          }

          return (
            <div>
              {data.me.notifications.map((notification, i) => (
                /* eslint-disable react/no-array-index-key */
                <div key={i}>
                  {getNotificationComponent(
                    notification.type,
                    notification.data,
                    notification.read
                  )}
                </div>
              ))}
            </div>
          );
        }}
      </Query>
    </NotificationsContainer>
  </Container>
);
