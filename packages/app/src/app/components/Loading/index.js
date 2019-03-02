import React from 'react';
import Logo from 'common/libcomponents/Logo';
import Centered from 'common/libcomponents/flex/Centered';

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
