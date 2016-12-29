// @flow
import React from 'react';
import { Link, Match } from 'react-router';
import styled from 'styled-components';

import HeaderActions from '../pages/SandboxView/Editor/HeaderActions';
import LogoIcon from '../pages/Homepage/logo.png';

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

const Username = styled.div`
  position: absolute;
  right: 0;
  padding: 0 1rem;
  line-height: 3rem;
  border-left: 1px solid ${props => props.theme.background.darken(0.2)};
`;

const Logo = styled(Link)`
  display: inline-block;
  position: relative;
  background-color: ${props => props.theme.secondary};
  padding: 0;
  line-height: 3rem;
  vertical-align: middle;
  width: 20rem;
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

export default ({ username }: { username: ?string }) => (
  <Container>
    <Logo to="/">
      <LogoImage src={LogoIcon} alt="CodeSandbox" width={40} height={40} />
      <LogoName>CodeSandbox</LogoName>
    </Logo>
    <Match
      pattern="/:username/:slug"
      component={HeaderActions}
    />

    {username && <Username>{username}</Username>}
  </Container>
);

