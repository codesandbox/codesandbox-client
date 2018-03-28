
import * as React from 'react';

import LogoIcon from 'common/components/Logo';

import { Container, Title } from './elements';

type Props = {
  title: string;
};

const Logo: React.SFC<Props> = ({ title }) => (
  <Container id="logo" href="/">
    <div style={{ position: 'relative', display: 'flex' }}>
      <LogoIcon title="CodeSandbox" width={30} height={30} />
    </div>
    <Title>{title || 'Editor'}</Title>
  </Container>
);

export default Logo;
