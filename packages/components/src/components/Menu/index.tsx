import {
  Menu as MenuBase,
  MenuButton as MenuButtonBase,
  MenuItem as MenuItemBase,
  MenuList as MenuListBase,
} from '@reach/menu-button';
import css from '@styled-system/css';
import deepmerge from 'deepmerge';
import React from 'react';
import { createGlobalStyle } from 'styled-components';

import { Button, Element, IconButton, List } from '../..';

const PortalStyles = createGlobalStyle(
  css({
    '[data-reach-menu]': {
      zIndex: 2,
    },

    '[data-reach-menu-list][data-component=MenuList]': {
      minWidth: 100,
      backgroundColor: 'menuList.background',
      borderRadius: 3,
      boxShadow: 2,
      overflow: 'hidden',
      border: '1px solid',
      borderColor: 'menuList.border',
      ':focus': { outline: 'none' },
      // override reach ui styles
      padding: 0,
    },

    '[data-reach-menu-item][data-component=MenuItem]': {
      fontSize: 2,
      paddingY: 2,
      paddingX: 3,
      cursor: 'pointer',
      outline: 'none',
      color: 'menuList.foreground',

      '&[data-selected]': {
        outline: 'none',
        backgroundColor: 'menuList.hoverBackground',
        color: 'menuList.foreground',
      },
      // override reach ui styles
      font: 'ineherit',
    },
  })
);
const Menu = ({ children, ...props }) => (
  <Element as={MenuBase} data-component="Menu" {...props}>
    <PortalStyles />

    {children}
  </Element>
);

const MenuButton = props => (
  <Button
    as={MenuButtonBase}
    variant="link"
    {...props}
    css={deepmerge({ width: 'auto' }, props.css || {})}
  >
    {props.children}
  </Button>
);

const MenuIconButton = props => <IconButton as={MenuButtonBase} {...props} />;

const MenuList = props => (
  <List as={MenuListBase} data-component="MenuList" {...props}>
    {props.children}
  </List>
);

const MenuItem = props => (
  <Element as={MenuItemBase} data-component="MenuItem" {...props} />
);

Menu.Button = MenuButton;
Menu.IconButton = MenuIconButton;
Menu.List = MenuList;
Menu.Item = MenuItem;

export { Menu };
