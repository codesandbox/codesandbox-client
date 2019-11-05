import { LiveUser } from '@codesandbox/common/lib/types';
import React, { FunctionComponent, ReactNode } from 'react';

import { useOvermind } from 'app/overmind';

import {
  ProfileImage,
  Status,
  UserContainer,
  UserName,
  UserNameContainer,
} from './elements';

type Props = {
  user: LiveUser;
  type: string;
  sideView: ReactNode;
};
export const User: FunctionComponent<Props> = ({ user, type, sideView }) => {
  const {
    state: {
      live: { liveUserId, roomInfo },
    },
  } = useOvermind();

  const metaData = roomInfo.users.find(({ id }) => id === user.id);
  const [r, g, b] = metaData?.color || [0, 0, 0];
  const isCurrentUser = user.id === liveUserId;

  return (
    <UserContainer isCurrentUser={isCurrentUser}>
      <ProfileImage
        alt={user.username}
        borderColor={`rgba(${r}, ${g}, ${b}, 0.7)`}
        src={user.avatarUrl}
      />

      <UserNameContainer>
        <UserName>{user.username}</UserName>

        {type && <Status>{`${type}${isCurrentUser && ' (you)'}`}</Status>}
      </UserNameContainer>

      {sideView}
    </UserContainer>
  );
};
