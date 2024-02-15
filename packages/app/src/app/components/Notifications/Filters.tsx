import React from 'react';
import { useAppState, useActions } from 'app/overmind';
import { Stack, Menu, Checkbox, Icon } from '@codesandbox/components';
import css from '@styled-system/css';

export const Filters = () => {
  const { userNotifications } = useAppState();
  const {
    userNotifications: {
      filterNotifications,
      markAllNotificationsAsRead,
      archiveAllNotifications,
    },
    preferences: { openPreferencesModal },
  } = useActions();

  const options = {
    team_invite: 'Team Invite',
    team_accepted: 'Team Accepted',
    pull_request_review_received: 'PR Reviews',
    pull_request_review_requested: 'PR Review Requests',
    sandbox_invitation: 'Sandbox Invites',
  };

  return (
    <Stack gap={2}>
      <Menu>
        <Menu.IconButton
          className="icon-button"
          variant="square"
          title="Filter notifications"
          css={{
            color:
              userNotifications.activeFilters.length > 0
                ? '#EDFFA5'
                : '#e5e5e5',
          }}
          name="filter"
          size={16}
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
          variant="square"
          title="Notification actions"
          size={16}
          name="more"
        />
        <Menu.List>
          <Menu.Item onSelect={() => openPreferencesModal('notifications')}>
            Manage notification preferences
          </Menu.Item>
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
