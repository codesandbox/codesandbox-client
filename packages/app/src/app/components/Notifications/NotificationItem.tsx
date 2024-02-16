import React from 'react';
import {
  Stack,
  Element,
  Text,
  ListAction,
  Icon,
  Button,
  Tooltip,
} from '@codesandbox/components';
import { shortDistance } from '@codesandbox/common/lib/utils/short-distance';
import { useActions } from 'app/overmind';
import { formatDistanceStrict } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { formatKey } from '@codesandbox/common/lib/utils/keybindings';

type NotificationItemProps = {
  id: string;
  avatarUrl: string;
  avatarName: string;
  insertedAt: string;
  read: boolean;
  url?: string;
  onClick?: () => void;
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  avatarUrl,
  avatarName,
  read,
  insertedAt,
  url,
  onClick,
  children,
}) => {
  const {
    updateReadStatus,
    archiveNotification,
  } = useActions().userNotifications;

  const handleOpenNotification = async (openInNewTab: boolean) => {
    if (!read) {
      await updateReadStatus(id);
    }

    if (!url && onClick) {
      onClick();
      return;
    }

    if (openInNewTab) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  };

  return (
    <ListAction
      onClick={ev => handleOpenNotification(ev.metaKey || ev.ctrlKey)}
      css={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px',
        scrollbarGutter: 'stable',
        padding: '8px 10px 8px 16px', // 10px to take the scroll into account
        minHeight: '64px',
        transition: 'background-color 125ms ease-in-out',

        '.notification-actions': {
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

          '.notification-actions': {
            display: 'flex',
          },
        },
      }}
    >
      <Stack
        gap={4}
        align="flex-start"
        css={{
          opacity: read ? 0.7 : 1,
        }}
      >
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

      <Stack direction="vertical" className="notification-actions">
        <Tooltip label={`Open in new tab (${formatKey('Meta')} + click)`}>
          <Button
            css={{ width: 24, height: 24, padding: 6 }}
            variant="ghost"
            onClick={ev => {
              ev.stopPropagation();
              handleOpenNotification(true);
            }}
          >
            <Icon name="external" size={12} />
          </Button>
        </Tooltip>
        <Tooltip label="Clear notification">
          <Button
            css={{ width: 24, height: 24, padding: 6 }}
            variant="ghost"
            onClick={ev => {
              ev.stopPropagation();
              archiveNotification(id);
            }}
          >
            <Icon name="cross" size={12} />
          </Button>
        </Tooltip>
      </Stack>

      <Text
        className="timestamp"
        css={{ minWidth: 24 }}
        size={3}
        color="#e5e5e5"
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
