import React from 'react';
import { Icon, IconNames, Stack, Text } from '@codesandbox/components';

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
      padding: '1px 6px',

      borderRadius: '999px',

      backgroundColor: color === 'accent' ? '#653FFD80' : '#2e2e2e',
      color: color === 'accent' ? '#fff' : 'inherit',
      fontSize: 11,
      lineHeight: 16,
    }}
    gap={2}
  >
    {icon && <Icon name={icon} />}
    <Text>{children}</Text>
  </Stack>
);
