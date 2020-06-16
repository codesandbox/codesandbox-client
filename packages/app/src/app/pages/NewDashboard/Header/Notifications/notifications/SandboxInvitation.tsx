import React, { useState } from 'react';
import css from '@styled-system/css';
import {
  Stack,
  Element,
  Text,
  ListAction,
  isMenuClicked,
} from '@codesandbox/components';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Authorization } from 'app/graphql/types';
import { useOvermind } from 'app/overmind';
import { formatDistanceStrict } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Menu } from './Menu';
import { InvitationIcon } from './Icons';

interface ISandboxInvitationProps {
  insertedAt: string;
  id: string;
  read: boolean;
  inviterAvatar: string;
  inviterName: string;
  sandboxId: string;
  sandboxAlias: string | null;
  sandboxTitle: string | null;
  authorization: Authorization;
}

export const SandboxInvitation = ({
  id,
  read,
  inviterAvatar,
  inviterName,
  sandboxId,
  sandboxAlias,
  sandboxTitle,
  authorization,
  insertedAt,
}: ISandboxInvitationProps) => {
  const {
    actions: {
      userNotifications: { markNotificationAsRead },
    },
  } = useOvermind();
  const [hover, setHover] = useState(false);
  const niceSandboxTitle = sandboxTitle || sandboxAlias || sandboxId;
  let nicePermissionName = 'view';
  if (authorization === Authorization.Comment) {
    nicePermissionName = 'comment on';
  } else if (authorization === Authorization.WriteCode) {
    nicePermissionName = 'edit';
  }

  return (
    <ListAction
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={event => {
        if (isMenuClicked(event)) return;
        markNotificationAsRead(id);
        window.location.href = sandboxUrl({
          id: sandboxId,
          alias: sandboxAlias,
        });
      }}
      key={sandboxId}
      css={css({ padding: 0 })}
    >
      <Element
        css={css({
          opacity: read ? 0.4 : 1,
          textDecoration: 'none',
          color: 'inherit',
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
              {inviterName} <Text css={css({ color: 'white' })}>invited</Text>{' '}
              you to {nicePermissionName} {niceSandboxTitle}
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
