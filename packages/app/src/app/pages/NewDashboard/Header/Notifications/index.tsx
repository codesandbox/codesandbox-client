import { useOvermind } from 'app/overmind';
import React, { useEffect } from 'react';
import {
  Element,
  Stack,
  Text,
  List,
  Menu,
  Checkbox,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { Skeleton } from './Skeleton';

import { SandboxInvitation } from './notifications/SandboxInvitation';
import { TeamAccepted } from './notifications/TeamAccepted';
import { TeamInvite } from './notifications/TeamInvite';

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

export const Notifications = props => {
  const {
    state: { userNotifications },
    actions: {
      userNotifications: {
        filterNotifications,
        getNotifications,
        markAllNotificationsAsRead,
        archiveAllNotifications,
      },
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
          <Text align="center">You don{"'"}t have any notifications</Text>
        </Element>
      );
    }

    return userNotifications.notifications.map(notification =>
      getNotificationComponent(notification)
    );
  };

  const options = {
    team_invite: 'Team Invite',
    team_accepted: 'Team Accepted',
    sandbox_invitation: 'Sandbox Invites',
  };
  const iconColor =
    userNotifications.activeFilters.length > 0
      ? 'button.background'
      : 'inherit';

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
        boxShadow: 1,
        borderRadius: 'medium',
      })}
      {...props}
    >
      <Stack
        padding={4}
        align="center"
        justify="space-between"
        css={css({
          borderWidth: 0,
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: 'sideBar.border',
        })}
      >
        <Text>Notifications</Text>
        <Stack gap={2}>
          <Menu>
            <Menu.IconButton
              className="icon-button"
              name="filter"
              title="Filter comments"
              size={12}
              css={css({
                color: iconColor,
                ':hover:not(:disabled)': {
                  color: iconColor,
                },
                ':focus:not(:disabled)': {
                  color: iconColor,
                  backgroundColor: 'transparent',
                },
              })}
            />
            <Menu.List>
              {Object.entries(options).map(([key, label]) => (
                <Menu.Item key={key} onSelect={() => filterNotifications(key)}>
                  <Checkbox
                    checked={userNotifications.activeFilters.includes(key)}
                    label={label}
                  />
                </Menu.Item>
              ))}
            </Menu.List>
          </Menu>
          <Menu>
            <Menu.IconButton
              className="icon-button"
              name="more"
              title="Notification actions"
              size={12}
            />
            <Menu.List>
              <Menu.Item onSelect={() => archiveAllNotifications()}>
                Clear all notifications
              </Menu.Item>
              <Menu.Item
                onSelect={() => {
                  markAllNotificationsAsRead();
                }}
              >
                Mark all notifications as read
              </Menu.Item>
            </Menu.List>
          </Menu>
        </Stack>
      </Stack>
      <List css={css({ maxHeight: 400, overflow: 'auto' })}>
        {getContent()}
      </List>
    </Element>
  );
};
