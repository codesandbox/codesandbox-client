import React from 'react';
import { Link } from 'react-router-dom';
import css from '@styled-system/css';
import { Stack, Element, Text, ListAction } from '@codesandbox/components';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Authorization } from 'app/graphql/types';
import { useOvermind } from 'app/overmind';

interface ISandboxInvitationProps {
  id: string;
  read: boolean;
  inviterAvatar: string;
  inviterName: string;
  sandboxId: string;
  sandboxAlias: string | null;
  sandboxTitle: string | null;
  authorization: Authorization;
}

const Icon = ({ read, ...props }) => (
  <Stack
    align="center"
    justify="center"
    css={css({
      borderRadius: '50%',
      width: 18,
      height: 18,
      background:
        ' linear-gradient(225deg, rgba(0, 0, 0, 0) 13.89%, rgba(0, 0, 0, 0.2) 83.33%), #343434',
    })}
    {...props}
  >
    <svg width={14} height={14} fill="none" viewBox="0 0 14 14">
      <path
        fill={read ? '#C4C4C4' : '#fff'}
        fillRule="evenodd"
        d="M5.037 2.654c.012.02.023.04.032.061 1.462-.472 3.145.182 3.99 1.645l.697 1.208 2.406 1.418c.46.271.483.942.04 1.197l-3.548 2.05-3.55 2.048c-.442.256-1.011-.099-1.016-.633l-.025-2.793-.698-1.208c-.844-1.463-.569-3.248.571-4.278a.752.752 0 01-.037-.058c-.193-.334-.094-.751.22-.933.315-.181.726-.058.918.276zM7.62 12.44c-.421.244-.93.213-1.335-.034l1.973-1.14c.011.476-.216.931-.638 1.174z"
        clipRule="evenodd"
      />
    </svg>
  </Stack>
);

export const SandboxInvitation = ({
  id,
  read,
  inviterAvatar,
  inviterName,
  sandboxId,
  sandboxAlias,
  sandboxTitle,
  authorization,
}: ISandboxInvitationProps) => {
  const {
    actions: {
      userNotifications: { markNotificationAsRead },
    },
  } = useOvermind();
  const niceSandboxTitle = sandboxTitle || sandboxAlias || sandboxId;
  let nicePermissionName = 'view';
  if (authorization === Authorization.Comment) {
    nicePermissionName = 'comment on';
  } else if (authorization === Authorization.WriteCode) {
    nicePermissionName = 'edit';
  }

  return (
    <ListAction
      onClick={() => markNotificationAsRead(id)}
      key={sandboxId}
      css={css({ padding: 0 })}
    >
      <Element
        as={Link}
        to={sandboxUrl({ id: sandboxId, alias: sandboxAlias })}
        css={css({
          opacity: read ? 0.4 : 1,
          textDecoration: 'none',
          color: 'inherit',
        })}
      >
        <Stack align="center" gap={4} padding={4}>
          <Element css={css({ position: 'relative' })}>
            <Element
              as="img"
              src={inviterAvatar}
              alt={inviterName}
              css={css({ width: 32, height: 32, display: 'block' })}
            />
            <Icon
              read={read}
              css={css({ position: 'absolute', bottom: '-4px', right: '-4px' })}
            />
          </Element>

          <Text size={3} variant="muted">
            {inviterName} <Text css={css({ color: 'white' })}>invited</Text> you
            to {nicePermissionName} {niceSandboxTitle}
          </Text>
        </Stack>
      </Element>
    </ListAction>
  );
};
