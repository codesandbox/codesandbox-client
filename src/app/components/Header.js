// @flow
import React from 'react';
import { Link, Match } from 'react-router';
import styled from 'styled-components';
import HeaderActions from '../pages/SandboxView/Editor/HeaderActions';

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
  background-color: ${props => props.theme.secondary};
  padding: 0 1rem;
  line-height: 3rem;
  vertical-align: middle;
  width: 14rem;
  font-weight: 400;
  text-decoration: none;
  color: white;
`;

export default ({ username }: { username: ?string }) => (
  <Container>
    <Logo to="/">CodeSandbox</Logo>
    <Match
      pattern="/:username/:slug/module"
      component={HeaderActions}
    />

    {username && <Username>{username}</Username>}
  </Container>
);

