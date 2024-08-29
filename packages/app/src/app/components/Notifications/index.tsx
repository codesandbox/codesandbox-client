import React from 'react';

import { useAppState, useActions } from 'app/overmind';

import { Button, Icon, Element, Tooltip } from '@codesandbox/components';
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
            variant="secondary"
            css={{ position: 'relative', width: '28px' }}
            onClick={open}
          >
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
                  top: '2px',
                  right: '2px',
                })}
              />
            ) : null}
          </Button>
        </Tooltip>
      )}
    </Overlay>
  );
};
