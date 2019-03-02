import * as React from 'react';

import LogoIcon from 'common/components/Logo';

import { Container } from './elements';

export default () => (
  <Container id="logo" href="/">
    <div style={{ position: 'relative', display: 'flex' }}>
      <LogoIcon title="CodeSandbox" width={30} height={30} />
    </div>
  </Container>
);
