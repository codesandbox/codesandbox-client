import React from 'react';
import { Menu as BaseMenu } from '@codesandbox/components';
import css from '@styled-system/css';
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
        css={css({
          width: 70,
          display: 'flex',
          justifyContent: 'flex-end',
          svg: { transform: 'rotate(90deg)' },
        })}
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
