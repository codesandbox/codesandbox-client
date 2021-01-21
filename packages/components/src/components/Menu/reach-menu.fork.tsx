/* eslint-disable */

/**
 * Welcome to @reach/menu-button!
 *
 * An accessible dropdown menu for the common dropdown menu button design
 * pattern.
 *
 * @see Docs     https://reacttraining.com/reach-ui/menu-button
 * @see Source   https://github.com/reach/reach-ui/tree/master/packages/menu-button
 * @see WAI-ARIA https://www.w3.org/TR/wai-aria-practices-1.2/#menubutton
 *
 * TODO: Fix flash when opening a menu button on a screen with another open menu
 */

import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useId } from '@reach/auto-id';
import Popover, { Position } from '@reach/popover';
import {
  createDescendantContext,
  Descendant,
  DescendantProvider,
  useDescendant,
  useDescendants,
  useDescendantsInit,
  useDescendantKeyDown,
} from '@reach/descendants';
import {
  checkStyles,
  createNamedContext,
  forwardRefWithAs,
  getOwnerDocument,
  isFunction,
  isString,
  makeId,
  noop,
  useForkedRef,
  usePrevious,
  wrapEvent,
} from '@reach/utils';

const __DEV__ = false;
////////////////////////////////////////////////////////////////////////////////
// Actions

const CLEAR_SELECTION_INDEX = 'CLEAR_SELECTION_INDEX';
const CLICK_MENU_ITEM = 'CLICK_MENU_ITEM';
const CLOSE_MENU = 'CLOSE_MENU';
const OPEN_MENU_AT_FIRST_ITEM = 'OPEN_MENU_AT_FIRST_ITEM';
const OPEN_MENU_CLEARED = 'OPEN_MENU_CLEARED';
const SEARCH_FOR_ITEM = 'SEARCH_FOR_ITEM';
const SELECT_ITEM_AT_INDEX = 'SELECT_ITEM_AT_INDEX';
const SET_BUTTON_ID = 'SET_BUTTON_ID';

const MenuDescendantContext = createDescendantContext<MenuButtonDescendant>(
  'MenuDescendantContext'
);
const MenuContext = createNamedContext<InternalMenuContextValue>(
  'MenuContext',
  {} as InternalMenuContextValue
);

const initialState: MenuButtonState = {
  // The button ID is needed for aria controls and can be set directly and
  // updated for top-level use via context. Otherwise a default is set by useId.
  // TODO: Consider deprecating direct ID in 1.0 in favor of id at the top level
  //       for passing deterministic IDs to descendent components.
  buttonId: null,

  // Whether or not the menu is expanded
  isExpanded: false,

  // When a user begins typing a character string, the selection will change if
  // a matching item is found
  typeaheadQuery: '',

  // The index of the current selected item. When the selection is cleared a
  // value of -1 is used.
  selectionIndex: -1,
};

////////////////////////////////////////////////////////////////////////////////

/**
 * Menu
 *
 * The wrapper component for the other components. No DOM element is rendered.
 *
 * @see Docs https://reacttraining.com/reach-ui/menu-button#menu
 */
