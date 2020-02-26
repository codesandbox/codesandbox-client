import React from 'react';
import deepmerge from 'deepmerge';
import * as ReachMenu from '@reach/menu-button';
import { Element } from '../Element';
import { Button } from '../Button';
import { List } from '../List';

const Menu = ({ ...props }) => (
  <Element as={ReachMenu.Menu} {...props}>
    {props.children}
  </Element>
);

const MenuButton = ({ css = {}, ...props }) => (
  <Button
    // @ts-ignore
    as={ReachMenu.MenuButton}
    variant="link"
    css={deepmerge(css, { width: 'auto' })}
    {...props}
  >
    {props.children}
  </Button>
);

const MenuList = props => (
  <List
    as={ReachMenu.MenuList}
    css={{
      minWidth: 100,
      backgroundColor: 'menuList.background',
      borderRadius: 3,
      boxShadow: 2,
      overflow: 'hidden',
      border: '1px solid',
      borderColor: 'menuList.border',
      ':focus': { outline: 'none' },
    }}
    {...props}
  >
    {props.children}
  </List>
);

const MenuItem = props => (
  <Element
    as={ReachMenu.MenuItem}
    css={{
      fontSize: 2,
      paddingY: 2,
      paddingX: 3,
      cursor: 'pointer',
      outline: 'none',
      color: 'menuList.foreground',
      '&[data-selected]': {
        outline: 'none',
        backgroundColor: 'menuList.hoverBackground',
      },
    }}
    {...props}
  />
);

Menu.Button = MenuButton;
Menu.List = MenuList;
Menu.Item = MenuItem;

export { Menu };
