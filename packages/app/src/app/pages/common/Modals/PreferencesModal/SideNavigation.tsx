import { Element, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { ComponentType, FunctionComponent } from 'react';

import { useAppState, useActions } from 'app/overmind';

type MenuItem = {
  Icon: ComponentType;
  id: string;
  title: string;
};
type Props = {
  menuItems: MenuItem[];
};
export const SideNavigation: FunctionComponent<Props> = ({ menuItems }) => {
  const { itemId = 'appearance' } = useAppState().preferences;
  const { itemIdChanged } = useActions().preferences;

  return (
    <Element css={css({ width: 244 })} paddingBottom={8}>
      <Text
        block
        paddingBottom={6}
        paddingLeft={5}
        paddingTop={6}
        size={4}
        weight="regular"
        css={css({
          color: 'sideBarSectionHeader.foreground',
        })}
      >
        Preferences
      </Text>

      <Element style={{ position: 'relative' }}>
        {menuItems.map(({ Icon, id, title }) => (
          <Stack
            align="center"
            css={css({
              transition: '0.3s ease all',
              fontSize: 3,
              paddingX: 5,
              paddingY: 3,
              cursor: 'pointer',
              lineHeight: 1,
              color:
                itemId === id
                  ? 'list.hoverForeground'
                  : 'sideBarSectionHeader.foreground',
              '&:hover': {
                backgroundColor: 'list.hoverBackground',
                color: 'list.hoverForeground',
              },
            })}
            key={title}
            onClick={() => itemIdChanged(id)}
          >
            <Element marginRight={4}>
              <Icon />
            </Element>

            {title}
          </Stack>
        ))}
      </Element>
    </Element>
  );
};
