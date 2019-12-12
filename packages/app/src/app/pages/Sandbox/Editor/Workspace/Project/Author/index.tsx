import { UserWithAvatar } from '@codesandbox/common/lib/components/UserWithAvatar';
import { profileUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Item } from '../elements';

import { UserLink } from './elements';

export const Author: FunctionComponent = () => {
  const {
    state: {
      editor: {
        currentSandbox: {
          author: { username, avatarUrl, subscriptionSince },
        },
      },
    },
  } = useOvermind();

  return (
    <Item>
      <UserLink title={username} to={profileUrl(username)}>
        <UserWithAvatar
          avatarUrl={avatarUrl}
          subscriptionSince={subscriptionSince}
          username={username}
        />
      </UserLink>
    </Item>
  );
};
