import React, { CSSProperties } from 'react';

import { Button } from '../Button';
import { Menu, MenuStyles } from '../Menu';
import { Stack } from '../Stack';
import { Icon } from '../Icon';

type ButtonProps = React.ComponentProps<typeof Button>;

type ComboButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  /**
   * Workaround to make the button fill the space if needed.
   * Passing custom CSS is not possible in this case.
   */
  fillSpace?: boolean;
  customStyles?: CSSProperties;
  options: NonNullable<React.ReactNode>;
} & ButtonProps;

const ComboButton = ({
  children,
  fillSpace,
  customStyles = {},
  options,
  variant = 'primary',
  ...props
}: ComboButtonProps) => {
  return (
    <Stack>
      <MenuStyles />
      <Button
        css={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          flex: fillSpace ? 1 : 'initial',
          position: 'relative',

          '&:focus': {
            // Allow box-shadow to appear on the right side.
            zIndex: 1,
          },
          ...customStyles,
        }}
        variant={variant}
        autoWidth
        {...props}
      >
        {children}
      </Button>
      {options ? (
        <Menu>
          <Menu.Button
            css={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              height: 'auto',

              '> *': {
                transform: 'translateY(0)',
                transition: 'transform .2s ease',
              },

              '&:hover > *, &[aria-expanded="true"] > *': {
                transform: 'translateY(2px)',
                transition: 'transform .2s ease',
              },
            }}
            variant={variant}
          >
            <Icon size={8} name="chevronDown" />
          </Menu.Button>
          <Menu.List>{options}</Menu.List>
        </Menu>
      ) : null}
    </Stack>
  );
};

const ComboButtonItem = ({
  children,
  ...props
}: {
  children: NonNullable<React.ReactNode>;
  disabled?: boolean;
  onSelect: () => void;
}) => {
  return <Menu.Item {...props}>{children}</Menu.Item>;
};

/**
 * Re-export the Menu components to make it easer
 * to use the ComboButton.
 */
ComboButton.Item = ComboButtonItem;
ComboButton.Divider = Menu.Divider;

export { ComboButton };
