import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu } from '@codesandbox/components';
import { ProjectFragment as Repository } from 'app/graphql/types';
import {
  dashboard,
  v2DraftBranchUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { useActions, useAppState } from 'app/overmind';
import { Context, MenuItem } from '../ContextMenu';

type RepositoryMenuProps = {
  repository: Repository;
};
export const RepositoryMenu: React.FC<RepositoryMenuProps> = ({
  repository,
}) => {
  const { activeTeam } = useAppState();
  const { removeRepositoryFromTeam } = useActions().dashboard;
  const { visible, setVisibility, position } = React.useContext(Context);
  const history = useHistory();
  const state = useAppState();
  const actions = useActions();

  const [experimentalMode] = useState(() => {
    return window.localStorage.getItem('CSB_DEBUG') === 'ENABLED';
  });

  const { repository: providerRepository } = repository;
  const repositoryUrl = dashboard.repository({
    owner: providerRepository.owner,
    name: providerRepository.name,
  });
  const branchFromDefaultUrl = v2DraftBranchUrl(
    providerRepository.owner,
    providerRepository.name
  );

  const repositoryIsStarred = state.dashboard.starredRepos.find(
    repo =>
      repo.owner === providerRepository.owner &&
      repo.name === providerRepository.name
  );

  const githubUrl = `https://github.com/${providerRepository.owner}/${providerRepository.name}`;

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 120 }}
    >
      <MenuItem onSelect={() => history.push(repositoryUrl)}>
        Open repository
      </MenuItem>
      <MenuItem onSelect={() => window.open(repositoryUrl, '_blank')}>
        Open repository in a new tab
      </MenuItem>
      <MenuItem onSelect={() => window.open(githubUrl, '_blank')}>
        Open on GitHub
      </MenuItem>
      <Menu.Divider />
      <MenuItem onSelect={() => window.open(branchFromDefaultUrl, '_blank')}>
        Create branch
      </MenuItem>

      {experimentalMode && (
        <MenuItem
          onSelect={() => {
            if (repositoryIsStarred) {
              actions.dashboard.unstarRepo(providerRepository);
            } else {
              actions.dashboard.starRepo(providerRepository);
            }
          }}
        >
          {repositoryIsStarred ? 'Unstar repository' : 'Star repository'}
        </MenuItem>
      )}

      <Menu.Divider />
      <MenuItem
        onSelect={() =>
          removeRepositoryFromTeam({
            owner: providerRepository.owner,
            name: providerRepository.name,
            teamId: activeTeam,
          })
        }
      >
        Remove from CodeSandbox
      </MenuItem>
    </Menu.ContextMenu>
  );
};
