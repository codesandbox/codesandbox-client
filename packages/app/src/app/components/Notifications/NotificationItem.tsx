import React from 'react';
import {
  Stack,
  Element,
  Text,
  ListAction,
  isMenuClicked,
} from '@codesandbox/components';
import { shortDistance } from '@codesandbox/common/lib/utils/short-distance';
import { useActions } from 'app/overmind';
import { formatDistanceStrict } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Menu } from './Menu';

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
  const { updateReadStatus } = useActions().userNotifications;

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
        padding: '8px 16px',

        '.notification-menu': {
          display: 'none',
        },
        '&:hover': {
          backgroundColor: '#525252',

          '.timestamp': {
            display: 'none',
          },

          '.notification-menu': {
            display: 'block',
          },
        },
      }}
    >
      <Stack gap={4} align="flex-start" css={{ opacity: read ? 0.7 : 1 }}>
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
        <Text size={3} color="#e5e5e5">
          {children}
        </Text>
      </Stack>

      <Menu read={read} id={id} />

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
