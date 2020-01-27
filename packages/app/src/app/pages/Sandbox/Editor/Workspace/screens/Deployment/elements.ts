import { ZeitDeploymentState } from '@codesandbox/common/lib/types';
import styled, { css } from 'styled-components';
import { Text } from '@codesandbox/components';

const mapColorToState = (state: ZeitDeploymentState, theme: any) => {
  const STARTING = [
    ZeitDeploymentState.BUILDING,
    ZeitDeploymentState.DEPLOYING,
    ZeitDeploymentState.INITIALIZING,
  ];
  const ERROR = [
    ZeitDeploymentState.BUILD_ERROR,
    ZeitDeploymentState.DEPLOYMENT_ERROR,
    ZeitDeploymentState.ERROR,
  ];
  const STARTED = [ZeitDeploymentState.BOOTED, ZeitDeploymentState.READY];

  if (STARTING.includes(state)) {
    return '#FCCB7E';
  }
  if (ERROR.includes(state)) {
    return theme.red;
  }
  if (STARTED.includes(state)) {
    return theme.green;
  }
  if (state === ZeitDeploymentState.FROZEN) {
    return theme.blue;
  }

  return theme.gray;
};

export const State = styled(Text)<{ state: ZeitDeploymentState }>`
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
