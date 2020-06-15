import { useOvermind } from 'app/overmind';
import React, { useEffect } from 'react';
import { Element, Stack, Text, List } from '@codesandbox/components';
import css from '@styled-system/css';
import { Skeleton } from './Skeleton';

import { SandboxInvitation } from './notifications/SandboxInvitation';
import { TeamAccepted } from './notifications/TeamAccepted';
import { TeamInvite } from './notifications/TeamInvite';

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
  const {
    state: { userNotifications },
    actions,
  } = useOvermind();

  useEffect(() => {
    actions.userNotifications.getNotifications();
  }, [actions.userNotifications]);

  const getContent = () => {
    if (!userNotifications.notifications) {
      return <Skeleton />;
    }

    if (userNotifications.notifications.length === 0) {
      return <Text padding={4}>You don{"'"}t have any notifications</Text>;
    }

    return userNotifications.notifications.map(notification =>
      getNotificationComponent(
        notification.type,
        notification.data,
        notification.read
      )
    );
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
      <List css={css({ maxHeight: 400, overflow: 'auto' })}>
        {getContent()}
      </List>
    </Element>
  );
};
