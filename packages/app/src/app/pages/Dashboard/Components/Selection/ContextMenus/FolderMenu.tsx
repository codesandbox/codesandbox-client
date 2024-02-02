import React from 'react';
import { useActions } from 'app/overmind';
import { Menu } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { Context, MenuItem } from '../ContextMenu';
import { DashboardBaseFolder } from '../../../types';

type FolderMenuProps = {
  folder: DashboardBaseFolder;
  setRenaming: (renaming: boolean) => void;
};

export const FolderMenu = ({ folder, setRenaming }: FolderMenuProps) => {
  const {
    dashboard: { deleteFolder },
  } = useActions();
  const { visible, setVisibility, position } = React.useContext(Context);

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 120 }}
    >
      <MenuItem onSelect={() => setRenaming(true)}>Rename</MenuItem>
      <MenuItem
        onSelect={() => {
          deleteFolder({ path: folder.path });
          setVisibility(false);
          track('Dashboard - Delete folder', {
            source: 'Grid',
            dashboardVersion: 2,
          });
        }}
      >
        Delete
      </MenuItem>
    </Menu.ContextMenu>
  );
};
