import gql from 'graphql-tag';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  Element,
  Stack,
  Text,
  List,
  ListAction,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { File as NotificationSkeleton } from 'app/pages/Sandbox/Editor/Skeleton';

import { SandboxInvitation } from './notifications/SandboxInvitation';
import { TeamAccepted } from './notifications/TeamAccepted';
import { TeamInvite } from './notifications/TeamInvite';

export const VIEW_QUERY = gql`
  query RecentNotifications {
    me {
      notifications(
        limit: 20
        orderBy: { field: "insertedAt", direction: ASC }
      ) {
        id
        type
        data
        read
      }
    }
  }
`;

const getNotificationComponent = (type, data, read) => {
  const parsedData = JSON.parse(data);

  if (type === 'team_invite') {
    return (
      <TeamInvite
        read={read}
        teamId={parsedData.team_id}
        teamName={parsedData.team_name}
        inviterName={parsedData.inviter_name}
        inviterAvatar={parsedData.inviter_avatar}
      />
    );
  }
  if (type === 'team_accepted') {
    return (
      <TeamAccepted
        read={read}
        teamName={parsedData.team_name}
        userAvatar={parsedData.user_avatar}
        userName={parsedData.user_name}
      />
    );
  }
  if (type === 'sandbox_invitation') {
    return (
      <SandboxInvitation
        read={read}
        inviterAvatar={parsedData.inviter_avatar}
        inviterName={parsedData.inviter_name}
        sandboxId={parsedData.sandbox_id}
        sandboxAlias={parsedData.sandbox_alias}
        sandboxTitle={parsedData.sandbox_title}
        authorization={parsedData.authorization.toUpperCase()}
      />
    );
  }

  return <div />;
};

export const Notifications = props => {
  const { loading, error, data } = useQuery(VIEW_QUERY);

  const getContent = () => {
    if (error) {
      return (
        <Text padding={4}>
          Something went wrong while fetching notifications
        </Text>
      );
    }

    if (loading) {
      return (
        <>
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
        </>
      );
    }

    if (data.me.notifications.length === 0) {
      return <Text padding={4}>You don{"'"}t have any notifications</Text>;
    }

    return data.me.notifications.map(notification => (
      <ListAction key={notification.id}>
        {getNotificationComponent(
          notification.type,
          notification.data,
          notification.read
        )}
      </ListAction>
    ));
  };

  return (
    <Element
      css={css({
        backgroundColor: 'sideBar.background',
        fontFamily: 'Inter',
        zIndex: 10,
        width: 321,
        right: 10,
        fontSize: 3,
      })}
      {...props}
    >
      <Stack padding={4} align="center" justify="space-between">
        <Text>Notifications</Text>
      </Stack>
      <List css={css({ maxHeight: 500, overflow: 'auto' })}>
        {getContent()}
      </List>
    </Element>
  );
};
