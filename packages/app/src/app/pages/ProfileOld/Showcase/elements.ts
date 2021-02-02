import styled, { css } from 'styled-components';

export const ErrorTitle = styled.div`
  ${({ theme }) => css`
    font-size: 1.25rem;
    color: ${theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  `};
`;

export const SandboxInfoContainer = styled.div`
  flex: 1;
`;

export const ShowcasePreviewContainer = styled.div`
  flex: 2;
`;
