import styled, { css } from 'styled-components';
import { WorkspaceInputContainer } from '../../elements';

export const SubTitle = styled.div`
  text-transform: uppercase;
  font-weight: 700;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'};

  padding-left: 1rem;
  font-size: 0.875rem;
`;

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
