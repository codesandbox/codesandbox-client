// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  display: flex;
  background-color: ${props => props.theme.background};
  font-size: 1.2rem;
  color: ${props => props.theme.white};
  border-bottom: 1px solid ${props => props.theme.background.darken(0.2)};
  // box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.2);
  z-index: 40;
  margin: 0;
  font-weight: 400;
  height: 3rem;
  min-height: 3rem;
`;

const Logo = styled(Link)`
  display: inline-block;
  position: relative;
  background-color: ${props => props.theme.secondary};
  padding: 0;
  line-height: 3rem;
  vertical-align: middle;
  width: 16rem;
  font-weight: 400;
  text-decoration: none;
  color: white;
`;

const LogoImage = styled.img`
  border-right: 1px solid ${props => props.theme.background2.clearer(0.8)};
  padding: 0.25rem 0.75rem;
`;

const LogoName = styled.span`
  display: inline-block;
  padding-left: 1rem;
  position: absolute;
  top: 0;
  bottom: 0;
`;

export default () => (
  <Container>
    <Logo to="/">
      <LogoName>CodeSandbox</LogoName>
    </Logo>
  </Container>
);
