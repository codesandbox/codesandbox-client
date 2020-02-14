import styled, { css } from 'styled-components';

export const ErrorTitle = styled.div`
  ${({ theme }) => css`
    color: ${theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
    font-size: 1.25rem;
  `};
`;
