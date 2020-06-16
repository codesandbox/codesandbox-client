import React, { FunctionComponent, useState } from 'react';
import { formatDistanceStrict } from 'date-fns';
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
import { TeamIcon } from './Icons';
import { Menu } from './Menu';

type Props = {
  id: string;
  read: boolean;
  teamId: string;
  teamName: string;
  inviterName: string;
  inviterAvatar: string;
  insertedAt: string;
};
export const TeamInvite: FunctionComponent<Props> = ({
  id,
  read,
  teamId,
  teamName,
  inviterName,
  inviterAvatar,
  insertedAt,
}) => {
  const {
    actions: { userNotifications },
  } = useOvermind();
  const [hover, setHover] = useState(false);

  const onClick = async () => {
    if (isMenuClicked(event) || read) return;
    await userNotifications.openTeamAcceptModal({
      teamName,
      teamId,
      userAvatar: inviterName,
    });

    userNotifications.markNotificationAsRead(id);
  };
  return (
    <ListAction
      onClick={onClick}
      key={teamId}
      css={css({ padding: 0 })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
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
                src={inviterAvatar}
                alt={inviterName}
                css={css({ width: 32, height: 32, display: 'block' })}
              />
              <TeamIcon
                read={read}
                css={css({
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                })}
              />
            </Element>

            <Text size={3} variant="muted">
              {inviterName} <Text css={css({ color: 'white' })}>invites</Text>{' '}
              you to join team {teamName}
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
