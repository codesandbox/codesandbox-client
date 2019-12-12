import { RoomInfo, User as UserType } from '@codesandbox/common/lib/types';
import delay from '@codesandbox/common/lib/utils/animation/delay-effect';
import { useOvermind } from 'app/overmind';
import React from 'react';
import styled from 'styled-components';

const Status = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
`;

const UserContainer = styled.div<{ isCurrentUser: boolean }>`
  ${delay()};
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  ${props =>
    props.isCurrentUser &&
    `
    color: white;
  `};

  &:first-child {
    margin-top: 0;
  }
`;

const ProfileImage = styled.img<{ borderColor: string }>`
  width: 26px;
  height: 26px;
  border-radius: 2px;
  border-left: 2px solid ${({ borderColor }) => borderColor};

  margin-right: 0.5rem;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
`;

interface Props {
  user: UserType;
  type: string;
  sideView: boolean;
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
