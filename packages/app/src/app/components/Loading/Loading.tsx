import Logo from '@codesandbox/common/es/components/Logo';
import React from 'react';

import { FullscreenCentered, LogoContainer } from './elements';

export const Loading = () => (
  <FullscreenCentered>
    <LogoContainer>
      <Logo width={200} height={200} />
    </LogoContainer>
  </FullscreenCentered>
);
