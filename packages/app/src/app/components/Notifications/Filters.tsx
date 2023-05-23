import React from 'react';
import { useAppState, useActions } from 'app/overmind';
import { Stack, Menu, Checkbox } from '@codesandbox/components';
import css from '@styled-system/css';

export const Filters = () => {
  const { userNotifications } = useAppState();
  const {
    filterNotifications,
    markAllNotificationsAsRead,
    archiveAllNotifications,
  } = useActions().userNotifications;

  const options = {
    team_invite: 'Team Invite',
    team_accepted: 'Team Accepted',
    pull_request_review_requested: 'PR Review Requests',
    sandbox_invitation: 'Sandbox Invites',
  };

  const iconColor =
    userNotifications.activeFilters.length > 0
      ? 'button.background'
      : 'inherit';

  return (
    <Stack gap={2}>
      <Menu>
        <Menu.IconButton
          className="icon-button"
          name="filter"
          title="Filter Notifications"
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
          {!userNotifications.notifications.every(
            notification => notification.read
          ) ? (
            <Menu.Item
              onSelect={() => {
                markAllNotificationsAsRead();
              }}
            >
              Mark all notifications as read
            </Menu.Item>
          ) : null}
        </Menu.List>
      </Menu>
    </Stack>
  );
};
