import { useOvermind } from 'app/overmind';
import React, { useEffect } from 'react';
import { Element, Text, List } from '@codesandbox/components';
import css from '@styled-system/css';
import { Skeleton } from './Skeleton';

import { SandboxInvitation } from './notifications/SandboxInvitation';
import { TeamAccepted } from './notifications/TeamAccepted';
import { TeamInvite } from './notifications/TeamInvite';
import { Filters } from './Filters';

const getNotificationComponent = ({ id, type, data, read, insertedAt }) => {
  const parsedData = JSON.parse(data);

  if (type === 'team_invite') {
    return (
      <TeamInvite
        insertedAt={insertedAt}
        id={id}
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
        insertedAt={insertedAt}
        id={id}
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
        insertedAt={insertedAt}
        id={id}
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

export const NotificationsContent = props => {
  const {
    state: { userNotifications },
    actions: {
      userNotifications: { getNotifications },
    },
  } = useOvermind();

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  const getContent = () => {
    if (!userNotifications.notifications) {
      return <Skeleton />;
    }

    if (userNotifications.notifications.length === 0) {
      return (
        <Element padding={6}>
          {userNotifications.activeFilters.length ? (
            <Text align="center">No notifications match your search</Text>
          ) : (
            <Text align="center">You don{"'"}t have any notifications</Text>
          )}
        </Element>
      );
    }

    return userNotifications.notifications.map(notification =>
      getNotificationComponent(notification)
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
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'sideBar.border',
        boxShadow: 2,
        borderRadius: 'medium',
      })}
      {...props}
    >
      <Element
        padding={4}
        css={css({
          display: 'grid',
          gridTemplateColumns: '1fr 70px',
          borderWidth: 0,
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: 'sideBar.border',
        })}
      >
        <Text weight="bold">Notifications</Text>
        <Element>
          {userNotifications.notifications ? <Filters /> : null}
        </Element>
      </Element>
      <List css={css({ maxHeight: 400, overflow: 'auto' })}>
        {getContent()}
      </List>
    </Element>
  );
};
