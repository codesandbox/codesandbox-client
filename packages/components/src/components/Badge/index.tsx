import React from 'react';
import { Icon, IconNames } from '../Icon';
import { Stack } from '../Stack';
import { Text } from '../Text';

export interface BadgeProps {
  variant?: 'trial' | 'neutral' | 'warning' | 'highlight';
  icon?: IconNames;
}

const BG_MAP: Record<BadgeProps['variant'], string> = {
  trial: '#644ed7',
  neutral: '#2e2e2e',
  warning: 'rgba(255, 255, 255, 0.06)',
  highlight: '#edffa5',
};

const COLOR_MAP: Record<BadgeProps['variant'], string> = {
  trial: '#fff',
  neutral: 'inherit',
  warning: '#ef7a7a',
  highlight: 'inherit',
};

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
        backgroundColor: BG_MAP[variant],
        color: COLOR_MAP[variant],
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
