import React from 'react';
import { Menu } from '@codesandbox/components';
import {
  DashboardSandbox,
  DashboardTemplate,
  DashboardFolder,
  DashboardRepo,
  DashboardNewMasterBranch,
  PageTypes,
} from '../../types';
import {
  MultiMenu,
  SandboxMenu,
  FolderMenu,
  RepoMenu,
  MasterMenu,
  ContainerMenu,
} from './ContextMenus';

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
    const sandbox = sandboxes.find(s => s.sandbox.id === id);
    return sandbox;
  });

  let menu: React.ReactNode;
  if (selectedItems.length === 0) {
    if (page === 'repos') return null;
    menu = (
      <ContainerMenu
        createNewSandbox={createNewSandbox}
        createNewFolder={createNewFolder}
      />
    );
  } else if (selectedItems.length > 1) {
    menu = <MultiMenu page={page} selectedItems={selectedItems} />;
  } else if (
    (selectedItems[0] && selectedItems[0].type === 'sandbox') ||
    selectedItems[0].type === 'template'
  ) {
    menu = <SandboxMenu item={selectedItems[0]} setRenaming={setRenaming} />;
  } else if (selectedItems[0].type === 'folder') {
    menu = <FolderMenu folder={selectedItems[0]} setRenaming={setRenaming} />;
  } else if (selectedItems[0].type === 'repo') {
    menu = <RepoMenu repo={selectedItems[0]} />;
  } else if (selectedItems[0].type === 'new-master-branch') {
    menu = <MasterMenu repo={selectedItems[0].repo} />;
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
