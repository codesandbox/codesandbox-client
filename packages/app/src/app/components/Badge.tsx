import React from 'react';
import { Icon, IconNames, Stack, Text } from '@codesandbox/components';

export interface BadgeProps {
  color?: 'accent' | 'neutral';
  icon?: IconNames;
}

// TODO: Move to component system
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

      backgroundColor: color === 'accent' ? '#653FFD80' : '#2e2e2e',
      color: color === 'accent' ? '#fff' : 'inherit',
      fontSize: 11,
      lineHeight: 16,
    }}
    gap={1}
  >
    {icon && <Icon size={12} name={icon} />}
    <Text>{children}</Text>
  </Stack>
);
