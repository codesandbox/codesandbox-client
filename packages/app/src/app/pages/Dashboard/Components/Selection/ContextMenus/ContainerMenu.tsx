import React from 'react';
import { Menu } from '@codesandbox/components';
import { Context, MenuItem } from '../ContextMenu';

interface ContainerMenuProps {
  createNewFolder: () => void;
  createNewSandbox: (() => void) | null;
}

export const ContainerMenu: React.FC<ContainerMenuProps> = ({
  createNewFolder,
  createNewSandbox,
}) => {
  const { visible, setVisibility, position } = React.useContext(Context);

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 160 }}
    >
      {typeof createNewSandbox === 'function' && (
        <MenuItem
          onSelect={() => {
            createNewSandbox();
          }}
        >
          Create new sandbox
        </MenuItem>
      )}
      <MenuItem onSelect={() => createNewFolder()}>Create new folder</MenuItem>
    </Menu.ContextMenu>
  );
};