export const Menu: React.FC<MenuProps> = ({
  id,
  defaultOpen = false,
  children,
}) => {
  let buttonRef = useRef(null);
  let menuRef = useRef(null);
  let popoverRef = useRef(null);
  let [descendants, setDescendants] = useDescendantsInit<
    MenuButtonDescendant
  >();

  let [state, dispatch] = useReducer(reducer, {
    ...initialState,
    isExpanded: defaultOpen,
  });
  let _id = useId(id);
  let menuId = id || makeId('menu', _id);

  // We use an event listener attached to the window to capture outside clicks
  // that close the menu. We don't want the initial button click to trigger this
  // when a menu is closed, so we can track this behavior in a ref for now.
  // We shouldn't need this when we rewrite with state machine logic.
  let buttonClickedRef = useRef(false);

  // We will put children callbacks in a ref to avoid triggering endless render
  // loops when using render props if the app code doesn't useCallback
  // https://github.com/reach/reach-ui/issues/523
  let selectCallbacks = useRef([]);

  // If the popover's position overlaps with an option when the popover
  // initially opens, the mouseup event will trigger a select. To prevent that,
  // we decide the menu button is only ready to make a selection if the pointer
  // moves first, otherwise the user is just registering the initial button
  // click rather than selecting an item. This is similar to a native select
  // on most platforms, and our menu button popover works similarly.
  let readyToSelect = useRef(false);

  let context: InternalMenuContextValue = {
    buttonRef,
    dispatch,
    menuId,
    menuRef,
    popoverRef,
    buttonClickedRef,
    readyToSelect,
    selectCallbacks,
    state,
  };

  // When the menu is open, focus is placed on the menu itself so that
  // keyboard navigation is still possible.
  useEffect(() => {
    if (state.isExpanded) {
      // @ts-ignore
      window.__REACH_DISABLE_TOOLTIPS = true;
      window.requestAnimationFrame(() => {
        focus(menuRef.current);
      });
    } else {
      // We want to ignore the immediate focus of a tooltip so it doesn't pop
      // up again when the menu closes, only pops up when focus returns again
      // to the tooltip (like native OS tooltips).
      // @ts-ignore
      window.__REACH_DISABLE_TOOLTIPS = false;
    }
  }, [state.isExpanded]);

  useEffect(() => checkStyles('menu-button'), []);

  return (
    <DescendantProvider
      context={MenuDescendantContext}
      items={descendants}
      set={setDescendants}
    >
      <MenuContext.Provider value={context}>
        {isFunction(children)
          ? children({
              isExpanded: state.isExpanded,
              // TODO: Remove in 1.0
              isOpen: state.isExpanded,
              dispatch,
            })
          : children}
      </MenuContext.Provider>
    </DescendantProvider>
  );
};

/**
 * @see Docs https://reacttraining.com/reach-ui/menu-button#menu-props
 */
export interface MenuProps {
  /**
   * Requires two children: a `<MenuButton>` and a `<MenuList>`.
   *
   * @see Docs https://reacttraining.com/reach-ui/menu-button#menu-children
   */
  children:
    | React.ReactNode
    | ((
        props: MenuContextValue & {
          // TODO: Remove in 1.0
          isOpen: boolean;
          dispatch: any;
        }
      ) => React.ReactNode);
  id?: string;
  defaultOpen?: boolean;
}

if (__DEV__) {
  Menu.displayName = 'Menu';
  Menu.propTypes = {
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  };
}

////////////////////////////////////////////////////////////////////////////////

/**
 * MenuButton
 *
 * Wraps a DOM `button` that toggles the opening and closing of the dropdown
 * menu. Must be rendered inside of a `<Menu>`.
 *
 * @see Docs https://reacttraining.com/reach-ui/menu-button#menubutton
 */
export const MenuButton = forwardRefWithAs<MenuButtonProps, 'button'>(
  function MenuButton(
    { as: Comp = 'button', onKeyDown, onMouseDown, id, ...props },
    forwardedRef
  ) {
    let {
      buttonRef,
      buttonClickedRef,
      menuId,
      state: { buttonId, isExpanded },
      dispatch,
    } = useContext(MenuContext);
    let ref = useForkedRef(buttonRef, forwardedRef);

    useEffect(() => {
      let newButtonId =
        id != null
          ? id
          : menuId
          ? makeId('menu-button', menuId)
          : 'menu-button';
      if (buttonId !== newButtonId) {
        dispatch({
          type: SET_BUTTON_ID,
          payload: newButtonId,
        });
      }
    }, [buttonId, dispatch, id, menuId]);

    function handleKeyDown(event: React.KeyboardEvent) {
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          event.preventDefault(); // prevent scroll
          dispatch({ type: OPEN_MENU_AT_FIRST_ITEM });
          break;
        case 'Enter':
        case ' ':
          dispatch({ type: OPEN_MENU_AT_FIRST_ITEM });
          break;
        default:
          break;
      }
    }

    function handleMouseDown(event: React.MouseEvent) {
      if (!isExpanded) {
        buttonClickedRef.current = true;
      }
      if (isRightClick(event.nativeEvent)) {
        return;
      } else if (isExpanded) {
        dispatch({ type: CLOSE_MENU, payload: { buttonRef } });
      } else {
        dispatch({ type: OPEN_MENU_CLEARED });
      }
    }

    return (
      <Comp
        // When the menu is displayed, the element with role `button` has
        // `aria-expanded` set to `true`. When the menu is hidden, it is
        // recommended that `aria-expanded` is not present.
        // https://www.w3.org/TR/wai-aria-practices-1.2/#menubutton
        aria-expanded={isExpanded ? true : undefined}
        // The element with role `button` has `aria-haspopup` set to either
        // `"menu"` or `true`.
        // https://www.w3.org/TR/wai-aria-practices-1.2/#menubutton
        aria-haspopup
        // Optionally, the element with role `button` has a value specified for
        // `aria-controls` that refers to the element with role `menu`.
        // https://www.w3.org/TR/wai-aria-practices-1.2/#menubutton
        aria-controls={menuId}
        {...props}
        ref={ref}
        data-reach-menu-button=""
        id={buttonId || undefined}
        onKeyDown={wrapEvent(onKeyDown, handleKeyDown)}
        onMouseDown={wrapEvent(onMouseDown, handleMouseDown)}
        type="button"
      />
    );
  }
);

