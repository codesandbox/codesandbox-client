import React from 'react';
import { Menu } from '@codesandbox/components';
import { Context, MenuItem } from '../ContextMenu';

interface ContainerMenuProps {
  createNewFolder: () => void;
  createNewSandbox: () => void;
  createNewDevbox: () => void;
}

export const ContainerMenu: React.FC<ContainerMenuProps> = ({
  createNewFolder,
  createNewSandbox,
  createNewDevbox,
}) => {
  const { visible, setVisibility, position } = React.useContext(Context);

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 160 }}
    >
      <MenuItem
        onSelect={() => {
          createNewDevbox();
        }}
      >
        Create devbox
      </MenuItem>
      <MenuItem
        onSelect={() => {
          createNewSandbox();
        }}
      >
        Create sandbox
      </MenuItem>

      <MenuItem onSelect={() => createNewFolder()}>Create folder</MenuItem>
    </Menu.ContextMenu>
  );
};
