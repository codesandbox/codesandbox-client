import React from 'react';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Element } from '../Element';
import { Text } from '../Text';

interface IAvatarProps {
  user: {
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
    badges: any[];
    subscriptionSince: string | null;
  };
}

export const AvatarImage = styled.img(
  css({
    width: 8,
    height: 8,
    borderRadius: 'small',
    border: '1px solid',
    borderColor: 'avatar.border',
    backgroundColor: 'avatar.border', // fallback for loading image,
  })
);

export const Pro = styled(Text).attrs({ size: 1, weight: 'bold' })(
  css({
    backgroundColor: 'blues.700',
    color: 'white',
    borderRadius: 'small',
    paddingX: 2,
    border: '1px solid',
    borderColor: 'sideBar.background', // merge with the background

    position: 'absolute',
    height: 3,
    lineHeight: '10px', // same as height + border
    top: 'calc(100% - 12px)', // position it snugly in the corner
    right: '-4px',
  })
);

export const Avatar = ({ user }: IAvatarProps) =>
  user && (
    <Element as="span" style={{ position: 'relative' }}>
      <AvatarImage src={user.avatarUrl} alt={user.username} />
      {user.subscriptionSince ? <Pro>Pro</Pro> : null}
    </Element>
  );
