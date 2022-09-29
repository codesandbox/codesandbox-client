import React from 'react';
import { Menu } from '@codesandbox/components';
import { ProjectFragment as Repository } from 'app/graphql/types';
import {
  //   githubRepoUrl,
  dashboard,
} from '@codesandbox/common/lib/utils/url-generator';
import { useHistory } from 'react-router-dom';
import { Context, MenuItem } from '../ContextMenu';

type RepositoryMenuProps = {
  repository: Repository;
};
export const RepositoryMenu: React.FC<RepositoryMenuProps> = ({
  repository,
}) => {
  const { visible, setVisibility, position } = React.useContext(Context);
  const history = useHistory();

  const { repository: providerRepository } = repository;
  const repositoryUrl = dashboard.repository({
    owner: providerRepository.owner,
    name: providerRepository.name,
  });
  const githubUrl = `https://github.com/${providerRepository.owner}/${providerRepository.name}`;
  //   TODO: fix this githubRepoUrl
  //   const githubUrl = githubRepoUrl({
  //     branch: ?
  //     repo: providerRepository.name,
  //     username: providerRepository.owner,
  //     path: '',
  //   });

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
      <MenuItem
        onSelect={() => {
          /* TODO: Implement remove repository */
        }}
      >
        Remove from CodeSandbox
      </MenuItem>
    </Menu.ContextMenu>
  );
};
