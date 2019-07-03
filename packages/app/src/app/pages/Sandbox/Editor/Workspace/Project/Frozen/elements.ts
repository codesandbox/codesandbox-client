import styled, { css } from 'styled-components';

export const FreezeContainer = styled.span`
  display: flex;
  justify-content: flex-end;
`;

export const FrozenWarning = styled.span`
  ${({ theme }) => css`
    display: block;
    padding-top: 5px;
    margin: 1rem;
    margin-top: -20px;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.4)`
      : css`rgba(255, 255, 255, 0.4)`};
    font-size: 12px;
  `}
`;
