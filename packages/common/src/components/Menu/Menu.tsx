import React, { cloneElement, Children } from 'react';
import { MenuDisclosure, useMenuState } from 'reakit/Menu';
import { Container, MenuButton, List } from './elements';

interface IMenuProps {
  onToggle?: React.MouseEventHandler;
  label?: React.ReactNode;
  button?: React.ReactType;
  disabled?: boolean;
}

export const Menu: React.FC<IMenuProps> = ({
  onToggle = () => {},
  label,
  button = MenuButton,
  disabled = false,
  children,
  ...props
}) => {
  const menu = useMenuState();
  return (
    <Container {...props}>
      <MenuDisclosure
        as={button}
        {...menu}
        onClick={onToggle}
        disabled={disabled}
      >
        {label}
      </MenuDisclosure>
      <List {...menu} aria-label={props[`aria-label`]}>
        {children && (children as React.ReactElement[]).length
          ? /* eslint-disable react/no-array-index-key */
            (children as React.ReactElement[]).map((child, i) =>
              cloneElement(Children.only(child), { ...menu, key: i })
            )
          : !Array.isArray(children) &&
            cloneElement(Children.only(children as React.ReactElement), menu)}
      </List>
    </Container>
  );
};
