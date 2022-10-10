import React from 'react';
import { useEffects } from 'app/overmind';
import { Menu } from '@codesandbox/components';
import {
  sandboxUrl,
  githubRepoUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { Context, MenuItem } from '../ContextMenu';
import { DashboardSyncedSandbox } from '../../../types';

type RepoMenuProps = {
  repo: DashboardSyncedSandbox;
};

export const SyncedSandboxMenu = ({ repo }: RepoMenuProps) => {
  const effects = useEffects();
  const { visible, setVisibility, position } = React.useContext(Context);
  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 120 }}
    >
      <MenuItem
        onSelect={() =>
          window.open(
            sandboxUrl({
              git: {
                commitSha: '',
                branch: repo.branch,
                repo: repo.name,
                username: repo.owner,
                path: '',
              },
            }),
            '_blank'
          )
        }
      >
        Open on CodeSandbox
      </MenuItem>
      <MenuItem
        onSelect={() => {
          effects.browser.copyToClipboard(
            githubRepoUrl({
              branch: repo.branch,
              repo: repo.name,
              username: repo.owner,
              path: '',
            })
          );
        }}
      >
        Copy GitHub URL
      </MenuItem>
      <MenuItem
        onSelect={() =>
          window.open(
            githubRepoUrl({
              branch: repo.branch,
              repo: repo.name,
              username: repo.owner,
              path: '',
            }),
            '_blank'
          )
        }
      >
        Open on GitHub
      </MenuItem>
    </Menu.ContextMenu>
  );
};
