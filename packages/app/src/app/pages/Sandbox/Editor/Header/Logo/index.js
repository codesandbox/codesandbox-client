import * as React from 'react';

import LogoIcon from 'common/lib/components/Logo';

import { Container } from './elements';

export default ({ style = {} }) => (
  <Container style={style} id="logo" href="/">
    <div style={{ position: 'relative', display: 'flex' }}>
      <LogoIcon title="CodeSandbox" width={27} height={27} />
    </div>
  </Container>
);
