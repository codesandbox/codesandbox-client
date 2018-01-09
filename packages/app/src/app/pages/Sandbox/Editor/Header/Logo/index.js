import * as React from 'react';

import LogoIcon from 'common/components/Logo';

import { Container, Title } from './elements';

export default () => (
  <Container href="/">
    <div style={{ position: 'relative', display: 'flex' }}>
      <LogoIcon title="CodeSandbox" width={30} height={30} />
    </div>
    <Title>Editor</Title>
  </Container>
);
