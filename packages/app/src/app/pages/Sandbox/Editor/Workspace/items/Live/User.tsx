import { LiveUser, RoomInfo } from '@codesandbox/common/lib/types';
import { useOvermind } from 'app/overmind';
import React from 'react';

import { ProfileImage, Status, UserContainer, UserName } from './elements';

interface Props {
  user: LiveUser;
  type: string;
  sideView: React.ReactNode;
  roomInfo: RoomInfo;
  currentUserId: string;
}

export const User: React.FC<Props> = ({
  user,
  type,
  sideView,
  roomInfo,
  currentUserId,
}) => {
  // We need to observe the user and roomInfo
  useOvermind();

  const metaData = roomInfo.users.find(u => u.id === user.id);
  const [r, g, b] = metaData ? metaData.color : [0, 0, 0];

  const isCurrentUser = user.id === currentUserId;

  return (
    <UserContainer isCurrentUser={isCurrentUser}>
      <ProfileImage
        src={user.avatarUrl}
        alt={user.username}
        borderColor={`rgba(${r}, ${g}, ${b}, 0.7)`}
      />
      <div style={{ flex: 1 }}>
        <UserName>{user.username}</UserName>
        {type && (
          <Status>
            {type}
            {isCurrentUser && ' (you)'}
          </Status>
        )}
      </div>
      {sideView}
    </UserContainer>
  );
};