/**
 * @see Docs https://reacttraining.com/reach-ui/menu-button#menubutton-props
 */
export type MenuButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * Accepts any renderable content.
   *
   * @see Docs https://reacttraining.com/reach-ui/menu-button#menubutton-children
   */
  children: React.ReactNode;
};

if (__DEV__) {
  MenuButton.displayName = 'MenuButton';
  MenuButton.propTypes = {
    children: PropTypes.node,
  };
}

////////////////////////////////////////////////////////////////////////////////

/**
 * MenuItemImpl
 *
 * MenuItem and MenuLink share most of the same functionality captured here.
 */
const MenuItemImpl = forwardRefWithAs<MenuItemImplProps, 'div'>(
  function MenuItemImpl(
    {
      as: Comp,
      index: indexProp,
      isLink = false,
      onClick,
      onDragStart,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onMouseMove,
      onMouseUp,
      onSelect,
      valueText: valueTextProp,
      ...props
    },
    forwardedRef
  ) {
    let {
      buttonRef,
      dispatch,
      readyToSelect,
      selectCallbacks,
      state: { selectionIndex, isExpanded },
    } = useContext(MenuContext);

    let ownRef = useRef<HTMLElement | null>(null);

    // After the ref is mounted to the DOM node, we check to see if we have an
    // explicit valueText prop before looking for the node's textContent for
    // typeahead functionality.
    let [valueText, setValueText] = useState(valueTextProp || '');
    let setValueTextFromDom = useCallback(
      node => {
        if (node) {
          ownRef.current = node;
          if (
            !valueTextProp ||
            (node.textContent && valueText !== node.textContent)
          ) {
            setValueText(node.textContent);
          }
        }
      },
      [valueText, valueTextProp]
    );

    let ref = useForkedRef(forwardedRef, setValueTextFromDom);

    let mouseEventStarted = useRef(false);

    let index = useDescendant(
      {
        element: ownRef.current!,
        key: valueText,
        isLink,
      },
      MenuDescendantContext,
      indexProp
    );
    let isSelected = index === selectionIndex;

    // Update the callback ref array on every render
    selectCallbacks.current[index] = onSelect;

    function select() {
      focus(buttonRef.current);
      if (onSelect) {
        const result = onSelect();
        if (result && result.CLOSE_MENU === false) {
          // don't dispatch event
        } else {
          dispatch({ type: CLICK_MENU_ITEM });
        }
      } else {
        dispatch({ type: CLICK_MENU_ITEM });
      }
    }

    function handleClick(event: React.MouseEvent) {
      if (isLink && !isRightClick(event.nativeEvent)) {
        select();
      }
    }

    function handleDragStart(event: React.MouseEvent) {
      // Because we don't preventDefault on mousedown for links (we need the
      // native click event), clicking and holding on a link triggers a
      // dragstart which we don't want.
      if (isLink) {
        event.preventDefault();
      }
    }

    function handleMouseDown(event: React.MouseEvent) {
      if (isRightClick(event.nativeEvent)) return;

      if (isLink) {
        // Signal that the mouse is down so we can react call the right function
        // if the user is clicking on a link.
        mouseEventStarted.current = true;
      } else {
        event.preventDefault();
      }
    }

    function handleMouseEnter(event: React.MouseEvent) {
      if (!isSelected && index != null) {
        dispatch({ type: SELECT_ITEM_AT_INDEX, payload: { index } });
      }
    }

    function handleMouseLeave(event: React.MouseEvent) {
      // Clear out selection when mouse over a non-menu item child.
      dispatch({ type: CLEAR_SELECTION_INDEX });
    }

    function handleMouseMove() {
      readyToSelect.current = true;
      if (!isSelected && index != null) {
        dispatch({ type: SELECT_ITEM_AT_INDEX, payload: { index } });
      }
    }

    function handleMouseUp(event: React.MouseEvent) {
      if (!readyToSelect.current) {
        readyToSelect.current = true;
        return;
      }
      if (isRightClick(event.nativeEvent)) return;

      if (isLink) {
        // If a mousedown event was initiated on a menu link followed by a
        // mouseup event on the same link, we do nothing; a click event will
        // come next and handle selection. Otherwise, we trigger a click event.
        if (mouseEventStarted.current) {
          mouseEventStarted.current = false;
        } else if (ownRef.current) {
          ownRef.current.click();
        }
      } else {
        select();
      }
    }

    // When the menu closes, reset readyToSelect for the next interaction.
    useEffect(() => {
      if (!isExpanded) {
        readyToSelect.current = false;
      }
    }, [isExpanded, readyToSelect]);

    // Any time a mouseup event occurs anywhere in the document, we reset the
    // mouseEventStarted ref so we can check it again when needed.
    useEffect(() => {
      let ownerDocument = getOwnerDocument(ownRef.current) || document;
      let listener = () => (mouseEventStarted.current = false);
      ownerDocument.addEventListener('mouseup', listener);
      return () => ownerDocument.removeEventListener('mouseup', listener);
    }, []);

    return (
      <Comp
        role="menuitem"
        id={useMenuItemId(index)}
        tabIndex={-1}
        {...props}
        ref={ref}
        data-reach-menu-item=""
        data-selected={isSelected ? '' : undefined}
        data-valuetext={valueText}
        onClick={wrapEvent(onClick, handleClick)}
        onDragStart={wrapEvent(onDragStart, handleDragStart)}
        onMouseDown={wrapEvent(onMouseDown, handleMouseDown)}
        onMouseEnter={wrapEvent(onMouseEnter, handleMouseEnter)}
        onMouseLeave={wrapEvent(onMouseLeave, handleMouseLeave)}
        onMouseMove={wrapEvent(onMouseMove, handleMouseMove)}
        onMouseUp={wrapEvent(onMouseUp, handleMouseUp)}
      />
    );
  }
);

