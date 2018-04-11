import * as React from 'react';
import LogoIcon from 'common/components/Logo';
import { Container, Title } from './elements';

const Logo: React.SFC = () => (
  <Container id="logo" href="/">
    <div style={{ position: 'relative', display: 'flex' }}>
      <LogoIcon title="CodeSandbox" width={30} height={30} />
    </div>
    <Title>Sandbox Editor</Title>
  </Container>
);

export default Logo
