import React from 'react';

import { Element } from '../Element';
import { Stack } from '../Stack';
import { Button } from '../Button';
import { ComboButton } from '../ComboButton/ComboButton';
import { Text } from '../Text';
import { IconButton } from '../IconButton';

type ButtonVariant = React.ComponentProps<typeof Button>['variant'];

type Variant = 'trial' | 'warning' | 'error' | 'primary' | 'info';
type Corners = 'rounded' | 'straight';

const mapActionVariant: Record<Variant, ButtonVariant> = {
  trial: 'light',
  warning: 'dark',
  error: 'dark',
  primary: 'dark',
  info: 'dark',
};

interface MessageActionProps
  extends Omit<React.ComponentProps<typeof Button>, 'variant'> {
  children: string;
  variant?: Variant;
}
export const MessageAction = ({
  children,
  variant,
  ...buttonProps
}: MessageActionProps) => {
  return (
    <Element as="div" css={{ flexShrink: 0 }}>
      <Button variant={mapActionVariant[variant]} {...buttonProps}>
        {children}
      </Button>
    </Element>
  );
};

interface MessageMultiActionsProps
  extends Omit<React.ComponentProps<typeof ComboButton>, 'variant'> {
  variant?: Variant;
}
export const MessageMultiActions = ({
  children,
  variant,
  ...props
}: MessageMultiActionsProps) => {
  return (
    <ComboButton variant={mapActionVariant[variant]} {...props}>
      {children}
    </ComboButton>
  );
};

const backgroundVariants: Record<Variant, string> = {
  trial: '#644ED7',
  warning: '#F7CC66',
  error: '#F5A8A8',
  primary: 'button.background',
  info: '#7DA1F9',
};
const colorVariants: Record<Variant, string> = {
  trial: 'inherit',
  warning: '#0E0E0E',
  error: '#0E0E0E',
  primary: 'button.foreground',
  info: '#0E0E0E',
};

interface MessageStripeProps {
  children: React.ReactNode;
  corners?: Corners;
  justify?: 'center' | 'space-between';
  variant?: Variant;
  onDismiss?: () => void;
}

const MessageStripe = ({
  children,
  corners = 'rounded', // Opposite of the value in v2 just to not cause regressions.
  variant = 'trial',
  justify = 'center',
  onDismiss,
}: MessageStripeProps) => {
  let hasAction: boolean;

  const augmentedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type === MessageAction) {
      hasAction = true;

      return React.cloneElement<Partial<MessageActionProps>>(child, {
        variant,
      });
    }

    if (React.isValidElement(child) && child.type === MessageMultiActions) {
      hasAction = true;

      return React.cloneElement<Partial<MessageMultiActionsProps>>(child, {
        variant,
      });
    }

    return (
      <Text size={13} lineHeight="16px">
        {child}
      </Text>
    );
  });

  return (
    <Element
      paddingY={hasAction ? 2 : 3}
      paddingX={4}
      paddingRight={onDismiss ? 11 : undefined}
      css={{
        backgroundColor: backgroundVariants[variant],
        color: colorVariants[variant],
        position: 'relative',
        borderRadius: { rounded: '4px', straight: 0 }[corners],
      }}
    >
      <Stack direction="horizontal" justify={justify} align="center" gap={2}>
        {augmentedChildren}

        {onDismiss ? (
          <Element css={{ position: 'absolute', right: '16px' }}>
            <IconButton
              onClick={onDismiss}
              css={{
                color: colorVariants[variant],
                '&:hover:not(:disabled)': { color: colorVariants[variant] },
              }}
              name="cross"
              title="Dismiss"
              variant="square"
            />
          </Element>
        ) : null}
      </Stack>
    </Element>
  );
};

MessageStripe.Action = MessageAction;
MessageStripe.MultiActions = MessageMultiActions;
MessageStripe.MultiActionsItem = ComboButton.Item;

export { MessageStripe };
