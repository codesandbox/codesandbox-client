import React from 'react';
import { Menu as BaseMenu } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';

export const Menu = ({ read, id }) => {
  const {
    actions: {
      userNotifications: { markNotificationAsRead, archiveNotification },
    },
  } = useOvermind();
  return (
    <BaseMenu>
      <BaseMenu.IconButton
        className="icon-button"
        name="more"
        title="Notification actions"
        size={12}
      />
      <BaseMenu.List>
        <BaseMenu.Item
          className="no-click"
          onSelect={() => archiveNotification(id)}
        >
          Clear notification
        </BaseMenu.Item>
        {!read && (
          <BaseMenu.Item
            className="no-click"
            onSelect={() => markNotificationAsRead(id)}
          >
            Mark as Read
          </BaseMenu.Item>
        )}
      </BaseMenu.List>
    </BaseMenu>
  );
};
