import React from 'react';
import deepmerge from 'deepmerge';
import css from '@styled-system/css';
import * as ReachMenu from '@reach/menu-button';
import {
  createGlobalStyle,
  css as styledcss,
  keyframes,
} from 'styled-components';
import { Element, Button, IconButton, List } from '../..';

const transitions = {
  slide: keyframes({
    from: {
      opacity: 0,
      transform: 'translateY(-4px)',
    },
  }),
  scale: keyframes({
    from: {
      opacity: 0,
      transform: 'scale(0.7)',
    },
  }),
};

const MenuContext = React.createContext({ trigger: null });

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
        transform: 'translateY(4px)',
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
    }),
    styledcss`
      [data-reach-menu-list][data-trigger=MenuButton] {
        animation: ${transitions.slide} 150ms ease-out;
        transform-origin: top;
      }
      [data-reach-menu-list][data-trigger=MenuIconButton] {
        animation: ${transitions.scale} 150ms ease-out;
        transform-origin: top left;
      } 
    `
  );

  const trigger = props.children[0].type.name;

  return (
    <Element as={ReachMenu.Menu} {...props}>
      <PortalStyles />
      <MenuContext.Provider value={{ trigger }}>
        {props.children}
      </MenuContext.Provider>
    </Element>
  );
};

const MenuButton = props => (
  <Button
    as={ReachMenu.MenuButton}
    variant="link"
    {...props}
    css={deepmerge(
      {
        width: 'auto',
        // disable scale feedback of buttons in menu
        // to make the menu feel less jumpy
        ':active:not(:disabled)': { transform: 'scale(1)' },
      },
      props.css || {}
    )}
  >
    {props.children}
  </Button>
);

const MenuIconButton = props => (
  <IconButton as={ReachMenu.MenuButton} {...props} />
);

const MenuList = props => {
  const { trigger } = React.useContext(MenuContext);
  return (
    <List
      as={ReachMenu.MenuList}
      data-component="MenuList"
      data-trigger={trigger}
      {...props}
    >
      {props.children}
    </List>
  );
};

const MenuItem = props => (
  <Element as={ReachMenu.MenuItem} data-component="MenuItem" {...props} />
);

Menu.Button = MenuButton;
Menu.IconButton = MenuIconButton;
Menu.List = MenuList;
Menu.Item = MenuItem;

export { Menu };
