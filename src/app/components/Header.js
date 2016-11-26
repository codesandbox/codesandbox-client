// @flow
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  background-color: white;
  margin: 0.75rem 1rem;
`;

const Title = styled.h1`
  font-size: 1.2rem;
  color: #74757D;
  margin: 0;
  font-weight: 400;
`;

export default () => (
  <Container>
    <Title>CodeSandbox</Title>
  </Container>
);
