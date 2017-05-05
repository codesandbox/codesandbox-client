// @flow
import React from 'react';
import styled from 'styled-components';
import Row from 'app/components/flex/Row';

const ProfileImage = styled.img`
  border-radius: 2px;
  margin-left: 1rem;
`;

const ProfileInfo = styled.div`
  font-weight: 300;
  text-align: right;
`;

const Name = styled.div`
  padding-bottom: 0.2rem;
  color: white;
`;

const Username = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: .875rem;
`;

type Props = {
  user: {
    username: string,
    avatarUrl: string,
    name: string,
  },
};

export default ({ user }: Props) => (
  <Row>
    <ProfileInfo>
      <Name>{user.name}</Name>
      <Username>{user.username}</Username>
    </ProfileInfo>
    <ProfileImage
      alt={user.username}
      width={40}
      height={40}
      src={user.avatarUrl}
    />
  </Row>
);
