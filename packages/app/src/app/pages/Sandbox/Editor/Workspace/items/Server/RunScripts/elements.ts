import styled, { css } from 'styled-components';

import { WorkspaceInputContainer } from '../../../elements';

export const TasksContainer = styled(WorkspaceInputContainer)<{
  disconnected: boolean;
}>`
  ${({ disconnected }) => css`
    display: flex;
    flex-direction: column;
    pointer-events: ${disconnected ? 'none' : 'initial'};
    opacity: ${disconnected ? 0.5 : 1};
  `}
`;
