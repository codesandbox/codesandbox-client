import { User } from '@codesandbox/common/lib/types';
import css from '@styled-system/css';
import React, { ComponentProps, FunctionComponent } from 'react';
import styled from 'styled-components';

import { Element, Text } from '../..';

export const AvatarContainer = styled(Element).attrs({ as: 'span' })(
  css({
    display: 'inline-block',
    height: 8,
    width: 8,
    position: 'relative',
  })
);

export const AvatarImage = styled.img(
  css({
    height: '100%',
    width: '100%',
    boxSizing: 'border-box',
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
    bottom: '-4px',
    right: '-4px',
  })
);

type Props = Omit<ComponentProps<typeof AvatarContainer>, 'children'> & {
  user?: Pick<User, 'avatarUrl' | 'subscriptionSince' | 'username'>;
};
export const Avatar: FunctionComponent<Props> = ({ user = {}, ...props }) =>
  user ? (
    <AvatarContainer {...props}>
      <AvatarImage src={user.avatarUrl} alt={user.username} />

      {user.subscriptionSince ? <Pro>Pro</Pro> : null}
    </AvatarContainer>
  ) : null;
