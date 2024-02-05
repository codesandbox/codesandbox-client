import React from 'react';
import { Menu } from '@codesandbox/components';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
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
  const { hasReachedSandboxLimit } = useWorkspaceLimits();

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
        disabled={hasReachedSandboxLimit}
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
