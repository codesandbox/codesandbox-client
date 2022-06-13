import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { Avatar, Button, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import { UserMenu } from 'app/pages/common/UserMenu';
import React, { useEffect, useState } from 'react';
import { Notifications } from 'app/components/Notifications';
import track from '@codesandbox/common/lib/utils/analytics';

import {
  EmbedIcon,
  ForkIcon,
  LikeIcon,
  PreferenceIcon,
  ReloadIcon,
  MoreMenuIcon,
} from './icons';
import { Collaborators } from './Collaborators';
import { CollaboratorHeads } from './CollaboratorHeads';
import { ForkButton } from './ForkButton';

const TooltipButton = ({ tooltip, ...props }) => {
  if (!tooltip) return <Button {...props} />;

  return (
    <Tooltip content={tooltip}>
      <Button {...props} />
    </Tooltip>
  );
};

export const Actions = () => {
  const {
    signInClicked,
    modalOpened,
    openCreateSandboxModal,
    editor: { likeSandboxToggled, forkSandboxClicked },
    explore: { pickSandboxModal },
  } = useActions();
  const {
    hasLogIn,
    updateStatus,
    user,
    activeWorkspaceAuthorization,
    live: { isLive },
    editor: { isForkingSandbox, currentSandbox },
  } = useAppState();
  const {
    id,
    author,
    owned,
    title,
    description,
    likeCount,
    userLiked,
    permissions,
  } = currentSandbox;
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (!fadeIn) {
      const timeoutId = setTimeout(() => {
        setFadeIn(true);
      }, 500);
      return () => clearTimeout(timeoutId);
    }

    return () => {};
  }, [fadeIn]);

  let primaryAction: 'Sign in' | 'Share' | 'Fork';
  if (!hasLogIn) primaryAction = 'Sign in';
  else primaryAction = owned ? 'Share' : 'Fork';

  const NotLive = () =>
    hasLogIn ? (
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
    );

  return (
    <Stack
      align="center"
      gap={2}
      css={{ '> button': { width: 'auto' } }}
      style={{
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 0.25s ease-in-out',
      }}
    >
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

      {user?.experiments?.collaborator && isLive ? (
        <CollaboratorHeads />
      ) : (
        <NotLive />
      )}

      {user?.curatorAt && (
        <Button
          variant="secondary"
          css={css({ paddingX: 3 })}
          onClick={() => pickSandboxModal({ description, id, title })}
        >
          Pick
        </Button>
      )}

      {user?.experiments.collaborator &&
        (author ? (
          <Collaborators
            renderButton={props => (
              <Button
                variant={primaryAction === 'Share' ? 'primary' : 'secondary'}
                {...props}
              >
                <EmbedIcon css={css({ height: 3, marginRight: 1 })} /> Share
              </Button>
            )}
          />
        ) : (
          <Button
            variant={primaryAction === 'Share' ? 'primary' : 'secondary'}
            onClick={() => modalOpened({ modal: 'share' })}
          >
            <EmbedIcon css={css({ height: 3, marginRight: 1 })} /> Embed
          </Button>
        ))}

      {!user?.experiments.collaborator && (
        <Button
          variant={primaryAction === 'Share' ? 'primary' : 'secondary'}
          onClick={() => modalOpened({ modal: 'share' })}
        >
          <EmbedIcon css={css({ height: 3, marginRight: 1 })} /> Embed
        </Button>
      )}

      {user ? (
        <ForkButton
          user={user}
          forkClicked={teamId => forkSandboxClicked({ teamId })}
          variant={primaryAction === 'Fork' ? 'primary' : 'secondary'}
        />
      ) : (
        <TooltipButton
          tooltip={
            permissions.preventSandboxLeaving
              ? 'You do not have permission to fork this sandbox'
              : null
          }
          loading={isForkingSandbox}
          variant={primaryAction === 'Fork' ? 'primary' : 'secondary'}
          onClick={() => {
            signInClicked({ onCancel: () => forkSandboxClicked({}) });
          }}
          disabled={permissions.preventSandboxLeaving}
        >
          <ForkIcon css={css({ height: 3, marginRight: 1 })} /> Fork
        </TooltipButton>
      )}

      <Button
        variant="secondary"
        css={css({ paddingX: 3 })}
        onClick={() => {
          if (!user) {
            signInClicked({ onCancel: () => openCreateSandboxModal({}) });
          } else {
            openCreateSandboxModal({});
          }
        }}
        disabled={activeWorkspaceAuthorization === 'READ'}
      >
        Create Sandbox
      </Button>

      {hasLogIn && <Notifications />}
      {hasLogIn ? (
        <UserMenu>
          {user?.experiments.collaborator ? (
            <Button
              onClick={() => track('Editor - Click More Menu')}
              as={UserMenu.Button}
              variant="secondary"
              css={css({
                width: 26,
                height: 26, // match button size next to it
              })}
            >
              <MoreMenuIcon />
            </Button>
          ) : (
            <Button
              as={UserMenu.Button}
              css={css({
                display: 'flex',
                width: 26,
                height: 26, // match button size next to it
              })}
            >
              <Avatar
                user={{ ...user, subscriptionSince: null }}
                css={css({
                  size: '26px', // match button size next to it
                })}
              />
            </Button>
          )}
        </UserMenu>
      ) : (
        <Button variant="primary" onClick={() => signInClicked()}>
          Sign in
        </Button>
      )}
    </Stack>
  );
};
