import React from 'react';
import { useOvermind } from 'app/overmind';
import { useHistory } from 'react-router-dom';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { Stack, Menu, Icon, Text } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';

export const ContextMenu = ({
  visible,
  position,
  setVisibility,
  folder,
  setRenaming,
  setNewFolderPath,
}) => {
  const { actions } = useOvermind();

  React.useEffect(() => {
    // close when user clicks outside or scrolls away
    const handler = () => {
      if (visible) setVisibility(false);
    };

    document.addEventListener('click', handler);

    return () => {
      document.removeEventListener('click', handler);
    };
  }, [visible, setVisibility]);

  // handle key down events - close on escape + disable the rest
  // TODO: handle arrow keys and space/enter.
  React.useEffect(() => {
    const handler = event => {
      if (!visible) return;
      if (event.keyCode === ESC) setVisibility(false);
      event.preventDefault();
    };

    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  });

  const history = useHistory();

  if (!visible || !folder) return null;

  let menuOptions;

  if (folder.name === 'Drafts') {
    menuOptions = (
      <Menu.Item onSelect={() => {}}>
        <Stack gap={1}>
          <Icon name="lock" size={14} />
          <Text>Protected</Text>
        </Stack>
      </Menu.Item>
    );
  } else if (folder.name === 'All sandboxes') {
    menuOptions = (
      <Menu.Item onSelect={() => setNewFolderPath(folder.path + '/__NEW__')}>
        New folder
      </Menu.Item>
    );
  } else {
    menuOptions = (
      <>
        <Menu.Item onSelect={() => setNewFolderPath(folder.path + '/__NEW__')}>
          New folder
        </Menu.Item>
        <Menu.Item onSelect={() => setRenaming(true)}>Rename folder</Menu.Item>
        <Menu.Item
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
        </Menu.Item>
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
        {menuOptions}
      </Menu.ContextMenu>
    </>
  );
};
