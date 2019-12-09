import * as React from 'react';

import Row from '@codesandbox/common/lib/components/flex/Row';

import ProfileInfo from './ProfileInfo';
import { Stats } from './Stats';

function UserInfo({ user }) {
  return (
    <Row>
      <ProfileInfo
        username={user.username}
        name={user.name}
        avatarUrl={user.avatarUrl}
        subscriptionSince={user.subscription && user.subscription.since}
      />
      <Stats
        likeCount={user.receivedLikeCount}
        viewCount={user.viewCount}
        forkCount={user.forkedCount}
        badges={user.badges}
        username={user.username}
      />
    </Row>
  );
}

export default UserInfo;
