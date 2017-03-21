import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  color: ${props => props.theme.white};
  vertical-align: middle;
  height: 3rem;
  padding: 0 1rem;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.background2};
`;

const SandboxTitle = styled.h2`
  margin: 0;
  line-height: 3rem;
  font-weight: 400;
  font-size: 1.25rem;
`;

export default ({ sandbox }) => (
  <Container>
    <SandboxTitle>{sandbox.title || sandbox.id}</SandboxTitle>
  </Container>
);
