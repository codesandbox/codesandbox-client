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
  size?: 'small' | 'big' | 'bigger';
  className?: string;
  avatar?: string;
  style?: any;
}

export const TeamAvatar = ({
  name,
  size = 'big',
  className,
  avatar,
  ...props
}: TeamAvatarProps) => {
  if (!name) return null;

  // consistent color
  const index = name.length % (backgrounds.length - 1);
  const backgroundColor = backgrounds[index];
  const avatarSize = size === 'bigger' ? 55 : 6;

  return avatar ? (
    <>
      <img
        {...props}
        css={css({
          maxWidth: avatarSize,
          maxHeight: avatarSize,
          borderRadius: 'small',
          borderColor: 'sideBar.border',
          borderStyle: 'solid',
          borderWidth: 1,
        })}
        src={avatar}
        alt={name}
      />
    </>
  ) : (
    <Stack
      {...props}
      justify="center"
      align="center"
      css={css({
        size: avatarSize,
        minWidth: avatarSize,
        minHeight: avatarSize,
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
