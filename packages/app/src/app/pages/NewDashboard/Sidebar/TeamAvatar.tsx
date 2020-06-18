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

export const TeamAvatar = ({ name, size = 'big', ...props }) => {
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
      })}
      {...props}
    >
      <Text size={size === 'small' ? 2 : 3}>{name[0]}</Text>
    </Stack>
  );
};
