// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  display: flex;
  background-color: ${props => props.theme.background2};
  font-size: 1.2rem;
  color: ${props => props.theme.white};
  z-index: 40;
  margin: 0;
  font-weight: 400;
  height: 3rem;
  min-height: 3rem;
  border-bottom: 1px solid ${props => props.theme.background2.darken(0.3)};
`;

const Logo = styled(Link)`
  display: inline-block;
  position: relative;
  background-color: ${props => props.theme.background2};
  padding: 0;
  line-height: 3rem;
  vertical-align: middle;
  width: 100%;
  font-weight: 400;
  text-decoration: none;
  color: ${props => props.theme.white};
`;

const LogoImage = styled.img`
  border-right: 1px solid ${props => props.theme.background2.clearer(0.8)};
  padding: 0.25rem 0.75rem;
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
    <Logo to="/"><LogoName>Temporary</LogoName></Logo>
  </Container>
);
