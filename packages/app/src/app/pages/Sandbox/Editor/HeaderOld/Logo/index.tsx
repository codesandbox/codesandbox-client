import LogoIcon from '@codesandbox/common/lib/components/Logo';
import React, { FunctionComponent } from 'react';

import { Container } from './elements';

export const Logo: FunctionComponent = () => (
  <Container href="/" id="logo">
    <LogoIcon height={27} width={27} />
  </Container>
);
