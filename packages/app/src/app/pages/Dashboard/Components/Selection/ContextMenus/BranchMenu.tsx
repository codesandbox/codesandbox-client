import React from 'react';
import { Menu } from '@codesandbox/components';
import { BranchFragment as Branch } from 'app/graphql/types';
import {
  githubRepoUrl,
  v2BranchUrl,
  dashboard,
} from '@codesandbox/common/lib/utils/url-generator';
import { useHistory } from 'react-router-dom';
import { useActions, useAppState } from 'app/overmind';
import { PageTypes } from 'app/pages/Dashboard/types';
import { Context, MenuItem } from '../ContextMenu';

type BranchMenuProps = {
  branch: Branch;
  page: PageTypes;
};
export const BranchMenu: React.FC<BranchMenuProps> = ({ branch, page }) => {
  const { removeBranchFromRepository } = useActions().dashboard;
  const { removingBranch } = useAppState().dashboard;
  const { visible, setVisibility, position } = React.useContext(Context);

  const { id, name, project, contribution } = branch;
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
      <Menu.Divider />
      <MenuItem
        disabled={removingBranch}
        onSelect={() =>
          !removingBranch &&
          removeBranchFromRepository({
            id,
            owner,
            repoName,
            name,
            page,
          })
        }
      >
        Remove from CodeSandbox
      </MenuItem>
    </Menu.ContextMenu>
  );
};
