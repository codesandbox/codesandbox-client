import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;

  width: 100%;
  justify-content: center;
`;

const InnerContainer = styled.div`
  width: 100%;
  max-width: 1280px;
`;

export default ({ children }: { children: React.CElement }) => (
  <Container>
    <InnerContainer>
      {children}
    </InnerContainer>
  </Container>
);
