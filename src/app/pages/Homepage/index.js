import React from 'react';

import styled, { keyframes } from 'styled-components';

import Logo from './logo.png';
import Centered from '../../components/flex/Centered';
import Title from '../../components/text/Title';
import DelayedAnimation from '../../components/animation/DelayedAnimation';
import SubTitle from '../../components/text/SubTitle';
import Button from '../../components/buttons/Button';

const animation = keyframes`
  0%   { transform: rotate(0deg); }
  3%   { transform: rotate(120deg); }
  34%  { transform: rotate(120deg); }
  37%  { transform: rotate(240deg); }
  65%  { transform: rotate(240deg); }
  68%  { transform: rotate(360deg); }
  100%  { transform: rotate(360deg); }
`;

const Image = styled.img`
  animation: ${animation};
  animation-duration: 20s;
  animation-delay: 2s;
  animation-iteration-count: infinite;
`;

export default () => (
  <Centered horizontal vertical>
    <DelayedAnimation>
      <Image src={Logo} alt="CodeSandbox" width={250} height={250} />
    </DelayedAnimation>
    <div style={{ marginBottom: '2rem' }}>
      <Title delay={0.1}>Welcome</Title>
      <SubTitle delay={0.2}>
        Thanks for trying out CodeSandbox!
        <br />
        Please message Ives if you find any bugs or suggestions.
      </SubTitle>
    </div>
    <DelayedAnimation delay={0.3}>
      <Button to="/sandbox/new">
        CREATE A SANDBOX
      </Button>
    </DelayedAnimation>
  </Centered>
);
