import * as React from 'react';

import Row from 'common/components/flex/Row';
import { Profile } from 'app/store/modules/profile/types';

import ProfileInfo from './ProfileInfo';
import Stats from './Stats';

export type Props = {
  user: Profile;
};

const UserInfo: React.SFC<Props> = ({ user }) => (
  <Row>
    <ProfileInfo
      username={user.username}
      name={user.name}
      avatarUrl={user.avatarUrl}
      subscriptionSince={user.subscriptionSince}
    />
    <Stats
      likeCount={user.receivedLikeCount}
      viewCount={user.viewCount}
      forkCount={user.forkedCount}
      badges={user.badges}
    />
  </Row>
);

export default UserInfo;
