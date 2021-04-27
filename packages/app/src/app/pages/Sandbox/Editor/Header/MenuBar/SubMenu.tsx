import React, { useEffect, useState } from 'react';
import { Menu, Stack, Text } from '@codesandbox/components';
import ChevronRight from 'react-icons/lib/md/chevron-right';
import { MenuAppItems } from 'app/overmind/effects/vscode/composeMenuAppTree';
import { useEffects } from 'app/overmind';
import { renderTitle } from './renderTitle';

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

const SubMenu: React.FC<{
  payload: MenuAppItems[];
}> = ({ payload }) => {
  const { vscode } = useEffects();

  const [activeItem, setActiveItem] = useState<number | undefined>();
  const [debounceActiveItem, setDebounceActiveItem] = useState<
    number | undefined
  >();

  useEffect(
    function debounceOnLeaveState() {
      let timer: NodeJS.Timeout;

      if (activeItem === undefined) {
        /**
         * Ensure the user want to hide it
         */
        timer = setTimeout(() => {
          setDebounceActiveItem(undefined);
        }, 1000);
      } else {
        /**
         * Unsure it doesn't hide by any user's mistake
         */
        timer = setTimeout(() => {
          setDebounceActiveItem(activeItem);
        }, 100);
      }

      return () => {
        clearTimeout(timer);
      };
    },
    [activeItem]
  );

  return (
    <>
      {payload.map((group, groupIndex, innerArr) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={groupIndex}>
            {group.map(item => {
              const { label, renderMnemonic } = renderTitle(
                item.title || item.command.title
              );

              if (item.submenu) {
                return (
                  <Menu.Item
                    key={label}
                    aria-label={label}
                    onMouseEnter={() => setActiveItem(item.submenuId)}
                    onMouseLeave={() => setActiveItem(undefined)}
                  >
                    <Stack justify="space-between">
                      <Text size={2}>{renderMnemonic()}</Text>
                      <ChevronRight size="15" />
                    </Stack>

                    {debounceActiveItem === item.submenuId && (
                      <div
                        data-reach-menu-list
                        data-reach-submenu-list
                        data-component="MenuList"
                      >
                        <SubMenu
                          payload={(item.submenu as unknown) as MenuAppItems[]}
                        />
                      </div>
                    )}
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
                    <Text size={2}>{renderMnemonic()}</Text>

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
        );
      })}
    </>
  );
};

export { SubMenu };
