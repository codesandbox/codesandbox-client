import React from 'react';
import Logo from '@codesandbox/common/lib/components/Logo';
import Centered from '@codesandbox/common/lib/components/flex/Centered';

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
