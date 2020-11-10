import React from 'react';
import deepmerge from 'deepmerge';
import css from '@styled-system/css';
import {
  createGlobalStyle,
  css as styledcss,
  keyframes,
} from 'styled-components';
import * as ReachMenu from './reach-menu.fork';
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

const MenuContext = React.createContext({ trigger: null, portal: true });

export const MenuStyles = createGlobalStyle(
  css({
    '[data-reach-menu]': {
      zIndex: 11, // TODO: we need to sort out our z indexes!
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
    },
    '[data-reach-menu][hidden],[data-reach-menu-popover][hidden]': {
      display: 'none',
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
      '&[data-selected], :hover': {
        outline: 'none',
        backgroundColor: 'menuList.hoverBackground',
        color: 'menuList.hoverForeground',
      },
      '&[data-disabled], &[data-disabled]:hover': {
        outline: 'none',
        backgroundColor: 'transparent',
        color: 'inherit',
        opacity: 0.5,
        cursor: 'not-allowed',
      },
      // override reach ui styles
      font: 'inherit',
    },
    '[data-component=MenuDivider]': {
      margin: 0,
      border: 'none',
      borderBottom: '1px solid',
      borderColor: 'menuList.border',
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

const Menu = ({ ...props }) => {
  const trigger = props.children[0].type.name;

  return (
    <Element as={ReachMenu.Menu} {...props}>
      <MenuContext.Provider value={{ trigger, portal: true }}>
        {props.children}
      </MenuContext.Provider>
    </Element>
  );
};

const ESC = 27;
const ALT = 18;
const ENTER = 13;
const SPACE = 32;

const ContextMenu = ({ visible, setVisibility, position, ...props }) => {
  React.useEffect(() => {
    // close when user clicks outside or scrolls away
    const handler = () => {
      if (visible) setVisibility(false);
    };

    document.addEventListener('click', handler);

    return () => {
      document.removeEventListener('click', handler);
    };
  }, [visible, setVisibility]);

  // handle key down events - close on escape + disable the rest
  // TODO: handle arrow keys and space/enter.
  React.useEffect(() => {
    const handler = event => {
      if (!visible) return;
      if (
        event.keyCode === ESC ||
        event.keyCode === ALT ||
        event.keyCode === SPACE ||
        event.keyCode === ENTER
      )
        setVisibility(false);
      event.preventDefault();
    };

    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  });

  if (!visible) return null;

  const numberOfItems = React.Children.count(props.children);
  const SUGGESTED_ITEM_HEIGHT = 36;
  const suggestedHeight = numberOfItems * SUGGESTED_ITEM_HEIGHT;
  const suggestedWidth = 180;

  return (
    <Element as={ReachMenu.Menu} {...props}>
      {({ isExpanded, dispatch }) => {
        if (visible && !isExpanded) {
          // keep it open if prop is set to visible
          dispatch({ type: 'OPEN_MENU_AT_FIRST_ITEM' });
        }

        return (
          <MenuContext.Provider value={{ trigger: null, portal: false }}>
            <ReachMenu.MenuPopover
              position={(targetRect, popoverRect) => ({
                position: 'fixed',
                left: Math.min(
                  position.x,
                  window.innerWidth - (popoverRect.width || suggestedWidth) - 16
                ),
                top: Math.min(
                  position.y,
                  window.innerHeight -
                    (popoverRect.height || suggestedHeight) -
                    16
                ),
              })}
            >
              <Menu.List>{props.children}</Menu.List>
            </ReachMenu.MenuPopover>
          </MenuContext.Provider>
        );
      }}
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
  const { trigger, portal } = React.useContext(MenuContext);
  return (
    <List
      as={ReachMenu.MenuList}
      data-component="MenuList"
      data-trigger={trigger}
      portal={portal}
      {...props}
    >
      {props.children}
    </List>
  );
};

const MenuItem = props => (
  <Element as={ReachMenu.MenuItem} data-component="MenuItem" {...props} />
);

const MenuDivider = props => (
  <Element
    as="hr"
    data-component="MenuDivider"
    style={{ margin: '0.25rem 0' }}
    {...props}
  />
);

Menu.Button = MenuButton;
Menu.IconButton = MenuIconButton;
Menu.List = MenuList;
Menu.Item = MenuItem;
Menu.Divider = MenuDivider;
Menu.ContextMenu = ContextMenu;

export const isMenuClicked = event => {
  // don't trigger comment if you click on the menu
  // we handle this because of an upstream
  // bug in reach/menu-button
  const target = event.target as HTMLElement;

  if (
    target.tagName === 'BUTTON' ||
    target.tagName === 'svg' ||
    target.tagName === 'path' ||
    target.className.includes('no-click')
  ) {
    return true;
  }

  return false;
};

export { Menu };
