import React from 'react';
import styled from 'styled-components';
import Row from 'app/components/flex/Row';
import Column from 'app/components/flex/Column';
import delayEffect from '../../../../utils/animation/delay-effect';
import Margin from '../../../../components/spacing/Margin';

const ProfileImage = styled.img`
  border-radius: 2px;
  margin-right: 1.5rem;

  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.5);

  ${delayEffect(0.05)};
`;

const Name = styled.div`
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 0.25rem;
  ${delayEffect(0.1)}
`;

const Username = styled.div`
  font-size: 1.25rem;
  font-weight: 200;
  color: rgba(255, 255, 255, 0.6);
  ${delayEffect(0.15)}

  margin-bottom: 1rem;
`;

type Props = {
  username: string,
  name: string,
  avatarUrl: string,
};

export default ({ username, name, avatarUrl }: Props) => (
  <Row>
    <ProfileImage alt={username} height={175} width={175} src={avatarUrl} />
    <Margin bottom={3}>
      <Column justifyContent="space-between">
        <Name>{name}</Name>
        <Username>{username}</Username>
      </Column>
    </Margin>
  </Row>
);
