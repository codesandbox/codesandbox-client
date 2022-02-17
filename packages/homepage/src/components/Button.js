import React from 'react';
import styled, { css } from 'styled-components';

const styles = css`
  background: #dcff50;
  border-radius: 3px;
  border: none;
  font-family: ${props => props.theme.homepage.appleFont};
  font-size: 12px;
  line-height: 120%;
  text-align: center;
  padding: 6px 16px;
  font-weight: 500;
  text-decoration: none;
  color: #151515;
  transition: transform 0.3s ease;
  display: inline-block;

  span {
    display: inline-block;
    transition: transform 0.3s ease;
  }

  ${props =>
    props.big &&
    css`
      font-size: 16px;
      padding: 8px 20px;
      line-height: 24px;
    `}

  ${props =>
    props.cta &&
    css`
      min-width: 190px;
      font-size: 16px;

      font-weight: 400;
      padding: 8px 24px;
    `}

  &:disabled {
    opacity: 0.4;
  }

  &:hover {
    background: #edffa5;
    // box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.24);
    // transform: scale(1.05);
    span {
      transform: scale(0.98);
    }
  }

  &:focus {
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
    <Link {...props}>
      <span>{children}</span>
    </Link>
  ) : (
    <Button {...props}>
      <span>{children}</span>
    </Button>
  );
