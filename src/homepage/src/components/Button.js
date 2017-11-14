import styled, { css } from 'styled-components';

const getGradient = color => css`linear-gradient(
  45deg,
  ${color},
  ${color.darken(0.2)}
)`;

export default styled.a`
  position: relative;
  background: ${({ color, secondary }) =>
    secondary ? '' : getGradient(color)};
  border: none;
  outline: none;
  padding: 0.75em 1.5em;
  font-weight: 400;
  border-radius: 4px;
  color: white;
  text-align: center;
  box-shadow: 0 0 100px ${props => props.color.clearer(0.3)};
  text-transform: uppercase;

  ${({ color, secondary }) =>
    secondary &&
    css`
      color: ${color};
      text-shadow: 0 0 50px ${props => props.color.clearer(0.3)};
      box-shadow: none;
    `};

  text-decoration: none;
`;
