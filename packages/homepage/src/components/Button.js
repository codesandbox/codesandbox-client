import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
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
`;

export default ({ children, ...props }) => (
  <Button {...props}>{children}</Button>
);
