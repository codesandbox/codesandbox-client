import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  color: white;
  flex: 2;
`;

const Title = styled.h1`
  font-weight: 300;
  font-size: 3rem;
  text-shadow: 3px 0 3px rgba(0, 0, 0, 0.8);
`;

const SubTitle = styled.h2`
  font-weight: 300;
  font-size: 1.75rem;
  line-height: 1.2;

  color: rgba(255, 255, 255, 0.9);
`;

export default () => (
  <Container>
    <Title>CodeSandbox</Title>
    <SubTitle>The online code editor for web applications</SubTitle>
  </Container>
);
