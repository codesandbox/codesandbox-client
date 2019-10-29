import { Button as ReakitButton } from 'reakit';
import styled, { css } from 'styled-components';

export const LinkButton = styled(ReakitButton)`
  ${({ theme }) => css`
    display: inline-block;
    padding: 0;
    margin: 0;
    border: none;
    background-color: transparent;
    color: ${theme.secondary};
    outline: none;
    transition: 0.3s ease color;
    cursor: pointer;

    &:hover,
    &:focus {
      color: ${theme.secondary.lighten(0.2)};
    }
  `}
`;
