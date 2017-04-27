import React from 'react';
import styled, { keyframes } from 'styled-components';
import Row from 'app/components/flex/Row';
import Column from 'app/components/flex/Column';
import delayEffect from '../../../../utils/animation/delay-effect';
import DelayedAnimation
  from '../../../../components/animation/DelayedAnimation';

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

const forward = keyframes`
  0%{background-position:0% 50%}
  100%{background-position:100% 50%}
`;

const backward = keyframes`
  0%{background-position:100% 0%}
  100%{background-position:0% 50%}
`;

const FollowButton = styled.div`
  transition: 0.3s ease all;
  animation-name: ${backward};
  animation-duration: 300ms;
  animation-timing-function: ease;

  border: none;
  outline: none;
  background: #6CAEDD;
  background-image: linear-gradient(270deg, #fed29d, #A58B66, #7abae8, #56a0d6);
  background-size: 720%;

  border-radius: 4px;

  padding: 0.65rem 2.25rem;
  font-size: 1.125rem;
  text-align: center;
  color: white;
  font-weight: 300;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.5);

  cursor: pointer;
  text-selection: none;
  user-select: none;

  &:hover {
    animation-name: ${forward};
    animation-duration: 300ms;
    animation-timing-function: ease;
    animation-direction: normal;
    animation-fill-mode: forwards;

    box-shadow: 0 7px 10px rgba(0, 0, 0, 0.5);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.5);
  }
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
          <FollowButton>
            Follow
          </FollowButton>
        </DelayedAnimation>
      </Row>
    </Column>
  </Row>
);
