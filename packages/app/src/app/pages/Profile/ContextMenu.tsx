import React from 'react';
import { useAppState, useActions } from 'app/overmind';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useLocation } from 'react-router-dom';
import { Menu } from '@codesandbox/components';
import { SandboxType } from './constants';

export const ContextMenu = () => {
  const {
    user: loggedInUser,
    activeTeamInfo,
    profile: {
      current: user,
      contextMenu: { sandboxId, sandboxType, position },
    },
  } = useAppState();
  const {
    dashboard: { forkSandbox },
    profile: {
      addFeaturedSandboxes,
      removeFeaturedSandboxes,
      changeSandboxPrivacy,
      deleteSandboxClicked,
      closeContextMenu,
      newSandboxShowcaseSelected,
    },
    modalClosed,
  } = useActions();
  const location = useLocation();

  if (!sandboxId) return null;

  const myProfile = loggedInUser?.username === user.username;
  const isPro = loggedInUser && activeTeamInfo?.subscription;
  const likesPage = location.pathname === '/likes';

  const isFeatured = user.featuredSandboxes
    .map(sandbox => sandbox.id)
    .includes(sandboxId);

  const setVisibility = (visible: boolean) => {
    if (!visible) closeContextMenu();
  };

  if (sandboxType === SandboxType.PICKER_SANDBOX) {
    return (
      <Menu.ContextMenu
        visible
        setVisibility={setVisibility}
        position={position}
      >
        <Menu.Item
          onSelect={() => {
            addFeaturedSandboxes({ sandboxId });
            modalClosed();
          }}
        >
          Pin sandbox
        </Menu.Item>
        <Menu.Item
          onSelect={() => {
            newSandboxShowcaseSelected(sandboxId);
            modalClosed();
          }}
        >
          Set as header
        </Menu.Item>
      </Menu.ContextMenu>
    );
  }

  if (sandboxType === SandboxType.PRIVATE_SANDBOX) {
    return (
      <Menu.ContextMenu
        visible
        setVisibility={setVisibility}
        position={position}
      >
        <Menu.Item data-disabled>Pin sandbox</Menu.Item>
        <Menu.Item data-disabled>Set as header</Menu.Item>
        <Menu.Divider />
        <Menu.Item
          onSelect={() => changeSandboxPrivacy({ id: sandboxId, privacy: 0 })}
        >
          Make sandbox public
        </Menu.Item>
      </Menu.ContextMenu>
    );
  }

  return (
    <Menu.ContextMenu visible setVisibility={setVisibility} position={position}>
      {myProfile && !likesPage && (
        <span>
          {isFeatured ? (
            <Menu.Item onSelect={() => removeFeaturedSandboxes({ sandboxId })}>
              Unpin sandbox
            </Menu.Item>
          ) : (
            <Menu.Item onSelect={() => addFeaturedSandboxes({ sandboxId })}>
              Pin sandbox
            </Menu.Item>
          )}
        </span>
      )}
      {myProfile && !likesPage && (
        <>
          <Menu.Item onSelect={() => newSandboxShowcaseSelected(sandboxId)}>
            Set as header
          </Menu.Item>
          <Menu.Divider />
        </>
      )}
      <Menu.Item
        onSelect={() => {
          window.location.href = sandboxUrl({ id: sandboxId });
        }}
      >
        Open sandbox
      </Menu.Item>
      <Menu.Item
        onSelect={() => {
          forkSandbox({
            sandboxId,
            openInNewWindow: true,
            redirectAfterFork: true,
          });
        }}
      >
        Fork sandbox
      </Menu.Item>
      {myProfile && !likesPage && !isFeatured && (
        <>
          <Menu.Divider />

          <Menu.Item
            data-disabled={isPro ? null : true}
            onSelect={() => {
              if (!isPro) return;
              changeSandboxPrivacy({ id: sandboxId, privacy: 1 });
            }}
          >
            Make sandbox unlisted
          </Menu.Item>
          <Menu.Item
            data-disabled={isPro ? null : true}
            onSelect={() => {
              if (!isPro) return;
              changeSandboxPrivacy({ id: sandboxId, privacy: 2 });
            }}
          >
            Make sandbox private
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item onSelect={() => deleteSandboxClicked(sandboxId)}>
            Delete sandbox
          </Menu.Item>
        </>
      )}
    </Menu.ContextMenu>
  );
};
