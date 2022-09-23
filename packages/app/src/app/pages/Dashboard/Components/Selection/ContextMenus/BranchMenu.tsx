import React from 'react';
import { Menu } from '@codesandbox/components';
import { Context, MenuItem } from '../ContextMenu';

// type BranchMenuProps = {
//   branch: DashboardBranch;
// };
export const BranchMenu = () => {
  const { visible, setVisibility, position } = React.useContext(Context);

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 120 }}
    >
      <MenuItem onSelect={() => alert('github')}>Open on GitHub</MenuItem>
      <MenuItem onSelect={() => alert('code')}>Open on VS Code</MenuItem>
      <Menu.Divider />
      <MenuItem onSelect={() => alert('remove')}>
        Remove from CodeSandbox
      </MenuItem>
    </Menu.ContextMenu>
  );
};
