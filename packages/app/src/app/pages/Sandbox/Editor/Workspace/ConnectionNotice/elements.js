import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    color: ${theme.red};
    background-color: ${theme.redBackground};
    padding: 1rem;
    font-size: 0.75rem;
  `}
`;
