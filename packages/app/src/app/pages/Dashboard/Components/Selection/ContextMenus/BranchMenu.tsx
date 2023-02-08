import React from 'react';
import { Menu } from '@codesandbox/components';
import { BranchFragment as Branch, ProjectFragment } from 'app/graphql/types';
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
  const {
    removeBranchFromRepository,
    removeRepositoryFromTeam,
  } = useActions().dashboard;
  const {
    dashboard: { removingBranch, removingRepository },
  } = useAppState();
  const { visible, setVisibility, position } = React.useContext(Context);

  const { id, name, project, contribution } = branch;
  const branchUrl = v2BranchUrl({
    owner: project.repository.owner,
    repoName: project.repository.name,
    branchName: name,
    workspaceId: project.team?.id || null,
  });

  const { name: repoName, owner, defaultBranch } = project.repository;

  const githubUrl = githubRepoUrl({
    branch: name,
    repo: repoName,
    username: owner,
    path: '',
  });

  const repoUrl = dashboard.repository({ owner, name: repoName });

  const history = useHistory();

  const canRemoveBranch = name !== defaultBranch;
  const branchIsOnGitHub = branch.upstream;

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
      {branchIsOnGitHub && !contribution && (
        <MenuItem onSelect={() => window.open(githubUrl, '_blank')}>
          Open on GitHub
        </MenuItem>
      )}
      <MenuItem onSelect={() => history.push(repoUrl)}>
        Open repository
      </MenuItem>
      {(canRemoveBranch || !contribution) && <Menu.Divider />}
      {canRemoveBranch && (
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
          Remove branch from CodeSandbox
        </MenuItem>
      )}
      {!contribution && (
        <MenuItem
          disabled={removingRepository}
          onSelect={() =>
            !removingRepository &&
            removeRepositoryFromTeam({
              page,
              project: project as ProjectFragment,
            })
          }
        >
          Remove repository from CodeSandbox
        </MenuItem>
      )}
    </Menu.ContextMenu>
  );
};
