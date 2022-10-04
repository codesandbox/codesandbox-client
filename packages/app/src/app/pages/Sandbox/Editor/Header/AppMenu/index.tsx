import track from '@codesandbox/common/lib/utils/analytics';
import { useEffects } from 'app/overmind';
import React, { useEffect, useMemo, useState } from 'react';

import { MenuAppItems } from 'app/overmind/effects/vscode/composeMenuAppTree';
import { Icon, Menu } from '@codesandbox/components';

import {
  GlobalMenuStyle,
  MenuHandler,
  HiddenElement,
  APP_MENU_ID,
} from './elements';
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
    <div>
      <GlobalMenuStyle />

      <Menu>
        <MenuHandler
          as={Menu.Button}
          type="button"
          onClick={() => track('Editor - Click Menubar')}
        >
          <Icon width={16} height={16} name="menu" />
        </MenuHandler>

        <Menu.List data-menu={APP_MENU_ID}>
          {/* It avoids interact with elements that are behind of 
          the menu, like the WorkspaceName/UpgradeToolTip.tsx */}
          <HiddenElement />
          {menuByGroup.length > 0 && <SubMenu root payload={menuByGroup} />}
        </Menu.List>
      </Menu>
    </div>
  );
};