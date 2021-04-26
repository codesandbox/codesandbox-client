import React, { useContext } from 'react';
import { Menu, Stack } from '@codesandbox/components';
import ChevronRight from 'react-icons/lib/md/chevron-right';
import { MenuAppItems } from 'app/overmind/effects/vscode/composeMenuAppTree';
import { useEffects } from 'app/overmind';
import { renderTitle } from './renderTitle';

const SubMenu: React.FC<{
  group: MenuAppItems;
  groupIndex: number;
  innerArr: MenuAppItems[];
}> = ({ group, groupIndex, innerArr }) => {
  const { vscode } = useEffects();

  return (
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

              {/* <Menu.List>
                  {item.submenu.map((group, groupIndex, innerArr) => (
                    <SubMenu
                      group={group}
                      groupIndex={groupIndex}
                      innerArr={innerArr}
                    />
                  ))}
                </Menu.List> */}
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
  );
};

export { SubMenu };
