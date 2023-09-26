import React from 'react';

import { useAppState, useActions } from 'app/overmind';

import { Button, Icon, Element, Stack } from '@codesandbox/components';
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
        <Button
          variant={dashboard ? 'ghost' : 'secondary'}
          css={css({
            ':hover .border-for-bell': {
              background: theme => theme.colors.secondaryButton.hoverBackground,
            },
          })}
          onClick={open}
        >
          <Stack>
            <Icon name="bell" size={16} title="Notifications" />
            {unreadCount > 0 ? (
              <Element
                css={css({
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: '9999px',
                  backgroundColor: '#E63838',
                  position: 'relative',
                  top: '0px',
                  right: '0px',
                  zIndex: 10,
                  fontSize: '12px',
                  fontWeight: '500',
                  lineHeight: '16px',
                  color: '#ffffff',
                  marginLeft: '-6px',
                  paddingX: '4px',
                })}
              >
                {unreadCount}
              </Element>
            ) : null}
          </Stack>
        </Button>
      )}
    </Overlay>
  );
};
