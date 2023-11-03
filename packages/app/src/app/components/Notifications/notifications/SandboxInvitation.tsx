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
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Authorization } from 'app/graphql/types';
import { useActions } from 'app/overmind';
import { formatDistanceStrict } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useGlobalPersistedState } from 'app/hooks/usePersistedState';
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
  const { updateReadStatus } = useActions().userNotifications;
  const [hover, setHover] = useState(false);
  const history = useHistory();
  const [hasBetaEditorExperiment] = useGlobalPersistedState(
    'BETA_SANDBOX_EDITOR',
    false
  );
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
      onClick={async event => {
        if (isMenuClicked(event)) return;
        if (!read) {
          await updateReadStatus(id);
        }
        history.push(
          sandboxUrl(
            {
              id: sandboxId,
              alias: sandboxAlias,
            },
            hasBetaEditorExperiment
          )
        );
      }}
      key={sandboxId}
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
                src={inviterAvatar}
                alt={inviterName}
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
              {inviterName}{' '}
              <Text css={css({ color: 'sideBar.foreground' })}>invited</Text>{' '}
              you to {nicePermissionName} {niceSandboxTitle}
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
