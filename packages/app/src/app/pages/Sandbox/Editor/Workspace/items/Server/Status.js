// @flow
import React from 'react';
import styled from 'styled-components';

type Props = {
  status: 'connected' | 'disconnected',
};

const StatusCircle = styled.div`
  border-radius: 50%;
  background-color: ${props => props.color};
  width: 8px;
  height: 8px;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

const Container = styled.div`
  display: flex;
  align-items: center;

  color: ${props =>
    props.theme['editor.foreground'] || 'rgba(255, 255, 255, 0.8)'};
`;

const STATUS_MESSAGES = {
  disconnected: 'Disconnected from the server',
  connected: 'Connected to the server',
};

const STATUS_COLOR = {
  disconnected: '#fd2439fa',
  connected: '#4CFF00',
};

export default ({ status }: Props) => (
  <Container>
    <StatusCircle color={STATUS_COLOR[status]} />

    {STATUS_MESSAGES[status]}
  </Container>
);
