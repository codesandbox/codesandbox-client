import {
  SSEContainerStatus,
  SSEManagerStatus,
} from '@codesandbox/common/lib/types';
import { Element, Stack, Text } from '@codesandbox/components';
import React, { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';

import { useAppState } from 'app/overmind';

const StatusCircle = styled.div<{ color: string }>`
  ${({ color, theme }) => css`
    border-radius: 50%;
    background-color: ${color};
    width: ${theme.space[2]}px;
    height: ${theme.space[2]}px;
  `};
`;

const STATUS_MESSAGES = {
  error: 'A sandbox error occurred',
  hibernated: 'Sandbox hibernated',
  initializing: 'Container is starting...',
  started: 'Connected to sandbox',
  starting: 'Sandbox is starting...',
};
const STATUS_COLORS = {
  connected: '#4CFF00',
  disconnected: '#FD2439',
  error: '#FD2439',
  hibernated: '#FF662E',
  initializing: '#FFD399',
};

const getContainerStatusInfo = (status: SSEContainerStatus) => {
  const containerStatuses = {
    'container-started': {
      color: STATUS_COLORS.initializing,
      message: STATUS_MESSAGES.starting,
    },
    error: { color: STATUS_COLORS.error, message: STATUS_MESSAGES.error },
    hibernated: {
      color: STATUS_COLORS.hibernated,
      message: STATUS_MESSAGES.hibernated,
    },
    initializing: {
      color: STATUS_COLORS.initializing,
      message: STATUS_MESSAGES.initializing,
    },
    'sandbox-started': {
      color: STATUS_COLORS.connected,
      message: STATUS_MESSAGES.started,
    },
    stopped: {
      color: STATUS_COLORS.initializing,
      message: STATUS_MESSAGES.starting,
    },
  };

  return containerStatuses[status];
};

const getManagerStatusInfo = (status: SSEManagerStatus) => {
  const managerStatuses = {
    connected: undefined,
    disconnected: undefined,
    initializing: {
      color: STATUS_COLORS.initializing,
      message: STATUS_MESSAGES.initializing,
    },
  };

  return managerStatuses[status];
};

export const Status: FunctionComponent = () => {
  const { containerStatus, status: managerStatus } = useAppState().server;
  const { color, message } =
    getManagerStatusInfo(managerStatus) ||
    getContainerStatusInfo(containerStatus);

  return (
    <Stack align="center">
      <Element marginX={2}>
        <StatusCircle color={color} />
      </Element>

      <Text marginLeft={2}>{message}</Text>
    </Stack>
  );
};
