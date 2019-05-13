import React from 'react';
import styled from 'styled-components';

import {
  SSEContainerStatus,
  SSEManagerStatus,
} from '@codesandbox/common/lib/types';

type Props = {
  containerStatus: SSEContainerStatus;
  managerStatus: SSEManagerStatus;
};

const StatusCircle = styled.div`
  border-radius: 50%;
  background-color: ${props => props.color};
  width: 8px;
  height: 8px;
  margin-left: 0.75rem; /* Very precise to keep aligned with script icons */
  margin-right: 0.75rem;
`;

const Container = styled.div`
  display: flex;
  align-items: center;

  color: ${props =>
    props.theme['editor.foreground'] || 'rgba(255, 255, 255, 0.8)'};
`;

const STATUS_MESSAGES = {
  disconnected: 'Reconnecting to sandbox...',
  connected: 'Connected to sandbox',
  initializing: 'Initializing connection to sandbox...',
  hibernated: 'Sandbox hibernated',
  error: 'Unrecoverable sandbox error',
};

const STATUS_COLOR = {
  disconnected: '#FD2439',
  connected: '#4CFF00',
  initializing: '#FFD399',
  hibernated: '#FF662E',
  error: '#FD2439',
};

function getContainerStatusMessageAndColor(
  containerStatus: SSEContainerStatus
) {
  switch (containerStatus) {
    case 'initializing':
      return { color: '#FFD399', message: 'Container is starting...' };
    case 'container-started':
    case 'stopped':
      return { color: '#FFD399', message: 'Sandbox is starting...' };
    case 'sandbox-started':
      return { color: '#4CFF00', message: 'Connected to sandbox' };
    case 'error':
      return { color: '#FD2439', message: 'A sandbox error occurred' };
    case 'hibernated':
      return { color: '#FF662E', message: 'Sandbox hibernated' };
    default:
      return undefined;
  }
}

function getManagerStatusMessageAndColor(managerStatus: SSEManagerStatus) {
  switch (managerStatus) {
    case 'connected':
    case 'disconnected':
      return undefined;
    case 'initializing':
      return {
        message: 'Initializing connection to sandbox...',
        color: '#FFD399',
      };
    default:
      return undefined;
  }
}

export default ({ containerStatus, managerStatus }: Props) => {
  const { color, message } =
    getManagerStatusMessageAndColor(managerStatus) ||
    getContainerStatusMessageAndColor(containerStatus);
  return (
    <Container>
      <StatusCircle color={color} />

      {message}
    </Container>
  );
};
