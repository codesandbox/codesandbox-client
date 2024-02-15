import React from 'react';
import { Menu as BaseMenu, Icon } from '@codesandbox/components';
import { useActions } from 'app/overmind';

export const Menu = ({ read, id }) => {
  const {
    updateReadStatus,
    archiveNotification,
  } = useActions().userNotifications;

  return (
    <BaseMenu>
      <BaseMenu.Button
        css={{ width: 24, height: 24, padding: 4 }}
        className="notification-menu"
        title="Notification actions"
      >
        <Icon name="more" size={16} />
      </BaseMenu.Button>
      <BaseMenu.List>
        <BaseMenu.Item
          className="no-click"
          onSelect={() => archiveNotification(id)}
        >
          Clear notification
        </BaseMenu.Item>
        <BaseMenu.Item
          className="no-click"
          onSelect={() => updateReadStatus(id)}
        >
          Mark as {read ? 'Unread' : 'Read'}
        </BaseMenu.Item>
      </BaseMenu.List>
    </BaseMenu>
  );
};
