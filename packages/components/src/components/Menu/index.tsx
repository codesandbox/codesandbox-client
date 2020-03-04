import React from 'react';
import deepmerge from 'deepmerge';
import css from '@styled-system/css';
import * as ReachMenu from '@reach/menu-button';
import { createGlobalStyle } from 'styled-components';
import { Element, Button, IconButton, List } from '../..';

const Menu = ({ ...props }) => {
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

  return (
    <Element as={ReachMenu.Menu} data-component="Menu" {...props}>
      <PortalStyles />
      {props.children}
    </Element>
  );
};

const MenuButton = props => (
  <Button
    as={ReachMenu.MenuButton}
    variant="link"
    {...props}
    css={deepmerge({ width: 'auto' }, props.css || {})}
  >
    {props.children}
  </Button>
);

const MenuIconButton = props => (
  <IconButton as={ReachMenu.MenuButton} {...props} />
);

const MenuList = props => (
  <List as={ReachMenu.MenuList} data-component="MenuList" {...props}>
    {props.children}
  </List>
);

const MenuItem = props => (
  <Element as={ReachMenu.MenuItem} data-component="MenuItem" {...props} />
);

Menu.Button = MenuButton;
Menu.IconButton = MenuIconButton;
Menu.List = MenuList;
Menu.Item = MenuItem;

export { Menu };
