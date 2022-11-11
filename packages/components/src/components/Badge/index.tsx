import React from 'react';
import { Icon, IconNames } from '../Icon';
import { Stack } from '../Stack';
import { Text } from '../Text';

export interface BadgeProps {
  color?: 'accent' | 'neutral';
  icon?: IconNames;
}

export const Badge: React.FC<BadgeProps> = ({
  color = 'neutral',
  icon,
  children,
}) => (
  <Stack
    css={{
      alignItems: 'center',
      padding: icon ? '4px 8px' : '1px 6px',
      userSelect: 'none',

      borderRadius: '999px',

      backgroundColor: color === 'accent' ? '#644ED7' : '#2e2e2e',
      color: color === 'accent' ? '#fff' : 'inherit',
      fontSize: 11,
    }}
    gap={1}
  >
    {icon && <Icon size={12} name={icon} />}
    <Text>{children}</Text>
  </Stack>
);
