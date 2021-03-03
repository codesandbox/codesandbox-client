import React, { FunctionComponent, useState } from 'react';
import { formatDistanceStrict } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import css from '@styled-system/css';
import { shortDistance } from '@codesandbox/common/lib/utils/short-distance';
import {
  Stack,
  Element,
  Text,
  ListAction,
  isMenuClicked,
} from '@codesandbox/components';
import { useActions } from 'app/overmind';
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
  const { userNotifications } = useActions();
  const [hover, setHover] = useState(false);

  const onClick = async () => {
    if (isMenuClicked(event)) return;
    await userNotifications.openTeamAcceptModal({
      teamName,
      teamId,
      userAvatar: inviterName,
    });
    if (!read) {
      await userNotifications.updateReadStatus(id);
    }
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
          <Stack gap={4} align="flex-start">
            <Element css={css({ position: 'relative' })}>
              <Element
                as="img"
                src={inviterAvatar}
                alt={inviterName}
                css={css({
                  width: 32,
                  height: 32,
                  display: 'block',
                  borderRadius: 'small',
                })}
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
              {inviterName}{' '}
              <Text css={css({ color: 'sideBar.foreground' })}>invites</Text>{' '}
              you to join team {teamName}
            </Text>
          </Stack>
          <Stack
            css={css({
              width: 70,
              flexShrink: 0,
              justifyContent: 'flex-end',
            })}
          >
            {hover ? (
              <Menu read={read} id={id} />
            ) : (
              <Text
                size={2}
                align="right"
                block
                css={css({ color: 'sideBar.foreground' })}
              >
                {shortDistance(
                  formatDistanceStrict(
                    zonedTimeToUtc(insertedAt, 'Etc/UTC'),
                    new Date()
                  )
                )}
              </Text>
            )}
          </Stack>
        </Stack>
      </Element>
    </ListAction>
  );
};
