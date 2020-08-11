import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from '@codesandbox/components';
import { Context, MenuItem } from '../ContextMenu';

interface ContainerMenuProps {
  createNewFolder: () => void;
  createNewSandbox: () => void;
}

export const ContainerMenu: React.FC<ContainerMenuProps> = ({
  createNewFolder,
  createNewSandbox,
}) => {
  const { visible, setVisibility, position } = React.useContext(Context);
  const location = useLocation();

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 160 }}
    >
      {location.pathname !== '/dashboard/all/' && (
        <MenuItem onSelect={() => createNewSandbox()}>
          Create new sandbox
        </MenuItem>
      )}
      <MenuItem onSelect={() => createNewFolder()}>Create new folder</MenuItem>
    </Menu.ContextMenu>
  );
};
