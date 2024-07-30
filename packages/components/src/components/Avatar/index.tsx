import React from 'react';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Element, IElementProps } from '../Element';
import { Text } from '../Text';

interface IAvatarProps extends IElementProps {
  file?: string;
  user: {
    id?: string;
    username: string;
    name?: string;
    avatarUrl: string;
    badges?: any[];
    subscriptionSince?: string | null;
  };
  className?: string;
}

export const AvatarContainer = styled(Element).attrs({ as: 'span' })(
  css({
    display: 'inline-block',
    height: 8,
    width: 8,
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0, // avatars should never shrink inside flex
  })
);

export const AvatarImage = styled.img(
  css({
    display: 'flex',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    borderRadius: '100%',
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
    bottom: '-4px',
    right: '-4px',
  })
);

export const Avatar = ({ user, file, ...props }: IAvatarProps) =>
  user && (
    <AvatarContainer {...props}>
      <AvatarImage src={file ?? user.avatarUrl} alt={user.username} />
      {user.subscriptionSince ? <Pro>Pro</Pro> : null}
    </AvatarContainer>
  );
