import React from 'react';

import { Element } from '../Element';
import { Stack } from '../Stack';
import { Button } from '../Button';
import { Text } from '../Text';

type Variant = 'trial' | 'warning';

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
    <div>
      <Button
        variant={({ trial: 'light', warning: 'dark' } as const)[variant]}
        {...buttonProps}
      >
        {children}
      </Button>
    </div>
  );
};

const backgroundVariants = {
  trial: '#644ED7',
  warning: '#F7CC66',
};

const colorVariants = {
  trial: 'inherit',
  warning: '#0E0E0E',
};

interface MessageStripeProps {
  children: React.ReactNode;
  variant?: Variant;
  justify?: 'center' | 'space-between';
}

const MessageStripe = ({
  children,
  variant = 'trial',
  justify = 'center',
}: MessageStripeProps) => {
  let hasAction: boolean;

  const augmentedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type === MessageAction) {
      hasAction = true;

      return React.cloneElement<Partial<MessageActionProps>>(child, {
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
      css={{
        backgroundColor: backgroundVariants[variant],
        color: colorVariants[variant],
      }}
    >
      <Stack direction="horizontal" justify={justify} align="center" gap={2}>
        {augmentedChildren}
      </Stack>
    </Element>
  );
};

MessageStripe.Action = MessageAction;

export { MessageStripe };
