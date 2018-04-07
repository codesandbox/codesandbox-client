import React from 'react';
import styled from 'styled-components';

import Tooltip from 'common/components/Tooltip';

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

const Actions = styled.div`
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

export default ({ title, actions }) => (
  <Container className="flying-container-handler">
    <Title>{title}</Title>
    <Actions>
      {actions.map(({ title: actionTitle, onClick, Icon }) => (
        <Tooltip title={actionTitle} key={actionTitle}>
          <Icon onClick={onClick} key={actionTitle} />
        </Tooltip>
      ))}
    </Actions>
  </Container>
);
