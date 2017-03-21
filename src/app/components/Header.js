// @flow
import React from 'react';
import styled from 'styled-components';
import Button from './buttons/Button';

const Container = styled.div`
  position: relative;
  display: flex;
  background-color: ${props => props.theme.background2};
  font-size: 1.2rem;
  color: ${props => props.theme.white};
  z-index: 40;
  margin: 0;
  height: 3rem;
  font-weight: 400;
  flex: 0 0 3rem;
  box-sizing: border-box;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${props => props.theme.background2.darken(0.3)};
`;

const Logo = styled.h1`
  background-color: ${props => props.theme.background2};
  padding: 0;
  margin: 0;
  line-height: 3rem;
  font-size: 1.2rem;
  font-weight: 500;
  vertical-align: middle;
  width: 100%;
  font-weight: 400;
  text-decoration: none;
  color: white;
`;

const LogoName = styled.span`
  display: inline-block;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  text-align: center;
  margin: auto;
`;

export default () => (
  <Container>
    <Logo><LogoName>CodeSandbox</LogoName></Logo>
  </Container>
);
