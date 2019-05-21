import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    color: ${theme.light
      ? `rgba(0, 0, 0, 0.8)`
      : `rgba(255, 255, 255, 0.8)`} !important;
  `};
`;