export type MenuItemImplProps = {
  /**
   * You can put any type of content inside of a `<MenuItem>`.
   *
   * @see Docs https://reacttraining.com/reach-ui/menu-button#menuitem-children
   */
  children: React.ReactNode;
  /**
   * Callback that fires when a `MenuItem` is selected.
   *
   * @see Docs https://reacttraining.com/reach-ui/menu-button#menuitem-onselect
   */
  onSelect(): void | { CLOSE_MENU: boolean };
  index?: number;
  isLink?: boolean;
  valueText?: string;
};

////////////////////////////////////////////////////////////////////////////////

/**
 * MenuItem
 *
 * Handles menu selection. Must be a direct child of a `<MenuList>`.
 *
 * @see Docs https://reacttraining.com/reach-ui/menu-button#menuitem
 */
export const MenuItem = forwardRefWithAs<MenuItemProps, 'div'>(
  function MenuItem({ as = 'div', ...props }, forwardedRef) {
    return <MenuItemImpl {...props} ref={forwardedRef} as={as} />;
  }
);

/**
 * @see Docs https://reacttraining.com/reach-ui/menu-button#menuitem-props
 */
export type MenuItemProps = Omit<MenuItemImplProps, 'isLink'>;

if (__DEV__) {
  MenuItem.displayName = 'MenuItem';
  MenuItem.propTypes = {
    as: PropTypes.any,
    onSelect: PropTypes.func.isRequired,
  };
}

