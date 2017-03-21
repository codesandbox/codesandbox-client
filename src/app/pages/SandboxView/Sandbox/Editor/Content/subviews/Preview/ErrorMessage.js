import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  font-family: 'Source Code Pro', monospace;
  font-weight: 400;
  background-color: ${props => props.theme.redBackground};
  color: ${props => props.theme.red};
  height: 100%;
  width: 100%;
  padding: 1rem;

`;

export default ({ error }: { error: { title: string, message: string } }) => (
  <Container>
    <div>{error.title}: {error.message}</div>
  </Container>
);
