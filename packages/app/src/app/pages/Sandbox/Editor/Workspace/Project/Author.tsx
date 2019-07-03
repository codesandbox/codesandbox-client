import React from 'react';
import { profileUrl } from '@codesandbox/common/lib/utils/url-generator';
import { UserWithAvatar } from '@codesandbox/common/lib/components/UserWithAvatar';
import { Item, UserLink } from './elements';

export const Author = ({
  author: { username, avatarUrl, subscriptionSince },
}) => (
  <Item>
    <UserLink title={username} to={profileUrl(username)}>
      <UserWithAvatar
        username={username}
        avatarUrl={avatarUrl}
        subscriptionSince={subscriptionSince}
      />
    </UserLink>
  </Item>
);
