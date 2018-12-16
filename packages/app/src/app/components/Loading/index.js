import React from 'react';
import Logo from 'common/components/Logo';
import Centered from 'common/components/flex/Centered';

import { LogoContainer } from './elements';

function Loading() {
  return (
    <Centered
      css={`
        height: 100vh;
        align-items: center;
      `}
      vertical
      horizontal
    >
      <LogoContainer>
        <Logo width={200} height={200} />
      </LogoContainer>
    </Centered>
  );
}

export default Loading;
