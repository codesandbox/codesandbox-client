import { observer } from 'mobx-react-lite';
import React, { ReactNode } from 'react';

import { useStore } from 'app/store';

import { User as UserType } from '../types';

import { UserContainer, ProfileImage, UserName, Status } from './elements';

type Props = {
  sideView?: ReactNode;
  type: string;
  user: UserType;
};
export const User = observer<Props>(({ sideView = null, type, user }) => {
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
});
