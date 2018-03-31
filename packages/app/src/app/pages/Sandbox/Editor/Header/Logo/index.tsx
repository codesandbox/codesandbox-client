
import * as React from 'react';

import LogoIcon from 'common/components/Logo';

import { Container, Title } from './elements';

type Props = {
<<<<<<< HEAD
  title: string;
};

const Logo: React.SFC<Props> = ({ title }) => (
  <Container id="logo" href="/">
    <div style={{ position: 'relative', display: 'flex' }}>
      <LogoIcon title="CodeSandbox" width={30} height={30} />
    </div>
    <Title>{title || 'Editor'}</Title>
  </Container>
=======
    title: string;
};

const Logo: React.SFC<Props> = ({ title }) => (
    <Container id="logo" href="/">
        <div style={{ position: 'relative', display: 'flex' }}>
            <LogoIcon title="CodeSandbox" width={30} height={30} />
        </div>
        <Title>{title || 'Editor'}</Title>
    </Container>
>>>>>>> refactor done, checking if everything works
);

export default Logo;
