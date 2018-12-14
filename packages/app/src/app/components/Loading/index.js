import React from 'react';
import Logo from 'common/components/Logo';
import Centered from 'common/components/flex/Centered';

import { LogoContainer } from './elements';

function Loading() {
  return (
    <Centered style={{ height: '100vh' }} vertical horizontal>
      <LogoContainer>
        <Logo width={200} height={200} />
      </LogoContainer>
    </Centered>
  );
}

export default Loading;
