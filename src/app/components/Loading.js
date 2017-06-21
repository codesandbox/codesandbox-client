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

type Props = {
  message: ?string,
};

export default ({ message }: Props) =>
  <Centered vertical horizontal>
    <LogoContainer hasMessage={Boolean(message)}>
      <Logo width={490} height={490} />
    </LogoContainer>
  </Centered>;
