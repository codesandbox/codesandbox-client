import React from 'react';
import { Menu as BaseMenu, Element } from '@codesandbox/components';
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
      <Element
        css={css({
          '.icon-button:hover': {
            backgroundColor: 'grays.500',
          },
        })}
      >
        <BaseMenu.IconButton
          className="icon-button"
          name="more"
          title="Notification actions"
          size={12}
          css={css({
            display: 'flex',
            justifyContent: 'flex-end',
            transition: 'all 100ms ease',
            svg: { transform: 'rotate(90deg) translateY(50%)' },
          })}
        />
      </Element>
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
