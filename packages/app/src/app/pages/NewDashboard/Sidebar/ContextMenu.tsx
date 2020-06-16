import React from 'react';
import { useOvermind } from 'app/overmind';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { Stack, Element, Icon, Text } from '@codesandbox/components';
import css from '@styled-system/css';

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

  if (!visible || !folder) return null;

  let menuOptions;

  if (folder.name === 'Drafts') {
    menuOptions = (
      <MenuItem>
        <Stack gap={1}>
          <Icon name="lock" size={14} />
          <Text>Protected</Text>
        </Stack>
      </MenuItem>
    );
  } else if (folder.name === 'All sandboxes') {
    menuOptions = (
      <MenuItem onClick={() => setNewFolderPath(folder.path + '/__NEW__')}>
        New folder
      </MenuItem>
    );
  } else {
    menuOptions = (
      <>
        <MenuItem onClick={() => setNewFolderPath(folder.path + '/__NEW__')}>
          New folder
        </MenuItem>
        <MenuItem onClick={() => setRenaming(true)}>Rename folder</MenuItem>
        <MenuItem
          onClick={() => actions.dashboard.deleteFolder({ path: folder.path })}
        >
          Delete folder
        </MenuItem>
      </>
    );
  }

  return (
    <>
      <Stack
        direction="vertical"
        data-reach-menu-list
        data-component="MenuList"
        css={css({
          position: 'absolute',
          width: 120,
          top: position.y,
          left: position.x,
          zIndex: 3,
        })}
      >
        {menuOptions}
      </Stack>
    </>
  );
};

const MenuItem = props => (
  <Element data-reach-menu-item="" data-component="MenuItem" {...props} />
);
