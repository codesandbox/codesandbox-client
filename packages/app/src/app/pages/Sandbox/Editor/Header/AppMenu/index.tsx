// Explicitly use inline styles here to override the vscode styles
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import track from '@codesandbox/common/lib/utils/analytics';
import { useEffects } from 'app/overmind';
import React, { useEffect, useMemo, useState } from 'react';

import { MenuAppItems } from 'app/overmind/effects/vscode/composeMenuAppTree';
import { Icon, Menu } from '@codesandbox/components';

import { GlobalMenuStyle, MenuHandler } from './elements';
import { formatMenuData } from './formatMenuData';
import { SubMenu } from './SubMenu';

export const AppMenu: React.FC = () => {
  const [menu, setMenu] = useState<MenuAppItems>([]);
  const menuByGroup = useMemo(() => formatMenuData(menu), [menu]);

  const { vscode } = useEffects();
  const vscodeMenuItems = vscode.getMenuAppItems();

  useEffect(
    function loadMenuItemsFromVscode() {
      setMenu(vscodeMenuItems);
    },
    [vscodeMenuItems]
  );

  return (
    <div onClick={() => track('Editor - Click Menubar')}>
      <GlobalMenuStyle />

      <Menu>
        <MenuHandler as={Menu.Button} type="button">
          <Icon width={14} height={10} name="menu" />
        </MenuHandler>

        <Menu.List data-menu="AppMenu">
          {menuByGroup.length > 0 && <SubMenu root payload={menuByGroup} />}
        </Menu.List>
      </Menu>
    </div>
  );
};
