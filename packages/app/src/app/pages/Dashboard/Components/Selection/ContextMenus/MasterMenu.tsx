import React from 'react';
import { useOvermind } from 'app/overmind';
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
  const { actions } = useOvermind();
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
        View Master
      </MenuItem>
      <MenuItem
        onSelect={() => {
          actions.editor.forkExternalSandbox({
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
