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
      width: 200,
    })}
  >
    <Text
      paddingLeft={6}
      paddingTop={6}
      paddingBottom={4}
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
            cursor: 'pointer',
            height: 6,
            marginBottom: 2,
            color:
              itemId === item.id ? 'sideBar.foreground' : 'mutedForeground',
            '&:hover': {
              backgroundColor: 'activityBarBadge.background',
              color: 'sideBar.foreground',
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
