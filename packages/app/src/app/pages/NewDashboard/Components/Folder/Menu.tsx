import React from 'react';
import { useOvermind } from 'app/overmind';
import { Menu } from '@codesandbox/components';

export const MenuOptions = ({ path, onRename }) => {
  const {
    actions: { dashboard },
  } = useOvermind();
  return (
    <Menu>
      <Menu.IconButton name="more" size={9} title="Folder options" />
      <Menu.List>
        <Menu.Item onSelect={() => onRename()}>Rename folder</Menu.Item>
        <Menu.Item onSelect={() => dashboard.deleteFolder({ path })}>
          Delete folder
        </Menu.Item>
      </Menu.List>
    </Menu>
  );
};
