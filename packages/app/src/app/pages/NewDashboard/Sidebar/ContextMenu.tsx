import React from 'react';
import { useOvermind } from 'app/overmind';
import { useHistory } from 'react-router-dom';
import { Stack, Menu, Icon, Text } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';

const Context = React.createContext({
  setVisibility: null,
});

export const ContextMenu = ({
  visible,
  position,
  setVisibility,
  folder,
  setRenaming,
  setNewFolderPath,
}) => {
  const { actions } = useOvermind();
  const history = useHistory();

  if (!visible || !folder) return null;

  let menuOptions;

  if (folder.name === 'Drafts') {
    menuOptions = (
      <MenuItem onSelect={() => {}}>
        <Stack gap={1}>
          <Icon name="lock" size={14} />
          <Text>Protected</Text>
        </Stack>
      </MenuItem>
    );
  } else if (folder.name === 'All sandboxes') {
    menuOptions = (
      <MenuItem onSelect={() => setNewFolderPath(folder.path + '/__NEW__')}>
        New folder
      </MenuItem>
    );
  } else {
    menuOptions = (
      <>
        <MenuItem onSelect={() => setNewFolderPath(folder.path + '/__NEW__')}>
          New folder
        </MenuItem>
        <MenuItem onSelect={() => setRenaming(true)}>Rename folder</MenuItem>
        <MenuItem
          onSelect={() => {
            actions.dashboard.deleteFolder({ path: folder.path });

            // navigate out of folder when it's deleted
            const parentFolder = folder.path
              .split('/')
              .slice(0, -1)
              .join('/');
            history.push('/new-dashboard/all' + parentFolder);

            track('Dashboard - Delete folder', {
              source: 'Sidebar',
              dashboardVersion: 2,
            });
          }}
        >
          Delete folder
        </MenuItem>
      </>
    );
  }

  return (
    <>
      <Menu.ContextMenu
        visible={visible}
        setVisibility={setVisibility}
        position={position}
        style={{ width: 120 }}
      >
        <Context.Provider value={{ setVisibility }}>
          {menuOptions}
        </Context.Provider>
      </Menu.ContextMenu>
    </>
  );
};

const MenuItem = ({ onSelect, ...props }) => {
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
