import React from 'react';
import { UserContainer, ProfileImage, UserName, Status } from './elements';

export const User = ({ user, type, sideView, users, currentUserId }) => {
  const metaData = users.find(u => u.id === user.id);
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
