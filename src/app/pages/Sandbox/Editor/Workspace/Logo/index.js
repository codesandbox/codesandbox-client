// @flow
import React from 'react';
import styled from 'styled-components';

import LogoIcon from 'app/components/Logo';

const Container = styled.a`
  display: flex;
  position: relative;
  align-items: center;
  color: ${props => props.theme.white};
  vertical-align: middle;
  height: 3rem;
  padding: 0 1rem;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.background2};
  overflow: hidden;
  text-decoration: none;
`;

const Title = styled.h1`
  font-size: 1rem;
  font-weight: 400;
  margin: 0;
  margin-left: 1rem;
  color: white;
`;

export default () => (
  <Container href="/">
    <LogoIcon width={30} height={30} /><Title>CodeSandbox</Title>
  </Container>
);
