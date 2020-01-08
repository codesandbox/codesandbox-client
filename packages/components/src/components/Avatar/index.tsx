import React from 'react';
import css from '@styled-system/css';
import { User } from '@codesandbox/common/lib/types';
import styled from 'styled-components';
import { Element } from '../Element';
import { Text } from '../Text';

interface IAvatarProps {
  user: User;
}

export const AvatarImage = styled.img(
  css({
    width: 8,
    height: 8,
    borderRadius: 'small',
    border: '1px solid',
    borderColor: 'avatar.border',
    backgroundColor: 'avatar.border', // fallback for loading image
  })
);

export const Pro = styled(Text).attrs({ size: 1, weight: 'bold' })(
  css({
    backgroundColor: 'blues.700',
    color: 'white',
    borderRadius: 'small',
    paddingX: 2,
    paddingY: '2px', // no 2 in spaces
    border: '1px solid',
    borderColor: 'avatar.border',
    transform: 'translateX(-50%) translateY(-100%);',
    position: 'absolute',
    top: '100%',
  })
);

export const Avatar = ({ user }: IAvatarProps) => (
  <Element style={{ position: 'relative' }}>
    <AvatarImage src={user.avatarUrl} alt={user.username} />
    {user.subscriptionSince ? <Pro>Pro</Pro> : null}
  </Element>
);