////////////////////////////////////////////////////////////////////////////////

/**
 * MenuItems
 *
 * A low-level wrapper for menu items. Compose it with `MenuPopover` for more
 * control over the nested components and their rendered DOM nodes, or if you
 * need to nest arbitrary components between the outer wrapper and your list.
 *
 * @see Docs https://reacttraining.com/reach-ui/menu-button#menuitems
 */
export const MenuItems = forwardRefWithAs<MenuItemsProps, 'div'>(
  function MenuItems(
    { as: Comp = 'div', children, id, onKeyDown, ...props },
    forwardedRef
  ) {
    const {
      menuId,
      dispatch,
      buttonRef,
      menuRef,
      selectCallbacks,
      state: { isExpanded, buttonId, selectionIndex, typeaheadQuery },
    } = useContext(MenuContext);
    const menuItems = useDescendants(MenuDescendantContext);
    const ref = useForkedRef(menuRef, forwardedRef);

    useEffect(() => {
      // Respond to user char key input with typeahead
      const match = findItemFromTypeahead(menuItems, typeaheadQuery);
      if (typeaheadQuery && match != null) {
        dispatch({
          type: SELECT_ITEM_AT_INDEX,
          payload: { index: match },
        });
      }
      let timeout = window.setTimeout(
        () =>
          typeaheadQuery && dispatch({ type: SEARCH_FOR_ITEM, payload: '' }),
        1000
      );
      return () => window.clearTimeout(timeout);
    }, [dispatch, menuItems, typeaheadQuery]);

    const prevMenuItemsLength = usePrevious(menuItems.length);
    const prevSelected = usePrevious(menuItems[selectionIndex]);
    const prevSelectionIndex = usePrevious(selectionIndex);

    useEffect(() => {
      if (selectionIndex > menuItems.length - 1) {
        // If for some reason our selection index is larger than our possible
        // index range (let's say the last item is selected and the list
        // dynamically updates), we need to select the last item in the list.
        dispatch({
          type: SELECT_ITEM_AT_INDEX,
          payload: { index: menuItems.length - 1 },
        });
      } else if (
        // Checks if
        //  - menu length has changed
        //  - selection index has not changed BUT selected item has changed
        //
        // This prevents any dynamic adding/removing of menu items from actually
        // changing a user's expected selection.
        prevMenuItemsLength !== menuItems.length &&
        selectionIndex > -1 &&
        prevSelected &&
        prevSelectionIndex === selectionIndex &&
        menuItems[selectionIndex] !== prevSelected
      ) {
        dispatch({
          type: SELECT_ITEM_AT_INDEX,
          payload: {
            index: menuItems.findIndex(i => i.key === prevSelected.key),
          },
        });
      }
    }, [
      dispatch,
      menuItems,
      prevMenuItemsLength,
      prevSelected,
      prevSelectionIndex,
      selectionIndex,
    ]);

    let handleKeyDown = wrapEvent(
      function handleKeyDown(event: React.KeyboardEvent) {
        let { key } = event;

        if (!isExpanded) {
          return;
        }

        switch (key) {
          case 'Enter':
          case ' ':
            let selected = menuItems.find(
              item => item.index === selectionIndex
            );
            // For links, the Enter key will trigger a click by default, but for
            // consistent behavior across menu items we'll trigger a click when
            // the spacebar is pressed.
            if (selected) {
              if (selected.isLink && selected.element) {
                selected.element.click();
              } else {
                event.preventDefault();
                // Focus the button first by default when an item is selected.
                // We fire the onSelect callback next so the app can manage
                // focus if needed.
                focus(buttonRef.current);
                selectCallbacks.current[selected.index] &&
                  selectCallbacks.current[selected.index]();
                dispatch({ type: CLICK_MENU_ITEM });
              }
            }
            break;
          case 'Escape':
            focus(buttonRef.current);
            dispatch({ type: CLOSE_MENU, payload: { buttonRef } });
            break;
          case 'Tab':
            // prevent leaving
            event.preventDefault();
            break;
          default:
            // Check if a user is typing some char keys and respond by setting
            // the query state.
            if (isString(key) && key.length === 1) {
              const query = typeaheadQuery + key.toLowerCase();
              dispatch({
                type: SEARCH_FOR_ITEM,
                payload: query,
              });
            }
            break;
        }
      },
      useDescendantKeyDown(MenuDescendantContext, {
        currentIndex: selectionIndex,
        orientation: 'vertical',
        rotate: false,
        callback: (index: number) => {
          dispatch({
            type: SELECT_ITEM_AT_INDEX,
            payload: { index },
          });
        },
        key: 'index',
      })
    );

    return (
      // TODO: Should probably file a but in jsx-a11y, but this is correct
      // according to https://www.w3.org/TR/wai-aria-practices-1.2/examples/menu-button/menu-button-actions-active-descendant.html
      // eslint-disable-next-line jsx-a11y/aria-activedescendant-has-tabindex
      <Comp
        // Refers to the descendant menuitem element that is visually indicated
        // as focused.
        // https://www.w3.org/TR/wai-aria-practices-1.2/examples/menu-button/menu-button-actions-active-descendant.html
        aria-activedescendant={useMenuItemId(selectionIndex) || undefined}
        // Refers to the element that contains the accessible name for the
        // `menu`. The menu is labeled by the menu button.
        // https://www.w3.org/TR/wai-aria-practices-1.2/examples/menu-button/menu-button-actions-active-descendant.html
        aria-labelledby={buttonId || undefined}
        // The element that contains the menu items displayed by activating the
        // button has role menu.
        // https://www.w3.org/TR/wai-aria-practices-1.2/#menubutton
        role="menu"
        tabIndex={-1}
        {...props}
        ref={ref}
        data-reach-menu-items=""
        id={menuId}
        onKeyDown={wrapEvent(onKeyDown, handleKeyDown)}
      >
        {children}
      </Comp>
    );
  }
);

