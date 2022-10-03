import React from 'react';
import { useEffects, useActions } from 'app/overmind';
import { useHistory } from 'react-router-dom';
import { Menu } from '@codesandbox/components';

import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Context, MenuItem } from '../ContextMenu';
import { DashboardCommunitySandbox } from '../../../types';

interface MenuProps {
  item: DashboardCommunitySandbox;
}

export const CommunitySandboxMenu: React.FC<MenuProps> = ({ item }) => {
  const effects = useEffects();
  const actions = useActions();
  const { visible, setVisibility, position } = React.useContext(Context);

  const { sandbox } = item;
  const history = useHistory();
  const url = sandboxUrl(sandbox);

  return (
    <Menu.ContextMenu
      visible={visible}
      setVisibility={setVisibility}
      position={position}
      style={{ width: 200 }}
    >
      <MenuItem onSelect={() => history.push(url)}>Open Sandbox</MenuItem>
      <MenuItem
        onSelect={() => {
          window.open(`https://codesandbox.io${url}`, '_blank');
        }}
      >
        Open Sandbox in New Tab
      </MenuItem>
      <MenuItem
        onSelect={() => {
          actions.editor.forkExternalSandbox({
            sandboxId: sandbox.id,
            openInNewWindow: true,
          });
        }}
      >
        Fork Sandbox
      </MenuItem>
      <MenuItem
        onSelect={() => {
          effects.browser.copyToClipboard(`https://codesandbox.io${url}`);
        }}
      >
        Copy Sandbox Link
      </MenuItem>
    </Menu.ContextMenu>
  );
};
