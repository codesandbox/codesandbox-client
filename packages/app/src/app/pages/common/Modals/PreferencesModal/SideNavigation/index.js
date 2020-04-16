import React from 'react';
import { Element, Text, Stack } from '@codesandbox/components';
import css from '@styled-system/css';

export const SideNavigation = ({ menuItems, itemId, setItem }) => (
  <Element
    paddingBottom={8}
    css={css({
      backgroundColor: 'sideBar.background',
      borderWidth: 1,
      borderRightStyle: 'solid',
      borderColor: 'sideBar.border',
      width: 220,
    })}
  >
    <Text
      paddingLeft={6}
      paddingTop={6}
      paddingBottom={6}
      size={4}
      block
      weight="bold"
    >
      Preferences
    </Text>
    <Element style={{ position: 'relative' }}>
      {menuItems.map(item => (
        <Stack
          align="center"
          css={css({
            transition: '0.3s ease all',
            fontSize: 3,
            paddingX: 6,
            paddingY: 2,
            cursor: 'pointer',
            lineHeight: 1,
            color:
              itemId === item.id ? 'list.hoverForeground' : 'mutedForeground',
            '&:hover': {
              backgroundColor: 'list.hoverBackground',
              color: 'list.hoverForeground',
            },
          })}
          onClick={() => setItem({ itemId: item.id })}
          key={item.title}
          selected={itemId === item.id}
        >
          <Element marginRight={3}>{item.icon}</Element>
          {item.title}
        </Stack>
      ))}
    </Element>
  </Element>
);
