// @flow
import React from 'react';
import ProfileInfo from './ProfileInfo';

type Props = {
  user: {
    username: string,
    name: string,
    avatarUrl: string,
  },
};

export default ({ user }: Props) => (
  <div>
    <ProfileInfo {...user} />
  </div>
);