/**
 * @see Docs https://reacttraining.com/reach-ui/menu-button#menuitems-props
 */
export type MenuItemsProps = {
  /**
   * Can contain only `MenuItem` or a `MenuLink`.
   *
   * @see Docs https://reacttraining.com/reach-ui/menu-button#menuitems-children
   */
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

if (__DEV__) {
  MenuItems.displayName = 'MenuItems';
  MenuItems.propTypes = {
    children: PropTypes.node,
  };
}

////////////////////////////////////////////////////////////////////////////////

/**
 * MenuLink
 *
 * Handles linking to a different page in the menu. By default it renders `<a>`,
 * but also accepts any other kind of Link as long as the `Link` uses the
 * `React.forwardRef` API.
 *
 * Must be a direct child of a `<MenuList>`.
 *
 * @see Docs https://reacttraining.com/reach-ui/menu-button#menulink
 */
export const MenuLink = forwardRefWithAs<
  MenuLinkProps & { component?: any },
  'a'
>(function MenuLink({ as = 'a', component, onSelect, ...props }, forwardedRef) {
  if (component) {
    console.warn(
      '[@reach/menu-button]: Please use the `as` prop instead of `component`.'
    );
  }

  return (
    <div role="none" tabIndex={-1}>
      <MenuItemImpl
        {...props}
        ref={forwardedRef}
        data-reach-menu-link=""
        as={as}
        isLink={true}
        onSelect={onSelect || noop}
      />
    </div>
  );
});

/**
 * @see Docs https://reacttraining.com/reach-ui/menu-button#menulink-props
 */
export type MenuLinkProps = Omit<MenuItemImplProps, 'isLink' | 'onSelect'> & {
  onSelect?(): void;
};

if (__DEV__) {
  MenuLink.displayName = 'MenuLink';
  MenuLink.propTypes = {
    as: PropTypes.any,
    component: PropTypes.any,
  };
}

////////////////////////////////////////////////////////////////////////////////

/**
 * MenuList
 *
 * Wraps a DOM element that renders the menu items. Must be rendered inside of
 * a `<Menu>`.
 *
 * @see Docs https://reacttraining.com/reach-ui/menu-button#menulist
 */
export const MenuList = forwardRef<HTMLDivElement, MenuListProps>(
  function MenuList({ portal = true, ...props }, forwardedRef) {
    return (
      <MenuPopover portal={portal}>
        <MenuItems {...props} ref={forwardedRef} data-reach-menu-list="" />
      </MenuPopover>
    );
  }
);

/**
 * @see Docs https://reacttraining.com/reach-ui/menu-button#menulist-props
 */
export type MenuListProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Whether or not the popover should be rendered inside a portal. Defaults to
   * `true`.
   *
   * @see Docs https://reacttraining.com/reach-ui/menu-button#menulist-portal
   */
  portal?: boolean;
  /**
   * Can contain only `MenuItem` or a `MenuLink`.
   *
   * @see Docs https://reacttraining.com/reach-ui/menu-button#menulist-children
   */
  children: React.ReactNode;
};

