import React, { useState } from 'react';
import css from '@styled-system/css';
import {
  Stack,
  Element,
  Text,
  ListAction,
  isMenuClicked,
} from '@codesandbox/components';
import { shortDistance } from '@codesandbox/common/lib/utils/short-distance';
import { teamSettingsUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useActions } from 'app/overmind';
import { formatDistanceStrict } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Menu } from './Menu';
import { InvitationIcon } from './Icons';

interface ITeamInviteRequestProps {
  id: string;
  insertedAt: string;
  read: boolean;
  requesterAvatar: string | null;
  requesterEmail: string;
  requesterName: string;
  teamId: string;
  teamName: string;
}

export const TeamInviteRequest = ({
  id,
  insertedAt,
  read,
  requesterAvatar,
  requesterEmail,
  requesterName,
  teamId,
  teamName,
}: ITeamInviteRequestProps) => {
  const {
    userNotifications: { updateReadStatus },
    setActiveTeam,
  } = useActions();
  const [hover, setHover] = useState(false);
  const history = useHistory();

  return (
    <ListAction
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={async event => {
        if (isMenuClicked(event)) return;
        if (!read) {
          await updateReadStatus(id);
        }
        setActiveTeam({ id: teamId });
        history.push(teamSettingsUrl() + `?invite_email=${requesterEmail}`);
      }}
      key={id}
      css={css({ padding: 0 })}
    >
      <Element
        css={css({
          opacity: read ? 0.6 : 1,
          textDecoration: 'none',
          color: 'inherit',
        })}
      >
        <Stack align="center" gap={2} padding={4}>
          <Stack gap={4} align="flex-start">
            <Element css={css({ position: 'relative' })}>
              <Element
                as="img"
                src={requesterAvatar}
                alt={requesterName}
                css={css({
                  width: 32,
                  height: 32,
                  display: 'block',
                  borderRadius: 'small',
                })}
              />
              <InvitationIcon
                read={read}
                css={css({
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                })}
              />
            </Element>
            <Text size={3} variant="muted">
              {requesterName}{' '}
              <Text css={css({ color: 'sideBar.foreground' })}>
                requested to join your team {teamName}
              </Text>
            </Text>
          </Stack>
          <Stack
            css={css({ width: 70, flexShrink: 0, justifyContent: 'flex-end' })}
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
