import React from 'react';
import { useActions } from 'app/overmind';
import { Menu } from '@codesandbox/components';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Context, MenuItem } from '../ContextMenu';

type MasterMenuProps = {
  repo: {
    owner: string;
    name: string;
    branch: string;
  };
};
export const MasterMenu = ({ repo }: MasterMenuProps) => {
  const {
    editor: { forkExternalSandbox },
  } = useActions();
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
            })
          )
        }
      >
        View master
      </MenuItem>
      <MenuItem
        onSelect={() => {
          forkExternalSandbox({
            sandboxId: `github/${repo.owner}/${repo.name}`,
            openInNewWindow: true,
          });
        }}
      >
        Fork master
      </MenuItem>
    </Menu.ContextMenu>
  );
};