if (__DEV__) {
  MenuList.displayName = 'MenuList';
  MenuList.propTypes = {
    children: PropTypes.node.isRequired,
  };
}

////////////////////////////////////////////////////////////////////////////////

/**
 * MenuPopover
 *
 * A low-level wrapper for the popover that appears when a menu button is open.
 * You can compose it with `MenuItems` for more control over the nested
 * components and their rendered DOM nodes, or if you need to nest arbitrary
 * components between the outer wrapper and your list.
 *
 * @see Docs https://reacttraining.com/reach-ui/menu-button#menupopover
 */
export const MenuPopover = forwardRef<any, MenuPopoverProps>(
  function MenuPopover(
    { children, portal = true, position, ...props },
    forwardedRef
  ) {
    const {
      buttonRef,
      buttonClickedRef,
      dispatch,
      menuRef,
      popoverRef,
      state: { isExpanded },
    } = useContext(MenuContext);
    const ref = useForkedRef(popoverRef, forwardedRef);

    useEffect(() => {
      function listener(event: MouseEvent) {
        if (buttonClickedRef.current) {
          buttonClickedRef.current = false;
        } else {
          let { relatedTarget, target } = event;

          // We on want to close only if focus rests outside the menu
          if (isExpanded && popoverRef.current) {
            if (
              !popoverRef.current?.contains(
                (relatedTarget || target) as Element
              )
            ) {
              dispatch({ type: CLOSE_MENU, payload: { buttonRef } });
            }
          }
        }
      }
      window.addEventListener('mousedown', listener);
      return () => {
        window.removeEventListener('mousedown', listener);
      };
    }, [
      buttonClickedRef,
      buttonRef,
      dispatch,
      isExpanded,
      menuRef,
      popoverRef,
    ]);

    let commonProps = {
      ref,
      // TODO: remove in 1.0
      'data-reach-menu': '',
      'data-reach-menu-popover': '',
      hidden: !isExpanded,
      children,
      ...props,
    };

    return portal ? (
      <Popover
        {...commonProps}
        targetRef={buttonRef as any}
        position={position}
      />
    ) : (
      <div {...commonProps} />
    );
  }
);

/**
 * @see Docs https://reacttraining.com/reach-ui/menu-button#menupopover-props
 */
export type MenuPopoverProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Must contain a `MenuItems`
   *
   * @see Docs https://reacttraining.com/reach-ui/menu-button#menupopover-children
   */
  children: React.ReactNode;
  /**
   * Whether or not the popover should be rendered inside a portal. Defaults to
   * `true`.
   *
   * @see Docs https://reacttraining.com/reach-ui/menu-button#menupopover-portal
   */
  portal?: boolean;
  position?: Position;
};

if (__DEV__) {
  MenuPopover.displayName = 'MenuPopover';
  MenuPopover.propTypes = {
    children: PropTypes.node,
  };
}

////////////////////////////////////////////////////////////////////////////////

/**
 * A hook that exposes data for a given `Menu` component to its descendants.
 *
 * @see Docs https://reacttraining.com/reach-ui/menu-button#usemenubuttoncontext
 */
export function useMenuButtonContext(): MenuContextValue {
  let {
    state: { isExpanded },
  } = useContext(MenuContext);
  return useMemo(() => ({ isExpanded }), [isExpanded]);
}

