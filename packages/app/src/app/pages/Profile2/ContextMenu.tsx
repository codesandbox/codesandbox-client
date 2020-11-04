import React from 'react';
import { useOvermind } from 'app/overmind';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useLocation } from 'react-router-dom';
import { Menu } from '@codesandbox/components';
import { SandboxType } from './constants';

export const ContextMenu = () => {
  const {
    state: {
      user: loggedInUser,
      profile: {
        current: user,
        contextMenu: { sandboxId, sandboxType, position },
      },
    },
    actions: {
      editor: { forkExternalSandbox },
      profile: {
        addFeaturedSandboxes,
        removeFeaturedSandboxes,
        changeSandboxPrivacy,
        deleteSandboxClicked,
        closeContextMenu,
        newSandboxShowcaseSelected,
      },
    },
  } = useOvermind();
  const location = useLocation();

  if (!sandboxId) return null;

  const myProfile = loggedInUser?.username === user.username;
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
          forkExternalSandbox({ sandboxId, openInNewWindow: true });
        }}
      >
        Fork sandbox
      </Menu.Item>
      {myProfile && !likesPage && !isFeatured && (
        <>
          <Menu.Divider />

          <Menu.Item
            onSelect={() => changeSandboxPrivacy({ id: sandboxId, privacy: 1 })}
          >
            Make sandbox unlisted
          </Menu.Item>
          <Menu.Item
            onSelect={() => changeSandboxPrivacy({ id: sandboxId, privacy: 2 })}
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
