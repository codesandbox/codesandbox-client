import React from 'react';
import { useOvermind } from 'app/overmind';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useLocation } from 'react-router-dom';
import { Menu } from '@codesandbox/components';

export const ContextMenu = ({
  visible,
  setVisibility,
  position,
  sandboxId,
}) => {
  const {
    actions: {
      editor: { forkExternalSandbox },
      profile: {
        addFeaturedSandboxes,
        removeFeaturedSandboxes,
        changeSandboxPrivacy,
        deleteSandboxClicked,
      },
    },
    state: {
      user: loggedInUser,
      profile: { current: user },
    },
  } = useOvermind();
  const location = useLocation();

  if (!visible) return null;

  const myProfile = loggedInUser?.username === user.username;
  const likesPage = location.pathname === '/likes';

  const isFeatured = user.featuredSandboxes
    .map(sandbox => sandbox.id)
    .includes(sandboxId);

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
    >
      {myProfile && !likesPage && (
        <>
          {isFeatured ? (
            <Menu.Item onSelect={() => removeFeaturedSandboxes({ sandboxId })}>
              Unpin sandbox
            </Menu.Item>
          ) : (
            <Menu.Item onSelect={() => addFeaturedSandboxes({ sandboxId })}>
              Pin sandbox
            </Menu.Item>
          )}
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
            onSelect={() => changeSandboxPrivacy({ sandboxId, privacy: 1 })}
          >
            Make sandbox unlisted
          </Menu.Item>
          <Menu.Item
            onSelect={() => changeSandboxPrivacy({ sandboxId, privacy: 2 })}
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