////////////////////////////////////////////////////////////////////////////////

/**
 * When a user's typed input matches the string displayed in a menu item, it is
 * expected that the matching menu item is selected. This is our matching
 * function.
 */
function findItemFromTypeahead(
  items: Descendant<HTMLElement>[],
  string: string = ''
) {
  if (!string) {
    return null;
  }

  const found = items.find(({ element }) =>
    element?.dataset?.valuetext?.toLowerCase().startsWith(string)
  );
  return found ? items.indexOf(found) : null;
}

function useMenuItemId(index: number | null) {
  let { menuId } = useContext(MenuContext);
  return index != null && index > -1
    ? makeId(`option-${index}`, menuId)
    : undefined;
}

interface MenuButtonState {
  isExpanded: boolean;
  selectionIndex: number;
  buttonId: null | string;
  typeaheadQuery: string;
}

type MenuButtonAction =
  | { type: 'CLICK_MENU_ITEM' }
  | { type: 'CLOSE_MENU'; payload: { buttonRef: ButtonRef } }
  | { type: 'OPEN_MENU_AT_FIRST_ITEM' }
  | { type: 'OPEN_MENU_CLEARED' }
  | {
      type: 'SELECT_ITEM_AT_INDEX';
      payload: { max?: number; min?: number; index: number };
    }
  | { type: 'CLEAR_SELECTION_INDEX' }
  | { type: 'SET_BUTTON_ID'; payload: string }
  | { type: 'SEARCH_FOR_ITEM'; payload: string };

function isRightClick(nativeEvent: MouseEvent) {
  return nativeEvent.which === 3 || nativeEvent.button === 2;
}

function focus<T extends HTMLElement = HTMLElement>(
  element: T | undefined | null
) {
  element && element.focus();
}

function reducer(
  state: MenuButtonState,
  action: MenuButtonAction = {} as MenuButtonAction
): MenuButtonState {
  switch (action.type) {
    case CLICK_MENU_ITEM:
      return {
        ...state,
        isExpanded: false,
        selectionIndex: -1,
      };
    case CLOSE_MENU:
      return {
        ...state,
        isExpanded: false,
        selectionIndex: -1,
      };
    case OPEN_MENU_AT_FIRST_ITEM:
      return {
        ...state,
        isExpanded: true,
        selectionIndex: 0,
      };
    case OPEN_MENU_CLEARED:
      return {
        ...state,
        isExpanded: true,
        selectionIndex: -1,
      };
    case SELECT_ITEM_AT_INDEX:
      if (action.payload.index >= 0) {
        return {
          ...state,
          selectionIndex:
            action.payload.max != null
              ? Math.min(Math.max(action.payload.index, 0), action.payload.max)
              : Math.max(action.payload.index, 0),
        };
      }
      return state;
    case CLEAR_SELECTION_INDEX:
      return {
        ...state,
        selectionIndex: -1,
      };
    case SET_BUTTON_ID:
      return {
        ...state,
        buttonId: action.payload,
      };
    case SEARCH_FOR_ITEM:
      if (typeof action.payload !== 'undefined') {
        return {
          ...state,
          typeaheadQuery: action.payload,
        };
      }
      return state;
    default:
      return state;
  }
}

////////////////////////////////////////////////////////////////////////////////
// Types

type MenuButtonDescendant = Descendant<HTMLElement> & {
  key: string;
  isLink: boolean;
};

type ButtonRef = React.RefObject<null | HTMLElement>;
type MenuRef = React.RefObject<null | HTMLElement>;
type PopoverRef = React.RefObject<null | HTMLElement>;

interface InternalMenuContextValue {
  buttonRef: ButtonRef;
  buttonClickedRef: React.MutableRefObject<boolean>;
  dispatch: React.Dispatch<MenuButtonAction>;
  menuId: string | undefined;
  menuRef: MenuRef;
  popoverRef: PopoverRef;
  readyToSelect: React.MutableRefObject<boolean>;
  selectCallbacks: React.MutableRefObject<(() => void)[]>;
  state: MenuButtonState;
}

export type MenuContextValue = {
  isExpanded: boolean;
  // id: string | undefined;
};
