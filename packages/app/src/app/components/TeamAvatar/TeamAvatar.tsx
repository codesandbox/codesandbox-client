import React from 'react';
import { Element, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';

const backgrounds = [
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
  avatar?: string | null;
  style?: React.CSSProperties;
}

const textSizes = {
  small: 2,
  big: 3,
  bigger: 6,
};

export const TeamAvatar = ({
  name,
  size = 'big',
  className,
  avatar,
  style,
}: TeamAvatarProps) => {
  if (!name) return null;

  // consistent color
  const index = name.length % (backgrounds.length - 1);
  const backgroundColor = backgrounds[index];
  const avatarSize = size === 'bigger' ? '55px' : '24px';

  return avatar ? (
    <Element
      as="img"
      css={css({
        width: avatarSize,
        height: avatarSize,
        objectFit: 'cover',
        borderRadius: 'small',
        borderColor: 'sideBar.border',
        borderStyle: 'solid',
        borderWidth: 1,
        boxSizing: 'border-box',
      })}
      style={style}
      src={avatar}
      alt={name}
    />
  ) : (
    <Stack
      style={style}
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
      <Text size={textSizes[size]}>{name[0]}</Text>
    </Stack>
  );
};
