import React from 'react';
import { Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { colors } from 'app/pages/NewDashboard/Content/utils';

export const TeamAvatar = ({ name, size = 'big' }) => {
  if (!name) return null;

  // consistent color
  const index = name.length % (colors.length - 1);
  const { background, foreground } = colors[index];

  return (
    <Stack
      justify="center"
      align="center"
      css={css({
        size: size === 'small' ? 5 : 6,
        borderRadius: 'small',
        border: '1px solid',
        borderColor: 'avatar.border',
        textTransform: 'uppercase',
        backgroundColor: background,
        color: foreground,
      })}
    >
      <Text size={size === 'small' ? 2 : 3}>{name[0]}</Text>
    </Stack>
  );
};
