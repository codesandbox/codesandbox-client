import React from 'react';
import {
  Stack,
  Element,
  Text,
  ListAction,
  isMenuClicked,
  Icon,
  Button,
} from '@codesandbox/components';
import { shortDistance } from '@codesandbox/common/lib/utils/short-distance';
import { useActions } from 'app/overmind';
import { formatDistanceStrict } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

type NotificationItemProps = {
  id: string;
  avatarUrl: string;
  avatarName: string;
  onClick?: () => void;
  insertedAt: string;
  read: boolean;
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  avatarUrl,
  avatarName,
  onClick,
  read,
  insertedAt,
  children,
}) => {
  const {
    updateReadStatus,
    archiveNotification,
  } = useActions().userNotifications;

  return (
    <ListAction
      onClick={async event => {
        if (isMenuClicked(event)) return;
        if (!read) {
          await updateReadStatus(id);
        }
        if (onClick) {
          onClick();
        }
      }}
      css={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px',
        scrollbarGutter: 'stable',
        padding: '8px 10px 8px 16px', // 10px to take the scroll into account
        transition: 'background-color 125ms ease-in-out',

        '.clear-notification': {
          display: 'none',
        },
        '&:hover, &:focus-visible': {
          backgroundColor: '#525252',

          '.dot': {
            borderColor: '#525252',
          },

          '.timestamp': {
            display: 'none',
          },

          '.clear-notification': {
            display: 'block',
            animation: 'fadeAnimation',
          },
        },
      }}
    >
      <Stack gap={4} align="flex-start" css={{ opacity: read ? 0.7 : 1 }}>
        <Element css={{ position: 'relative' }}>
          <Element
            as="img"
            src={avatarUrl}
            alt={avatarName}
            css={{
              width: '32px',
              height: '32px',
              display: 'block',
              borderRadius: '4px',
            }}
          />

          {!read && (
            <Element
              className="dot"
              css={{
                position: 'absolute',
                bottom: -5,
                right: -6,
                background: '#DFF976',
                height: 12,
                width: 12,
                transition: 'border-color 125ms ease-in-out',
                border: '2px solid #333333',
                borderRadius: '50%',
              }}
            />
          )}
        </Element>
        <Text size={3} color="#e5e5e5">
          {children}
        </Text>
      </Stack>

      <Button
        css={{ width: 24, height: 24, padding: 6 }}
        className="clear-notification"
        title="Clear notification"
        variant="ghost"
        onClick={() => archiveNotification(id)}
      >
        <Icon name="cross" size={12} />
      </Button>

      <Text
        className="timestamp"
        css={{ minWidth: 24 }}
        size={3}
        align="center"
      >
        {shortDistance(
          formatDistanceStrict(
            zonedTimeToUtc(insertedAt, 'Etc/UTC'),
            new Date()
          )
        )}
      </Text>
    </ListAction>
  );
};
