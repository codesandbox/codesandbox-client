import { UserWithAvatar } from '@codesandbox/common/lib/components/UserWithAvatar';
import { User } from '@codesandbox/common/lib/types';
import { profileUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';

import { Item, UserLink } from './elements';

type Props = {
  author: User;
};
export const Author: FunctionComponent<Props> = ({
  author: { username, avatarUrl, subscription },
}) => (
  <Item>
    <UserLink title={username} to={profileUrl(username)}>
      <UserWithAvatar
        username={username}
        avatarUrl={avatarUrl}
        subscriptionSince={subscription && subscription.since}
      />
    </UserLink>
  </Item>
);
