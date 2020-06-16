import React, { useState } from 'react';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { zonedTimeToUtc } from 'date-fns-tz';
import css from '@styled-system/css';
import {
  Stack,
  Element,
  Text,
  ListAction,
  isMenuClicked,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { AcceptedIcon } from './Icons';
import { Menu } from './Menu';

interface Props {
  insertedAt: string;
  id: string;
  read: boolean;
  teamName: string;
  userName: string;
  userAvatar: string;
}

export const TeamAccepted = ({
  insertedAt,
  id,
  read,
  teamName,
  userName,
  userAvatar,
}: Props) => {
  const {
    actions: {
      userNotifications: { markNotificationAsRead },
    },
  } = useOvermind();
  const [hover, setHover] = useState(false);
  return (
    <ListAction
      key={teamName}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        if (isMenuClicked(event)) return;
        markNotificationAsRead(id);
      }}
      css={css({ padding: 0 })}
    >
      <Element
        css={css({
          opacity: read ? 0.4 : 1,
        })}
      >
        <Stack align="center" gap={2} padding={4}>
          <Stack gap={4}>
            <Element css={css({ position: 'relative' })}>
              <Element
                as="img"
                src={userAvatar}
                alt={userName}
                css={css({ width: 32, height: 32, display: 'block' })}
              />
              <AcceptedIcon
                read={read}
                css={css({
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                })}
              />
            </Element>

            <Text size={3} variant="muted">
              {userName} <Text css={css({ color: 'white' })}>accepted</Text>{' '}
              your invitation to join {teamName}!
            </Text>
          </Stack>
          {hover ? (
            <Menu read={read} id={id} />
          ) : (
            <Text size={1} align="right" block css={css({ width: 70 })}>
              {formatDistanceStrict(
                zonedTimeToUtc(insertedAt, 'Etc/UTC'),
                new Date()
              )}
            </Text>
          )}
        </Stack>
      </Element>
    </ListAction>
  );
};
