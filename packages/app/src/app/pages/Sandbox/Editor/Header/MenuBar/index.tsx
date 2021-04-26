import track from '@codesandbox/common/lib/utils/analytics';
import { useEffects } from 'app/overmind';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { MenuAppItems } from 'app/overmind/effects/vscode/composeMenuAppTree';
import { Icon, Menu, Stack } from '@codesandbox/components';
import ChevronRight from 'react-icons/lib/md/chevron-right';
import { Container, MenuHandler } from './elements';
import { renderTitle } from './renderTItle';
import { formatMenuData } from './formatMenuData';

export const MenuBar: FunctionComponent = () => {
  const [menu, setMenu] = useState<MenuAppItems>([]);

  const { vscode } = useEffects();
  const vscodeMenuItems = vscode.getMenuAppItems();

  useEffect(
    function loadMenuItemsFromVscode() {
      setMenu(vscodeMenuItems);
    },
    [vscodeMenuItems]
  );

  // const renderSubMenu = (submenu: Unpacked<MenuAppItems>['submenu']) =>
  //   submenu.map(subItem => {
  //     if (subItem.submenu) {
  //       return (
  //         <div className="menu">
  //           <p>
  //             {subItem.title} {'>'}
  //           </p>
  //           <div className="menu sub-menu">
  //             {renderSubMenu(subItem.submenu)}
  //           </div>
  //         </div>
  //       );
  //     }

  //     if (subItem.command) {
  //       const when = vscode.contextMatchesRules(subItem.command.when);
  //       const toggled = vscode.contextMatchesRules(subItem.command.toggled);
  //       const disabled = vscode.contextMatchesRules(
  //         subItem.command.precondition
  //       );

  //       if (when === false) return null;

  //       return (
  //         <div className="item">
  //           <button
  //             type="button"
  //             onClick={() => vscode.runCommand(subItem.command.id)}
  //             style={{
  //               opacity: disabled ? 1 : 0.4,
  //             }}
  //           >
  //             {'toggled' in subItem.command && toggled && '✅'}
  //             {subItem.command.title}
  //           </button>

  //           {vscode.lookupKeybinding(subItem.command.id)?.getLabel()}
  //         </div>
  //       );
  //     }

  //     return null;
  //   });

  const menuByGroup = formatMenuData(menu);

  return (
    // Explicitly use inline styles here to override the vscode styles
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <Container onClick={() => track('Editor - Click Menubar')}>
      <Menu>
        <MenuHandler as={Menu.Button} type="button">
          <Icon width={14} height={10} name="menu" />
        </MenuHandler>

        <Menu.List>
          {menuByGroup.map((group, groupIndex, innerArr) => (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={groupIndex}>
              {group.map(item => {
                const { label, renderMnemonic } = renderTitle(
                  item.title || item.command.title
                );

                if (item.submenu) {
                  return (
                    <Menu.Item key={label} aria-label={label}>
                      <Stack justify="space-between">
                        <span>{renderMnemonic()}</span>
                        <ChevronRight size="15" />
                      </Stack>
                    </Menu.Item>
                  );
                }

                return (
                  <Menu.Item
                    onClick={() => vscode.runCommand(item.command.id)}
                    key={label}
                    aria-label={label}
                  >
                    <Stack gap={4} justify="space-between">
                      <span>{renderMnemonic()}</span>

                      {item.command && (
                        <span>
                          {vscode.lookupKeybinding(item.command.id)?.getLabel()}
                        </span>
                      )}
                    </Stack>
                  </Menu.Item>
                );
              })}
              {groupIndex !== innerArr.length - 1 && <Menu.Divider />}
            </React.Fragment>
          ))}
        </Menu.List>
      </Menu>
    </Container>
  );
};
