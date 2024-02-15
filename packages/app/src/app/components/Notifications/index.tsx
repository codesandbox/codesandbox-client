import React from 'react';

import { useAppState, useActions } from 'app/overmind';

import { Button, Icon, Element, Stack, Tooltip } from '@codesandbox/components';
import css from '@styled-system/css';
import { Overlay } from 'app/components/Overlay';
import { NotificationsContent } from './Content';

export const Notifications = ({ dashboard }: { dashboard?: boolean }) => {
  const {
    notificationsOpened: notificationsMenuOpened,
    unreadCount,
  } = useAppState().userNotifications;
  const {
    notificationsClosed,
    notificationsOpened,
  } = useActions().userNotifications;

  const label = unreadCount === 1 ? 'message' : 'messages';

  return (
    <Overlay
      content={NotificationsContent}
      event="Notifications"
      isOpen={notificationsMenuOpened}
      onClose={notificationsClosed}
      onOpen={notificationsOpened}
      width={321}
    >
      {open => (
        <Tooltip
          label={
            unreadCount > 0 ? `${unreadCount} new ${label}` : 'No new messages'
          }
        >
          <Button
            variant={dashboard ? 'ghost' : 'secondary'}
            css={css({
              ':hover .border-for-bell': {
                background: theme =>
                  theme.colors.secondaryButton.hoverBackground,
              },
            })}
            onClick={open}
          >
            <Element css={{ position: 'relative' }}>
              <Icon name="bell" size={16} title="Notifications" />
              {unreadCount > 0 ? (
                <Element
                  css={css({
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#E4FC82',
                    position: 'absolute',
                    zIndex: 10,
                    color: '#000',
                    top: '-3px',
                    right: '-6px',
                  })}
                />
              ) : null}
            </Element>
          </Button>
        </Tooltip>
      )}
    </Overlay>
  );
};
