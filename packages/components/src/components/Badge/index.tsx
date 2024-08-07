import React from 'react';
import { Icon, IconNames } from '../Icon';
import { Stack } from '../Stack';
import { Text } from '../Text';

export interface BadgeProps {
  variant?: 'trial' | 'pro' | 'neutral' | 'warning' | 'highlight' | 'error';
  icon?: IconNames;
  css?: React.CSSProperties;
  textSize?: number;
  iconSize?: number;
}

const BG_MAP: Record<BadgeProps['variant'], string> = {
  trial: '#644ed7',
  pro: '#EDFFA5',
  neutral: '#2e2e2e',
  warning: 'rgba(255, 255, 255, 0.06)',
  highlight: '#ffffff',
  error: '#EF7A7A',
};

const COLOR_MAP: Record<BadgeProps['variant'], string> = {
  trial: '#fff',
  pro: '#0E0E0E',
  neutral: 'inherit',
  warning: '#ef7a7a',
  highlight: 'inherit',
  error: '#0E0E0E',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  icon,
  children,
  css,
  textSize = 12,
  iconSize = 12,
  ...props
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
        ...css,
      }}
      gap={1}
      {...props}
    >
      {icon && <Icon size={iconSize} name={icon} />}
      {children && (
        <Text size={textSize} lineHeight="16px">
          {children}
        </Text>
      )}
    </Stack>
  );
};
