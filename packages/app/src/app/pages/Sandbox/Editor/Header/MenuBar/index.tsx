import track from '@codesandbox/common/lib/utils/analytics';
import { useEffects } from 'app/overmind';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { MenuAppItems } from 'app/overmind/effects/vscode/composeMenuAppTree';
import { Icon, Menu, Stack } from '@codesandbox/components';
import { Container, MenuHandler } from './elements';
import { renderTitle } from './renderTItle';

// TODO: find out a proper place to TS helpers
type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

export const MenuBar: FunctionComponent = () => {
  const [menu, setMenu] = useState<MenuAppItems>([]);

  console.log(menu);

  const { vscode } = useEffects();
  const vscodeMenuItems = vscode.getMenuAppItems();

  useEffect(
    function loadMenuData() {
      setMenu(vscodeMenuItems);
    },
    [vscodeMenuItems]
  );

  const renderSubMenu = (submenu: Unpacked<MenuAppItems>['submenu']) =>
    submenu.map(subItem => {
      if (subItem.submenu) {
        return (
          <div className="menu">
            <p>
              {subItem.title} {'>'}
            </p>
            <div className="menu sub-menu">
              {renderSubMenu(subItem.submenu)}
            </div>
          </div>
        );
      }

      if (subItem.command) {
        const when = vscode.contextMatchesRules(subItem.command.when);
        const toggled = vscode.contextMatchesRules(subItem.command.toggled);
        const disabled = vscode.contextMatchesRules(
          subItem.command.precondition
        );

        if (when === false) return null;

        return (
          <div className="item">
            <button
              type="button"
              onClick={() => vscode.runCommand(subItem.command.id)}
              style={{
                opacity: disabled ? 1 : 0.4,
              }}
            >
              {'toggled' in subItem.command && toggled && '✅'}
              {subItem.command.title}
            </button>

            {vscode.lookupKeybinding(subItem.command.id)?.getLabel()}
          </div>
        );
      }

      return null;
    });

  const groupMenu = menu
    .sort((a, b) => (a.group > b.group ? 1 : -1))
    .reduce((acc, curr) => {
      const { group } = curr;

      if (group in acc) {
        return { ...acc, [group]: [...acc[group], curr] };
      }

      return { ...acc, [group]: [curr] };
    }, {});

  const listGroupsMenu: MenuAppItems[] = Object.entries(groupMenu).reduce(
    (acc, [_, value]) => [...acc, value],
    []
  );

  return (
    // Explicitly use inline styles here to override the vscode styles
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <Container onClick={() => track('Editor - Click Menubar')}>
      <Menu>
        <MenuHandler as={Menu.Button} type="button">
          <Icon width={14} height={10} name="menu" />
        </MenuHandler>

        <Menu.List>
          {listGroupsMenu.map((group, groupIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={groupIndex}>
              {group
                .sort((a, b) => (a.order > b.order ? 1 : -1))
                .map(item => {
                  const { label, render } = renderTitle(
                    item.title || item.command.title
                  );

                  return (
                    <Menu.Item
                      onClick={() => vscode.runCommand(item.command.id)}
                      key={label}
                      aria-label={label}
                    >
                      {render()}

                      {item.command &&
                        vscode.lookupKeybinding(item.command.id)?.getLabel()}
                    </Menu.Item>
                  );
                })}
              {groupIndex !== listGroupsMenu.length - 1 && <Menu.Divider />}
            </React.Fragment>
          ))}
        </Menu.List>
      </Menu>
    </Container>
  );
};
