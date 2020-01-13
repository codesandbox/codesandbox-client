import React, { useEffect, cloneElement, Children } from 'react';
import { MenuDisclosure, useMenuState } from 'reakit/Menu';
import { Container, MenuButton, List } from './elements';

export interface IMenuProps {
  label?: React.ReactNode;
  as?: React.ElementType;
  disabled?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onToggle?: React.MouseEventHandler;
}

export const Menu: React.FC<IMenuProps> = ({
  label,
  as = MenuButton,
  disabled = false,
  onOpen = () => {},
  onClose = () => {},
  onToggle = () => {},
  children,
  ...props
}) => {
  const menu = useMenuState();
  useEffect(() => {
    if (menu.visible) {
      onOpen();
    } else {
      onClose();
    }
  }, [onOpen, onClose, menu.visible]);

  return (
    <Container {...props}>
      <MenuDisclosure as={as} {...menu} onClick={onToggle} disabled={disabled}>
        {label}
      </MenuDisclosure>
      <List {...menu} aria-label={props[`aria-label`]}>
        {children && (children as React.ReactElement[]).length
          ? /* eslint-disable react/no-array-index-key */
            (children as React.ReactElement[])
              .filter(child => child)
              .map((child, i) =>
                cloneElement(Children.only(child), { ...menu, key: i })
              )
          : !Array.isArray(children) &&
            cloneElement(Children.only(children as React.ReactElement), menu)}
      </List>
    </Container>
  );
};
