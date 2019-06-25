import React from 'react';

import { useStore } from 'app/store';

import { UserContainer, ProfileImage, UserName, Status } from './elements';

export const User = ({ sideView = null, type, user }) => {
  const {
    live: {
      liveUserId,
      roomInfo: { users },
    },
  } = useStore();

  const metaData = users.find(({ id }) => id === user.id);
  const [r, g, b] = metaData ? metaData.color : [0, 0, 0];
  const isCurrentUser = user.id === liveUserId;

  return (
    <UserContainer isCurrentUser={isCurrentUser}>
      <ProfileImage
        alt={user.username}
        borderColor={`rgba(${r}, ${g}, ${b}, 0.7)`}
        src={user.avatarUrl}
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
