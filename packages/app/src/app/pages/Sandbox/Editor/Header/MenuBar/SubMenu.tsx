import React, { useEffect, useState } from 'react';
import { Menu, Stack, Text } from '@codesandbox/components';
import ChevronRight from 'react-icons/lib/md/chevron-right';
import { MenuAppItems } from 'app/overmind/effects/vscode/composeMenuAppTree';
import { useEffects } from 'app/overmind';
import { renderTitle } from './renderTitle';

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
        }, 600);
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
      {payload.map((group, groupIndex, innerArr) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={groupIndex}>
          {group.map(item => {
            const title = item.title || item.command.title;
            const { label, renderMnemonic } = renderTitle(title);

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

            const when = vscode.contextMatchesRules(item.command.when);
            if (when === false) return null;

            const renderToggle = () => {
              if ('toggled' in item.command) {
                const command = item.command.toggled;
                const toggled = vscode.contextMatchesRules(command);

                // TODO
                return toggled ? '✅' : '⛔️';
              }

              return null;
            };

            const content = (
              <Stack gap={4} justify="space-between">
                <Text size={2}>
                  {renderToggle()}
                  {renderMnemonic()}
                </Text>

                {item.command && (
                  <Text size={2}>
                    {vscode.lookupKeybinding(item.command.id)?.getLabel()}
                  </Text>
                )}
              </Stack>
            );

            const disabled =
              vscode.contextMatchesRules(item.command.precondition) === false;
            if (disabled) {
              return (
                <Menu.Item key={label} aria-label={label} data-disabled>
                  {content}
                </Menu.Item>
              );
            }

            return (
              <Menu.Item
                onClick={() => vscode.runCommand(item.command.id)}
                key={label}
                aria-label={label}
              >
                {content}
              </Menu.Item>
            );
          })}

          {groupIndex !== innerArr.length - 1 && <Menu.Divider />}
        </React.Fragment>
      ))}
    </>
  );
};

export { SubMenu };
