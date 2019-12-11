import React from 'react';
import MdMoreHoriz from 'react-icons/md/more-horiz';
import { MenuItem, Separator } from '@codesandbox/common/lib/components';
import { Menu } from './elements';

interface ISandboxOptionsMenuProps {}

// eslint-disable-next-line
export const SandboxOptionsMenu: React.FC<ISandboxOptionsMenuProps> = () => {
  // TODO:
  // - Add Handlers for each Menu Item

  return (
    <Menu label={<MdMoreHoriz />} aria-label="Sandbox Options">
      <MenuItem>Pin Sandbox</MenuItem>
      <Separator />
      <MenuItem>Open Sandbox</MenuItem>
      <Separator />
      <MenuItem>Fork Sandbox</MenuItem>
      <Separator />
      <MenuItem disabled>Hide Sandbox</MenuItem>
      <Separator />
      <MenuItem danger>Move to Trash</MenuItem>
    </Menu>
  );
};
