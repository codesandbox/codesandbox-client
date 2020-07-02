import { VercelDeploymentState } from '@codesandbox/common/lib/types';
import { Text } from '@codesandbox/components';
import styled, { css } from 'styled-components';

const mapColorToState = (state: VercelDeploymentState, theme: any) => {
  const STARTING = [
    VercelDeploymentState.BUILDING,
    VercelDeploymentState.DEPLOYING,
    VercelDeploymentState.INITIALIZING,
  ];
  const ERROR = [
    VercelDeploymentState.BUILD_ERROR,
    VercelDeploymentState.DEPLOYMENT_ERROR,
    VercelDeploymentState.ERROR,
  ];
  const STARTED = [VercelDeploymentState.BOOTED, VercelDeploymentState.READY];

  if (STARTING.includes(state)) {
    return '#FCCB7E';
  }
  if (ERROR.includes(state)) {
    return theme.red;
  }
  if (STARTED.includes(state)) {
    return theme.green;
  }
  if (state === VercelDeploymentState.FROZEN) {
    return theme.blue;
  }

  return theme.gray;
};

export const State = styled(Text)<{ state: VercelDeploymentState }>`
  ${({ state, theme }) => css`
    display: flex;
    align-items: center;
    text-transform: capitalize;

    &:before {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 0.5rem;
      background: ${mapColorToState(state, theme)};
    }
  `};
`;
