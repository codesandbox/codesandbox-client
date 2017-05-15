// @flow
import React from 'react';

import Row from 'app/components/flex/Row';

import ProfileInfo from './ProfileInfo';
import Stats from './Stats';

type Props = {
  user: {
    username: string,
    name: string,
    avatarUrl: string,
    receivedLikeCount: number,
    viewCount: number,
    forkedCount: number,
  },
};

export default ({ user }: Props) => (
  <Row>
    <ProfileInfo {...user} />
    <Stats
      likeCount={user.receivedLikeCount}
      viewCount={user.viewCount}
      forkCount={user.forkedCount}
    />
  </Row>
);
