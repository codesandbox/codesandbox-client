import React from 'react';
import styled, { keyframes } from 'styled-components';
import Logo from './Logo';
import Centered from './flex/Centered';

const animation = keyframes`
  0%, 10% { transform: rotateZ(0deg); }
  90%, 100% { transform: rotateZ(360deg); }
`;

const LogoContainer = styled.div`
  animation-name: ${animation};
  animation-duration: 800ms;
`;

export default () => (
  <Centered vertical horizontal>
    <LogoContainer>
      <Logo width={490} height={490} />
    </LogoContainer>
  </Centered>
);
