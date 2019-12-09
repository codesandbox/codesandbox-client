import styled, { css } from 'styled-components';

export const SandboxTitle = styled.div`
  ${({ theme }) => css`
    margin-bottom: 0.5rem;
    color: ${theme.light ? css`#636363` : css`white`};
    font-size: 1rem;
    font-weight: 400;
  `}
`;
