import React from 'react';
import { Menu } from '@codesandbox/components';
import { BranchFragment as Branch } from 'app/graphql/types';
import {
  githubRepoUrl,
  v2BranchUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { useHistory } from 'react-router-dom';
import { Context, MenuItem } from '../ContextMenu';

type BranchMenuProps = {
  branch: Branch;
};
export const BranchMenu: React.FC<BranchMenuProps> = ({ branch }) => {
  const { visible, setVisibility, position } = React.useContext(Context);
  const history = useHistory();

  const { name, project, contribution } = branch;
  const branchUrl = v2BranchUrl({ name, project });
  const githubUrl = githubRepoUrl({
    branch: name,
    repo: project.repository.name,
    username: project.repository.owner,
    path: '',
  });

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 120 }}
    >
      <MenuItem onSelect={() => history.push(branchUrl)}>Open branch</MenuItem>
      <MenuItem onSelect={() => window.open(branchUrl, '_blank')}>
        Open branch in a new tab
      </MenuItem>
      {!contribution && (
        <MenuItem onSelect={() => window.open(githubUrl, '_blank')}>
          Open on GitHub
        </MenuItem>
      )}
      <MenuItem
        onSelect={() => {
          /* TODO: Decide if we bring the functionality from v2 */
        }}
      >
        Open in VS Code
      </MenuItem>
      <Menu.Divider />
      <MenuItem
        onSelect={() => {
          /* TODO: Implement remove branch */
        }}
      >
        Remove from CodeSandbox
      </MenuItem>
    </Menu.ContextMenu>
  );
};
