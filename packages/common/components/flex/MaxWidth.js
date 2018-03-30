import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  box-sizing: border-box;
  display: flex;

  padding: 0 2rem;

  width: 100%;
  justify-content: center;
`;

const InnerContainer = styled.div`
  width: 100%;
  max-width: ${props => props.width}px;
`;

export default ({ children, width = 1280, className }) => (
  <Container>
    <InnerContainer className={className} width={width}>
      {children}
    </InnerContainer>
  </Container>
);
