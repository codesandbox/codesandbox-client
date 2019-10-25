import React from 'react';
import styled, { css } from 'styled-components';

const styles = css`
  background: #0971f1;
  border-radius: 2px;
  border: none;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 13px;
  line-height: 19px;
  text-align: center;
  padding: 2.5px 21px;
  text-decoration: none;
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
