import { User } from '@codesandbox/common/lib/types';
import css from '@styled-system/css';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { Element } from '../Element';
import { Text } from '../Text';

const AvatarImage = styled.img(
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
    border: '1px solid',
    borderColor: 'avatar.border',

    position: 'absolute',
    height: 3,
    lineHeight: '10px', // same as height + border
    top: 'calc(100% - 12px)', // position it snugly in the corner
    right: '-4px',
  })
);

type Props = {
  user: Pick<User, 'avatarUrl' | 'subscriptionSince' | 'username'>;
};
export const Avatar: FunctionComponent<Props> = ({
  user: { avatarUrl, subscriptionSince, username },
}) => (
  <Element as="span" style={{ position: 'relative' }}>
    <AvatarImage alt={username} src={avatarUrl} />

    {subscriptionSince ? <Pro>Pro</Pro> : null}
  </Element>
);
