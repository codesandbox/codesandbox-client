import styled, { css } from 'styled-components';

export const Error = styled.div`
  ${({ theme }) => css`
    margin: 1rem;
    color: ${theme.red};
    font-size: 0.875rem;
  `}
`;
