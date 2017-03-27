import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const getBackgroundColor = ({ theme, secondary, transparent, disabled }) => {
  if (disabled) return theme.background2.darken(0.1)();
  if (transparent) return 'rgba(0,0,0,0.0)';
  if (secondary) return theme.primary.clearer(0.8)();
  return theme.secondary.clearer(0.4)();
};

const getBorder = ({ transparent, disabled, theme }) => {
  if (transparent) return `1px solid ${theme.secondary.clearer(0.5)()}`;
  if (disabled) return 'none';
  return `1px solid ${theme.secondary()};`;
};

const getColor = ({ transparent, disabled, theme }) => {
  if (disabled) return theme.background2.lighten(1.5)();
  if (transparent) return 'rgba(255,255,255,0.8)';
  return 'white';
};

const styles = props => `
  transition: 0.3s ease all;
  text-transform: uppercase;
  text-decoration: none;
  line-height: 1;
  font-weight: 300;
  background-color: ${getBackgroundColor(props)};
  border: ${getBorder(props)};
  color: ${getColor(props)};
  border-radius: 2px;
  ${(() => {
  if (props.small) {
    return `
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
      `;
  }
  return 'padding: 0.75rem 1rem;';
})()}
  outline: none;
  width: ${props.block ? '100%' : 'inherit'};

  ${!props.disabled && `
      cursor: pointer;
      &:hover {
        background-color: ${props.theme.primary.clearer(0.5)()};
        border-color: ${props.theme.primary()};
      }
  `}
`;

const LinkButton = styled(Link)`${styles}`;
const AButton = styled.a`${styles}`;
const Button = styled.button`${styles}`;

export default props => {
  // Link
  if (props.to) {
    return <LinkButton {...props} />;
  }

  if (props.href) {
    return <AButton {...props} />;
  }

  return <Button {...props} />;
};
