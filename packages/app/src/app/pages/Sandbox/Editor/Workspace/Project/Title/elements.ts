import styled, { css } from 'styled-components';

import { WorkspaceInputContainer as WorkspaceInputContainerBase } from '../../elements';

export const SandboxTitle = styled.div`
  ${({ theme }) => css`
    margin-bottom: 0.5rem;
    color: ${theme.light ? '#636363' : '#FFFFFF'};
    font-size: 1rem;
    font-weight: 400;
  `}
`;

export const WorkspaceInputContainer = styled(WorkspaceInputContainerBase)`
  margin: 0 -0.25rem;
`;
