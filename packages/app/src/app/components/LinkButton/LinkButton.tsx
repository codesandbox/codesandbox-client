import styled, { css } from 'styled-components';

export const LinkButton = styled.button`
  ${({ theme }) => css`
    display: inline-block;
    padding: 0;
    margin: 0;
    border: none;
    background-color: transparent;
    color: ${theme.secondary};
    outline: none;
    text-decoration: underline;
    transition: 0.3s ease color;
    cursor: pointer;

    &:hover {
      color: ${theme.secondary.lighten(0.1)};
    }
  `}
`;
