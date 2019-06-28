import styled, { css } from 'styled-components';

export const SandboxDescription = styled.div<{ empty: boolean }>`
  ${({ empty, theme }) => css`
    margin-top: 0.5rem;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.7)`
      : css`rgba(255, 255, 255, 0.7)`};
    font-size: 0.875rem;
    font-style: ${empty ? 'normal' : 'italic'};
  `}
`;
