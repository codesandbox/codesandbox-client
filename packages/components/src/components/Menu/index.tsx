import React from 'react';
import deepmerge from 'deepmerge';
import css from '@styled-system/css';
import {
  createGlobalStyle,
  css as styledcss,
  keyframes,
} from 'styled-components';
import { Link } from 'react-router-dom';
import * as ReachMenu from './reach-menu.fork';
import { Element, Button, IconButton } from '../..';

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
      fontWeight: 400,
    },
    '[data-reach-menu] > div': {
      borderRadius: '4px',
    },
    '[data-reach-menu][hidden],[data-reach-menu-popover][hidden]': {
      display: 'none',
    },
    '[data-reach-menu-list][data-component=MenuList]': {
      minWidth: 200,
      backgroundColor: 'menuList.background',

      boxShadow: 1,
      overflow: 'hidden',
      border: 'none',
      ':focus': { outline: 'none' },
      transform: 'translateY(4px)',
      // override reach ui styles
      padding: '4px 0',
    },
    '[data-reach-menu-item][data-component=MenuItem], [data-reach-menu-item][data-component=MenuLink]': {
      fontSize: '13.6px',
      paddingY: 2,
      paddingX: 3,
      cursor: 'default',
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
    },
    '[data-component="MenuItem"][disabled]': {
      fontSize: '13.6px',
      paddingY: 2,
      paddingX: 3,
      cursor: 'not-allowed',
      backgroundColor: 'transparent',
      color: 'inherit',
      opacity: 0.5,
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

  const menuRef = React.useRef<HTMLDivElement>(null);
  const [computedMenuHeight, setComputedMenuHeight] = React.useState<number>(0);
  const [computedMenuWidth, setComputedMenuWidth] = React.useState<number>(0);
  const [menuIsReadyToShow, setMenuIsReadyToShow] = React.useState(false);

  // enables keyboard navigation
  React.useEffect(() => {
    setTimeout(() => {
      if (!visible && !menuRef.current) return;
      menuRef.current.focus();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, menuRef.current]);

  React.useEffect(() => {
    // for the initial render, the menu is not ready to be shown
    // because the element height cannot be computed
    setMenuIsReadyToShow(false);
    setTimeout(() => {
      // once the ref is set and the menu is rendered in the dom
      // use its height to adjust the position of the popover
      if (menuRef.current) {
        const boundingRect = menuRef.current.getBoundingClientRect();

        setComputedMenuHeight(boundingRect.height);
        setComputedMenuWidth(boundingRect.width);
        setMenuIsReadyToShow(true);
      }
    });
  }, [position.x, position.y]);

  if (!visible) return null;

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
                  window.innerWidth -
                    (popoverRect.width || computedMenuWidth) -
                    16
                ),
                top: Math.min(
                  position.y,
                  window.innerHeight -
                    (popoverRect.height || computedMenuHeight) -
                    16
                ),
              })}
            >
              <Menu.List
                style={{ visibility: menuIsReadyToShow ? 'visible' : 'hidden' }}
                ref={menuRef}
              >
                {props.children}
              </Menu.List>
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
        transform: 'scale(1)',
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

interface MenuListProps {
  children: any;
  style?: React.CSSProperties;
  css?: Object;
}

const MenuList = React.forwardRef<HTMLDivElement, MenuListProps>(
  ({ style, children, ...props }, ref) => {
    const { trigger, portal } = React.useContext(MenuContext);
    return (
      <ReachMenu.MenuList
        style={style}
        ref={ref}
        data-component="MenuList"
        data-trigger={trigger}
        portal={portal}
        {...props}
      >
        {children}
      </ReachMenu.MenuList>
    );
  }
);

const MenuItem = (props: any) => {
  if (props.disabled) {
    return <Element data-component="MenuItem" {...props} />;
  }

  return (
    <Element as={ReachMenu.MenuItem} data-component="MenuItem" {...props} />
  );
};

type MenuLinkProps = {
  to?: string;
  href?: string;
  title?: string;
  children: any;
};

const MenuLink: React.FunctionComponent<MenuLinkProps> = ({
  children,
  to,
  title,
  href,
}) => {
  if (to) {
    return (
      <ReachMenu.MenuLink
        data-component="MenuLink"
        as={Link}
        to={to}
        title={title}
      >
        {children}
      </ReachMenu.MenuLink>
    );
  }

  return (
    <ReachMenu.MenuLink
      data-component="MenuLink"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
    >
      {children}
    </ReachMenu.MenuLink>
  );
};

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
Menu.Link = MenuLink;
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
