import React from 'react';
import { Menu } from '@codesandbox/components';
import { BranchFragment as Branch } from 'app/graphql/types';
import {
  githubRepoUrl,
  v2BranchUrl,
  dashboard,
} from '@codesandbox/common/lib/utils/url-generator';
import { useHistory } from 'react-router-dom';
import { Context, MenuItem } from '../ContextMenu';

type BranchMenuProps = {
  branch: Branch;
};
export const BranchMenu: React.FC<BranchMenuProps> = ({ branch }) => {
  const { visible, setVisibility, position } = React.useContext(Context);

  const { name, project, contribution } = branch;
  const branchUrl = v2BranchUrl({ name, project });

  const { name: repoName, owner } = project.repository;

  const githubUrl = githubRepoUrl({
    branch: name,
    repo: repoName,
    username: owner,
    path: '',
  });

  const repoUrl = dashboard.repository({ owner, name: repoName });

  const history = useHistory();

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 120 }}
    >
      <MenuItem
        onSelect={() => {
          window.location.href = branchUrl;
        }}
      >
        Open branch
      </MenuItem>
      <MenuItem onSelect={() => window.open(branchUrl, '_blank')}>
        Open branch in a new tab
      </MenuItem>
      {!contribution && (
        <MenuItem onSelect={() => window.open(githubUrl, '_blank')}>
          Open on GitHub
        </MenuItem>
      )}
      <MenuItem onSelect={() => history.push(repoUrl)}>
        Open repository
      </MenuItem>
      {/* TODO: Implement remove branch <Menu.Divider />
      <Menu.Divider />
      <MenuItem
        onSelect={() => {

        }}
      >
        Remove from CodeSandbox
      </MenuItem> */}
    </Menu.ContextMenu>
  );
};
