import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu } from '@codesandbox/components';
import { ProjectFragment } from 'app/graphql/types';
import {
  dashboard,
  v2BranchUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { useActions, useAppState } from 'app/overmind';
import { quotes } from 'app/utils/quotes';
import { PageTypes } from 'app/overmind/namespaces/dashboard/types';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { Context, MenuItem } from '../ContextMenu';

type RepositoryMenuProps = {
  repository: ProjectFragment;
  page: PageTypes;
};
export const RepositoryMenu: React.FC<RepositoryMenuProps> = ({
  // Rename this as project to avoid confusion with internal repository fields
  repository: project,
  page,
}) => {
  const {
    dashboard: { removingRepository },
  } = useAppState();
  const { removeRepositoryFromTeam } = useActions().dashboard;
  const { visible, setVisibility, position } = React.useContext(Context);
  const history = useHistory();
  const state = useAppState();
  const actions = useActions();
  const { isFrozen } = useWorkspaceLimits();

  const [experimentalMode] = useState(() => {
    return window.localStorage.getItem('CSB_DEBUG') === 'ENABLED';
  });

  const { repository, team: assignedTeam } = project;

  const repositoryUrl = dashboard.repository({
    owner: repository.owner,
    name: repository.name,
  });

  const defaultBranchUrl = v2BranchUrl({
    owner: repository.owner,
    repoName: repository.name,
    branchName: repository.defaultBranch,
    workspaceId: assignedTeam?.id,
  });

  const repositoryIsStarred = state.dashboard.starredRepos.find(
    repo => repo.owner === repository.owner && repo.name === repository.name
  );

  const githubUrl = `https://github.com/${repository.owner}/${repository.name}`;

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 120 }}
    >
      <MenuItem
        onSelect={() => {
          window.location.href = defaultBranchUrl;
        }}
      >
        Open {quotes(repository.defaultBranch)} branch
      </MenuItem>
      <MenuItem onSelect={() => window.open(defaultBranchUrl, '_blank')}>
        Open {quotes(repository.defaultBranch)} in a new tab
      </MenuItem>
      <MenuItem onSelect={() => window.open(githubUrl, '_blank')}>
        Open on GitHub
      </MenuItem>

      <Menu.Divider />

      <MenuItem
        onSelect={() => {
          actions.dashboard.createDraftBranch({
            owner: repository.owner,
            name: repository.name,
            teamId: assignedTeam?.id,
          });
        }}
        disabled={isFrozen}
      >
        Create branch
      </MenuItem>
      <MenuItem onSelect={() => history.push(repositoryUrl)}>
        See all branches
      </MenuItem>

      {experimentalMode && (
        <MenuItem
          onSelect={() => {
            if (repositoryIsStarred) {
              actions.dashboard.unstarRepo(repository);
            } else {
              actions.dashboard.starRepo(repository);
            }
          }}
        >
          {repositoryIsStarred ? 'Unstar repository' : 'Star repository'}
        </MenuItem>
      )}

      <Menu.Divider />
      <MenuItem
        disabled={removingRepository}
        onSelect={() =>
          !removingRepository &&
          removeRepositoryFromTeam({
            project,
            page,
          })
        }
      >
        Remove repository from CodeSandbox
      </MenuItem>
    </Menu.ContextMenu>
  );
};
