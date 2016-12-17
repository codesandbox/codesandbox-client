// @flow
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  background-color: ${props => props.theme.background};
  font-size: 1.2rem;
  color: ${props => props.theme.white};
  border-bottom: 1px solid ${props => props.theme.background.darken(0.2)};
  // box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.2);
  z-index: 40;
  margin: 0;
  font-weight: 400;
`;

const Username = styled.div`
  float: right;
`;

const Logo = styled.span`
  display: inline-block;
  background-color: ${props => props.theme.secondary};
  padding: 0.75rem 1rem;
  width: 14rem;
  font-weight: 400;
  color: white;
`;

export default ({ username }: { username: ?string }) => (
  <Container>
    <Logo>CodeSandbox</Logo>
    {username && <Username>Hello <b>{username}</b>!</Username>}
  </Container>
);

