import React from 'react';
import styled, { css } from 'styled-components';

const styles = css`
  background: ${props => props.theme.homepage.primary};
  border-radius: 2px;
  border: none;
  font-family: ${props => props.theme.homepage.appleFont};
  font-size: 0.8125rem;
  line-height: 19px;
  text-align: center;
  padding: 4px 21px;
  text-decoration: none;
  color: ${props => props.theme.homepage.white} !important;
  transition: all 200ms ease;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  display: inline-block;

  :disabled {
    opacity: 0.4;
  }

  :hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.24);
    transform: scale(1.1);
  }

  :focus {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.24);
    transform: scale(1);
  }
`;

const Button = styled.button`
  ${styles}
`;
const Link = styled.a`
  ${styles}
`;

export default ({ children, ...props }) =>
  props.href ? (
    <Link {...props}>{children}</Link>
  ) : (
    <Button {...props}>{children}</Button>
  );
