// @flow
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  background-color: #FAFAFA;
  padding: 0.75rem 1rem;
  font-size: 1.2rem;
  color: #74757D;
  margin: 0;
  font-weight: 400;
`;

const Username = styled.div`
  float: right;
`;

export default ({ username }: { username: ?string }) => (
  <Container>
    <span>CodeSandbox</span>
    {username &&
      <Username>{username}</Username>}
  </Container>
);
