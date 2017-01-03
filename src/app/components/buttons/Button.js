import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

const styles = props => `
  transition: 0.3s ease all;
  text-transform: uppercase;
  text-decoration: none;
  background-color: ${props.disabled ? props.theme.background2.darken(0.1)() : props.theme.secondary()};
  color: ${props.disabled ? props.theme.background2.lighten(1.5)() : 'white'};
  ${(() => {
    if (props.small) {
      return `
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
      `;
    }
    return 'padding: 1.25rem 2rem;';
  })()}
  border: none;
  outline: none;
  box-shadow: ${!props.disabled && '0px 3px 3px rgba(0, 0, 0, 0.2);'};
  width: ${props.block ? '100%' : 'inherit'};

  ${!props.disabled && `
      cursor: pointer;
      &:hover {
        background-color: ${props.theme.secondary.darken(0.25)()}
      }
  `}
`;

const LinkButton = styled(Link)`${props => styles(props)}`;
const Button = styled.button`${props => styles(props)}`;

export default (props) => {
  // Link
  if (props.to) {
    return <LinkButton {...props} />;
  }

  return <Button {...props} />;
};

