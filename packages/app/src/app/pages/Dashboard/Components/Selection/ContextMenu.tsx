import React from 'react';
import { Menu } from '@codesandbox/components';
import {
  DashboardSandbox,
  DashboardTemplate,
  DashboardFolder,
  DashboardRepo,
  DashboardNewMasterBranch,
  DashboardCommunitySandbox,
  PageTypes,
  DashboardBranch,
  DashboardRepository,
} from '../../types';
import {
  MultiMenu,
  SandboxMenu,
  FolderMenu,
  RepoMenu,
  MasterMenu,
  ContainerMenu,
  CommunitySandboxMenu,
} from './ContextMenus';
import { BranchMenu } from './ContextMenus/BranchMenu';
import { RepositoryMenu } from './ContextMenus/RepositoryMenu';

interface IMenuProps {
  visible: boolean;
  position: { x: null | number; y: null | number };
  setVisibility: null | ((value: boolean) => void);
}

export const Context = React.createContext<IMenuProps>({
  visible: false,
  setVisibility: null,
  position: { x: null, y: null },
});

interface IContextMenuProps extends IMenuProps {
  selectedIds: string[];
  sandboxes: Array<DashboardSandbox | DashboardTemplate>;
  folders: Array<DashboardFolder>;
  repos?: Array<DashboardRepo>;
  branches: Array<DashboardBranch>;
  repositories: Array<DashboardRepository>;
  setRenaming: null | ((value: boolean) => void);
  createNewFolder: () => void;
  createNewSandbox: (() => void) | null;
  page: PageTypes;
}

export const ContextMenu: React.FC<IContextMenuProps> = ({
  visible,
  position,
  setVisibility,
  selectedIds,
  sandboxes,
  folders,
  branches,
  repositories, // v2 repositories, formerly known as projects.
  repos,
  setRenaming,
  createNewFolder,
  createNewSandbox,
  page,
}) => {
  if (!visible) return null;

  const selectedItems: Array<
    | DashboardFolder
    | DashboardSandbox
    | DashboardTemplate
    | DashboardRepo
    | DashboardNewMasterBranch
    | DashboardCommunitySandbox
    | DashboardBranch
    | DashboardRepository
  > = selectedIds.map(id => {
    if (id.startsWith('/')) {
      if (repos && repos.length) {
        const repo = repos.find(f => '/' + f.name === id);
        return { type: 'repo', ...repo };
      }

      if (id.startsWith('/github')) {
        const all = id.split(`/`);
        return {
          type: 'new-master-branch',
          repo: {
            owner: all[all.length - 2],
            name: all[all.length - 1],
            branch: 'master',
          },
        };
      }

      const folder = folders.find(f => f.path === id);
      return { type: 'folder', ...folder };
    }

    const branch = branches.find(b => b.branch.id === id);
    if (branch) {
      return branch;
    }

    const repository = repositories.find(r => {
      const { repository: providerRepository } = r.repository;
      const rId = `${providerRepository.owner}-${providerRepository.name}`;
      return rId === id;
    });
    if (repository) {
      return repository;
    }

    const sandbox = sandboxes.find(s => s.sandbox.id === id);
    return sandbox;
  });

  let menu: React.ReactNode;

  if (selectedItems.length === 0 || selectedItems[0] === undefined) {
    if (['repositories', 'my-contributions', 'synced-sandboxes'].includes(page))
      return null;
    menu = (
      <ContainerMenu
        createNewSandbox={createNewSandbox}
        createNewFolder={createNewFolder}
      />
    );
  } else if (selectedItems[0].type === 'branch') {
    menu = <BranchMenu branch={selectedItems[0].branch} page={page} />;
  } else if (selectedItems[0].type === 'repository') {
    menu = <RepositoryMenu repository={selectedItems[0].repository} />;
  } else if (selectedItems.length > 1) {
    menu = (
      <MultiMenu
        page={page}
        selectedItems={
          selectedItems as Array<
            | DashboardFolder
            | DashboardSandbox
            | DashboardTemplate
            | DashboardCommunitySandbox
          >
        }
      />
    );
  } else if (
    selectedItems[0] &&
    (selectedItems[0].type === 'sandbox' ||
      selectedItems[0].type === 'template')
  ) {
    menu = <SandboxMenu item={selectedItems[0]} setRenaming={setRenaming} />;
  } else if (selectedItems[0].type === 'folder') {
    menu = <FolderMenu folder={selectedItems[0]} setRenaming={setRenaming} />;
  } else if (selectedItems[0].type === 'repo') {
    menu = <RepoMenu repo={selectedItems[0]} />;
  } else if (selectedItems[0].type === 'new-master-branch') {
    menu = <MasterMenu repo={selectedItems[0].repo} />;
  } else if (selectedItems[0].type === 'community-sandbox') {
    menu = <CommunitySandboxMenu item={selectedItems[0]} />;
  }

  return (
    <Context.Provider value={{ visible, setVisibility, position }}>
      {menu}
    </Context.Provider>
  );
};

export const MenuItem = ({ onSelect, ...props }) => {
  const { setVisibility } = React.useContext(Context);
  return (
    <Menu.Item
      onSelect={() => {
        onSelect();
        setVisibility(false);
      }}
      {...props}
    />
  );
};
