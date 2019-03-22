import styled, { css } from 'styled-components';

export const Container = styled.button<{
  hasText?: boolean;
  loggedIn: boolean;
  liked: boolean;
  highlightHover?: boolean;
}>`
  display: inline-flex;
  transition: 0.3s ease color;
  font-family: Poppins, Roboto, sans-serif;
  align-items: center;
  border: 0;
  outline: 0;

  padding: 0;
  margin: 0;
  background-color: transparent;
  color: inherit;
  font-weight: 600;

  > div {
    display: flex;
    align-items: center;
  }

  svg {
    ${props => props.hasText && `margin-right: 0.25rem;`};
    font-size: 1rem;
  }

  ${props =>
    props.loggedIn &&
    css`
      cursor: pointer;
      &:hover {
        color: ${props.highlightHover ? props.theme.secondary : 'inherit'};
      }
    `};

  ${props =>
    props.liked &&
    props.highlightHover &&
    css`
      color: ${props.theme.secondary};
    `};
`;
