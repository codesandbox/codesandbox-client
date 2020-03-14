import React from 'react';
import MdMoreHoriz from 'react-icons/md/more-horiz';
import { MenuItem, Separator } from '@codesandbox/common/lib/components';
import { Menu } from './elements';

interface ISandboxOptionsMenuProps {
  pinned?: boolean;
}

export const SandboxOptionsMenu: React.FC<ISandboxOptionsMenuProps> = ({
  pinned = false,
  // eslint-disable-next-line
}) => {
  // TODO:
  // - Add Handlers for each Menu Item
  return (
    <Menu label={<MdMoreHoriz />} aria-label="Sandbox Options">
      <MenuItem>{`${pinned ? `Unpin` : `Pin`} Sandbox`}</MenuItem>
      <Separator />
      <MenuItem>Open Sandbox</MenuItem>
      <Separator />
      <MenuItem>Fork Sandbox</MenuItem>
      <Separator />
    </Menu>
  );
};
