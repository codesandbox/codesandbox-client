import React from 'react';
import { useAppState, useActions } from 'app/overmind';
import { Stack, Menu } from '@codesandbox/components';

export const Filters = () => {
  const { userNotifications } = useAppState();
  const {
    userNotifications: { markAllNotificationsAsRead, archiveAllNotifications },
    preferences: { openPreferencesModal },
  } = useActions();

  return (
    <Stack gap={2}>
      <Menu>
        <Menu.IconButton
          className="icon-button"
          variant="square"
          title="More options"
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
