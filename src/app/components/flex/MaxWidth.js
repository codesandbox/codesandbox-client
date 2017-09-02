import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;

  width: 100%;
  justify-content: center;
`;

const InnerContainer = styled.div`
  width: 100%;
  max-width: ${props => props.width}px;
`;

export default ({
  children,
  width = 1280,
}: {
  children: React.CElement,
  width: number,
}) => (
  <Container>
    <InnerContainer width={width}>{children}</InnerContainer>
  </Container>
);
