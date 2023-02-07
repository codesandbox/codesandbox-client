import React from 'react';

import { Button } from '../Button';
import { Menu, MenuStyles } from '../Menu';
import { Stack } from '../Stack';
import { Icon } from '../Icon';

type ComboButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  variant?: React.ComponentProps<typeof Button>['variant'];
  options: NonNullable<React.ReactNode>;
};

const ComboButton = ({
  children,
  variant = 'primary',
  options,
  ...props
}: ComboButtonProps) => {
  return (
    <Stack>
      <MenuStyles />
      <Button
        css={{
          flex: 0,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          border: '1px solid rgba(0, 0, 0, 0.2)',
          fontWeight: 500,
          fontSize: '12px',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: '#343434',
        }}
        variant={variant}
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
              border: '1px solid rgba(0, 0, 0, 0.2)',
              borderLeft: 'none',

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
            <Icon size={8} name="caret" />
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
  return (
    <Menu.Item {...props}>
      <Stack
        css={{
          fontWeight: 400,
          fontSize: '12px',
          lineHeight: '16px',
          letterSpacing: '0.005em',
          color: '#E5E5E5',
        }}
      >
        {children}
      </Stack>
    </Menu.Item>
  );
};

/**
 * Re-export the Menu components to make it easer
 * to use the ComboButton.
 */
ComboButton.Item = ComboButtonItem;
ComboButton.Divider = Menu.Divider;

export { ComboButton };
