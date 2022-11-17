import React from 'react';
import { Icon, IconNames } from '../Icon';
import { Stack } from '../Stack';
import { Text } from '../Text';

export interface BadgeProps {
  variant?: 'trial' | 'neutral';
  icon?: IconNames;
  isPadded?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  icon,
  children,
}) => {
  return (
    <Stack
      css={{
        alignItems: 'center',
        padding: '2px 8px',
        userSelect: 'none',
        borderRadius: '999px',
        backgroundColor: variant === 'trial' ? '#644ED7' : '#2e2e2e',
        color: variant === 'trial' ? '#fff' : 'inherit',
      }}
      gap={1}
    >
      {icon && <Icon size={12} name={icon} />}
      <Text size={12} lineHeight="16px">
        {children}
      </Text>
    </Stack>
  );
};
