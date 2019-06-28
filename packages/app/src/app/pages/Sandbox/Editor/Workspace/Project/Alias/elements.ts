import styled, { css } from 'styled-components';

export const SandboxAlias = styled.div`
  ${({ theme }) => css`
    margin-top: 0.5rem;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.8)`
      : css`rgba(255, 255, 255, 0.8)`};
    font-size: 0.875rem;
  `}
`;
