import styled, { css } from 'styled-components';

export const SubTitle = styled.div`
  ${({ theme }) => css`
    text-transform: uppercase;
    font-weight: 700;
    color: ${theme.light ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'};

    padding-left: 1rem;
    font-size: 0.875rem;
  `};
`;
