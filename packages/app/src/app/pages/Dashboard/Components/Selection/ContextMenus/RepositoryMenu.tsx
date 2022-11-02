import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu } from '@codesandbox/components';
import { ProjectFragment as Repository } from 'app/graphql/types';
import {
  dashboard,
  v2DefaultBranchUrl,
  v2DraftBranchUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { useActions, useAppState } from 'app/overmind';
import { quotes } from 'app/utils/quotes';
import { PageTypes } from 'app/overmind/namespaces/dashboard/types';
import { Context, MenuItem } from '../ContextMenu';

type RepositoryMenuProps = {
  repository: Repository;
  page: PageTypes;
};
export const RepositoryMenu: React.FC<RepositoryMenuProps> = ({
  repository,
  page,
}) => {
  const {
    activeTeam,
    dashboard: { removingRepository },
  } = useAppState();
  const { removeRepositoryFromTeam } = useActions().dashboard;
  const { visible, setVisibility, position } = React.useContext(Context);
  const history = useHistory();
  const state = useAppState();
  const actions = useActions();

  const [experimentalMode] = useState(() => {
    return window.localStorage.getItem('CSB_DEBUG') === 'ENABLED';
  });

  const { repository: providerRepository } = repository;
  // TODO: Get isViewOnly from repository 🚧
  const isViewOnly = false;

  const repositoryUrl = dashboard.repository({
    owner: providerRepository.owner,
    name: providerRepository.name,
  });
  const branchFromDefaultUrl = v2DraftBranchUrl(
    providerRepository.owner,
    providerRepository.name
  );
  const defaultBranchUrl = v2DefaultBranchUrl(
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
      <MenuItem
        onSelect={() => {
          window.location.href = defaultBranchUrl;
        }}
      >
        Open {quotes(providerRepository.defaultBranch)} branch
      </MenuItem>
      <MenuItem onSelect={() => window.open(defaultBranchUrl, '_blank')}>
        Open {quotes(providerRepository.defaultBranch)} in a new tab
      </MenuItem>
      <MenuItem onSelect={() => window.open(githubUrl, '_blank')}>
        Open on GitHub
      </MenuItem>

      <Menu.Divider />

      <MenuItem
        onSelect={() => window.open(branchFromDefaultUrl, '_blank')}
        disabled={isViewOnly}
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
        disabled={removingRepository}
        onSelect={() =>
          !removingRepository &&
          removeRepositoryFromTeam({
            owner: providerRepository.owner,
            name: providerRepository.name,
            teamId: activeTeam,
            page,
          })
        }
      >
        Remove repository from CodeSandbox
      </MenuItem>
    </Menu.ContextMenu>
  );
};
