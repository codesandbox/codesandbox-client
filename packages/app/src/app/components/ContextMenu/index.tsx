import * as React from 'react';

import { ENTER } from '@codesandbox/common/lib/utils/keycodes';

import {
  useMenuState,
  Menu,
  MenuDisclosure,
  MenuItem,
  MenuGroup,
} from 'reakit/Menu';

import { Container, Item, ItemContainer } from './elements';

type OnContextMenu = (event: React.MouseEvent) => void;

interface ItemType {
  color?: string;
  title: string;
  icon?: React.ElementType;
  action: () => boolean | void;
}

type Item = ItemType | ItemType[];

type ChildrenProps =
  | {
      childFunction: true;
      children: (
        onContextMenu: OnContextMenu,
        disclosureProps: any
      ) => React.ReactNode;
    }
  | {
      childFunction?: false | null;
      children: React.ReactNode;
    };

type Props = {
  items: Item[];
  onContextMenu?: OnContextMenu;
  style?: React.CSSProperties;
  className?: string;
  id?: string;
  isDraggingItem?: boolean;
  name: string;
} & ChildrenProps;

export const ContextMenu = ({
  children,
  childFunction,
  items,
  isDraggingItem,
  onContextMenu,
  name,
  ...props
}: Props) => {
  const hasChildFunction =
    childFunction === true && typeof children === 'function';
  const menu = useMenuState({
    placement: 'bottom-end',
    unstable_fixed: true,
  });

  const mapFunction = (item: ItemType, i: number) => {
    if (Array.isArray(item)) {
      if (item.length === 0) {
        return null;
      }
      return (
        <MenuGroup as={ItemContainer} {...menu} key={i}>
          {item.map(mapFunction)}
        </MenuGroup>
      );
    }

    const handlePress = (
      e:
        | React.MouseEvent<HTMLButtonElement>
        | React.KeyboardEvent<HTMLButtonElement>
    ) => {
      if (item.action()) {
        e.preventDefault();
        menu.hide();
      }
    };

    return (
      <MenuItem
        {...menu}
        as={Item}
        key={item.title}
        color={item.color}
        onMouseDown={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseUp={e => {
          handlePress(e);
        }}
        onKeyUp={e => {
          if (e.keyCode === ENTER) {
            handlePress(e);
          }
        }}
      >
        {item.icon && <item.icon />}
        {item.title}
      </MenuItem>
    );
  };

  const onMenuEvent: OnContextMenu = event => {
    const { clientY, clientX } = event;
    event.preventDefault();

    const referenceObj = {
      getBoundingClientRect: () => ({
        top: clientY,
        right: clientX,
        bottom: clientY,
        left: clientX,
      }),
      clientWidth: 0,
      clientHeight: 0,
    };

    menu.unstable_referenceRef.current = referenceObj;

    // necessary for subsequent right clicks
    menu.hide();
    menu.show();

    if (onContextMenu) {
      onContextMenu(event);
    }
  };

  return (
    <div {...props} onContextMenu={childFunction ? undefined : onMenuEvent}>
      <MenuDisclosure {...menu}>
        {disclosureProps =>
          hasChildFunction ? children(onMenuEvent, disclosureProps) : children
        }
      </MenuDisclosure>
      <Menu
        unstable_portal
        as={Container}
        {...menu}
        aria-label={`menu ${name}`}
      >
        {items.map(mapFunction)}
      </Menu>
    </div>
  );
};
