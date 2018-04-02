import React from 'react';
import styled from 'styled-components';

import VerticalAlign from 'app/src/app/components/Preview/Navigator/VerticalAlign';
import HorizontalAlign from 'app/src/app/components/Preview/Navigator/HorizontalAlign';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;

  width: 100%;

  background-color: ${props => props.theme.background4};

  cursor: move;
  box-sizing: border-box;

  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
`;

const Title = styled.div`
  flex: 1;
`;

const Icons = styled.div`
  z-index: 20;
  svg {
    transition: 0.3s ease color;
    margin-left: 0.5rem;
    cursor: pointer;

    &:hover {
      color: white;
    }
  }
`;

export default ({ title, alignBottom, alignRight }) => (
  <Container className="flying-container-handler">
    <Title>{title}</Title>
    <Icons>
      <HorizontalAlign onClick={alignBottom} />
      <VerticalAlign onClick={alignRight} />
    </Icons>
  </Container>
);
