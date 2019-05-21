import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    color: rgba(255, 255, 255, 0.9);
    background-color: ${theme.secondary};
    padding: 1rem;
    font-size: 0.8rem;
    font-weight: 500;
    line-height: 1.4;
  `}
`;
