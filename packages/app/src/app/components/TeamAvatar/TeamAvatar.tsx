import React from 'react';
import { Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';

export const backgrounds = [
  'reds.200',
  'green',
  'purple',
  'yellow',
  'orange',
  'blues.300',
  'blues.600',
  'blues.700',
];

interface TeamAvatarProps {
  name: string;
  size?: 'small' | 'big';
  className?: string;
}

export const TeamAvatar = ({
  name,
  size = 'big',
  className,
}: TeamAvatarProps) => {
  if (!name) return null;

  // consistent color
  const index = name.length % (backgrounds.length - 1);
  const backgroundColor = backgrounds[index];

  return (
    <Stack
      justify="center"
      align="center"
      css={css({
        size: 6,
        borderRadius: 'small',
        textTransform: 'uppercase',
        backgroundColor,
        color: 'white',
        fontWeight: 600,
        fontFamily: 'Inter',
      })}
      className={className}
    >
      <Text size={size === 'small' ? 2 : 3}>{name[0]}</Text>
    </Stack>
  );
};
