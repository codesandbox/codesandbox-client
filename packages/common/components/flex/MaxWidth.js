import React from 'react';
import styled, { css } from 'styled-components';

const Container = styled.div`
  box-sizing: border-box;
  display: flex;

  padding: 0 2rem;

  width: 100%;
  justify-content: center;

  ${props =>
    props.responsive &&
    css`
      @media (max-width: 768px) {
        padding: 0;
      }
    `};
`;

const InnerContainer = styled.div`
  width: 100%;
  max-width: ${props => props.width}px;
`;

export default ({
  children,
  width = 1280,
  className,
  responsive = false,
}: {
  children: React.CElement,
  width: number,
  className: string,
  responsive: Boolean,
}) => (
  <Container responsive={responsive}>
    <InnerContainer className={className} width={width}>
      {children}
    </InnerContainer>
  </Container>
);
