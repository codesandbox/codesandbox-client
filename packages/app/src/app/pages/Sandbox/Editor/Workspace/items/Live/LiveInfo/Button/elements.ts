import styled, { css } from 'styled-components';

export const IconContainer = styled.div<{ isSecond: boolean }>`
  ${({ isSecond, theme }) => css`
    transition: 0.3s ease color;
    color: ${theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
    cursor: pointer;

    ${isSecond &&
      css`
        margin-left: 0.25rem;
      `};

    &:hover {
      color: white;
    }
  `};
`;
