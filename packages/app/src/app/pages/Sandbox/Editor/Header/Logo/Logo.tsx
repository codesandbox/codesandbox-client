import React from 'react';
import LogoIcon from '@codesandbox/common/lib/components/Logo';
import { Container } from './elements';

export const Logo = ({ style = {} }) => (
  <Container style={style} id="logo" href="/">
    <LogoIcon width={27} height={27} />
  </Container>
);
