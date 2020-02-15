import React from 'react';
import { useOvermind } from 'app/overmind';

import { UserMenu } from 'app/pages/common/UserMenu';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';

import { Stack, Avatar, Button } from '@codesandbox/components';
import css from '@styled-system/css';
import {
  ReloadIcon,
  PreferenceIcon,
  LikeIcon,
  EmbedIcon,
  ForkIcon,
} from './icons';
import { Collaborators } from './Collaborators';

const TooltipButton = ({ tooltip, ...props }) => (
  <Tooltip content={tooltip}>
    <Button {...props} />
  </Tooltip>
);

export const Actions = () => {
  const {
    actions: {
      modalOpened,
      editor: { likeSandboxToggled, forkSandboxClicked },
      explore: { pickSandboxModal },
    },
    state: {
      hasLogIn,
      updateStatus,
      user,
      editor: {
        currentSandbox: { id, owned, title, description, likeCount, userLiked },
      },
    },

    actions: { signInClicked },
  } = useOvermind();

  const handleSignIn = async () => {
    await signInClicked({ useExtraScopes: false });
  };

  let primaryAction;
  if (!hasLogIn) primaryAction = 'Sign in';
  else primaryAction = owned ? 'Embed' : 'Fork';

  return (
    <Stack align="center" gap={1} css={{ button: { width: 'auto' } }}>
      {updateStatus === 'available' && (
        <TooltipButton
          tooltip="Update Available! Click to Refresh."
          variant="link"
          onClick={() => document.location.reload()}
        >
          <ReloadIcon css={css({ height: 3 })} />
        </TooltipButton>
      )}

      {!hasLogIn && (
        <TooltipButton
          tooltip="Open preferences"
          variant="link"
          onClick={() => modalOpened({ modal: 'preferences' })}
        >
          <PreferenceIcon css={css({ height: 3 })} />
        </TooltipButton>
      )}

      {hasLogIn ? (
        <TooltipButton
          tooltip={userLiked ? 'Undo like sandbox' : 'Like sandbox'}
          variant="link"
          onClick={() => likeSandboxToggled(id)}
        >
          <LikeIcon
            css={css({
              height: 3,
              marginRight: 1,
              color: userLiked ? 'reds.500' : 'inherit',
            })}
          />{' '}
          <span>{likeCount}</span>
        </TooltipButton>
      ) : (
        <Stack gap={1} paddingX={2} align="center">
          <LikeIcon css={css({ height: 3 })} />
          <span>{likeCount}</span>
        </Stack>
      )}

      <Collaborators />

      {user?.curatorAt && (
        <Button
          variant="secondary"
          onClick={() => pickSandboxModal({ description, id, title })}
        >
          Pick
        </Button>
      )}
      <Button
        variant={primaryAction === 'Embed' ? 'primary' : 'secondary'}
        onClick={() => modalOpened({ modal: 'share' })}
      >
        <EmbedIcon css={css({ height: 3, marginRight: 1 })} /> Embed
      </Button>
      <Button
        variant={primaryAction === 'Fork' ? 'primary' : 'secondary'}
        onClick={forkSandboxClicked}
      >
        <ForkIcon css={css({ height: 3, marginRight: 1 })} /> Fork
      </Button>
      <Button
        variant="secondary"
        onClick={() => modalOpened({ modal: 'newSandbox' })}
      >
        Create Sandbox
      </Button>
      {hasLogIn ? (
        <UserMenu>
          <Avatar
            user={{ ...user, subscriptionSince: null }}
            css={css({ size: 6 })}
          />
        </UserMenu>
      ) : (
        <Button variant="primary" onClick={handleSignIn}>
          Sign in
        </Button>
      )}
    </Stack>
  );
};
