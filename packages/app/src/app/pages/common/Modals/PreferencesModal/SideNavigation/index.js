import React from 'react';
import { Element, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { ITEM_HEIGHT, Item, Selector } from './elements';

export const SideNavigation = ({ menuItems, itemId, setItem }) => {
  const itemIndex = menuItems.findIndex(item => item.id === itemId);

  return (
    <Element
      paddingBottom={8}
      css={css({
        backgroundColor: 'sideBar.border',
        minWidth: 220,
      })}
    >
      <Text padding={8} size={4} block weight="bold">
        Preferences
      </Text>
      <Element
        style={{ position: 'relative', height: menuItems.length * ITEM_HEIGHT }}
      >
        {menuItems.map((item, i) => (
          <Item
            onClick={() => setItem({ itemId: item.id })}
            key={item.title}
            selected={itemId === item.id}
            top={i * ITEM_HEIGHT}
          >
            <div style={{ height: ITEM_HEIGHT, marginRight: '0.5rem' }}>
              {item.icon}
            </div>
            {item.title}
          </Item>
        ))}
        <Selector offset={itemIndex * ITEM_HEIGHT} />
      </Element>
    </Element>
  );
};
