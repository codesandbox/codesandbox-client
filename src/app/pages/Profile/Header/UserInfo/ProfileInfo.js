import React from 'react';
import styled from 'styled-components';
import Row from 'app/components/flex/Row';
import Column from 'app/components/flex/Column';
import DelayedAnimation from 'app/components/animation/DelayedAnimation';
import Button from 'app/components/buttons/Button';
import delayEffect from '../../../../utils/animation/delay-effect';

const ProfileImage = styled.img`
  border-radius: 4px;
  margin-right: 1.5rem;

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
    <ProfileImage alt={username} height={160} width={160} src={avatarUrl} />
    <Column justifyContent="space-between">
      <Name>{name}</Name>
      <Username>{username}</Username>

      <Row>
        <DelayedAnimation delay={0.3}>
          <Button>
            Follow
          </Button>
        </DelayedAnimation>
      </Row>
    </Column>
  </Row>
);
