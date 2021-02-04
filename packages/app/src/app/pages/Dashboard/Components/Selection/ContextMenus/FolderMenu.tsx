import React from 'react';
import { useAppState, useActions } from 'app/overmind';
import { Menu, Stack, Icon, Text } from '@codesandbox/components';
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
  const { activeWorkspaceAuthorization } = useAppState();
  const { visible, setVisibility, position } = React.useContext(Context);

  const isDrafts = folder.path === '/drafts';

  if (isDrafts || activeWorkspaceAuthorization === 'READ')
    return (
      <Menu.ContextMenu
        visible={visible}
        setVisibility={setVisibility}
        position={position}
        style={{ width: 120 }}
      >
        <MenuItem onSelect={() => {}}>
          <Stack gap={1}>
            <Icon name="lock" size={14} />
            <Text>Protected</Text>
          </Stack>
        </MenuItem>
      </Menu.ContextMenu>
    );

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 120 }}
    >
      <MenuItem onSelect={() => setRenaming(true)}>Rename folder</MenuItem>
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
        Delete folder
      </MenuItem>
    </Menu.ContextMenu>
  );
};
