// @flow
import styled, { css } from 'styled-components';

export const Text = styled.span`
  color: white;
  ${({ small }) =>
    small &&
    css`
      @media (max-width: 620px) {
        display: none;
      }
    `};
`;

export const EditText = styled.a`
  text-decoration: none;
  display: flex;
  align-items: center;
  color: white;

  svg {
    margin-left: 0.5rem;
  }
`;
