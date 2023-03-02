import React from 'react';
import styled, { css } from 'styled-components';

const styles = css`
  background: #eaff96;
  border-radius: 4px;
  border: none;
  font-family: ${props => props.theme.homepage.appleFont};
  font-size: 12px;
  line-height: 100%;
  text-align: center;
  padding: 8px;
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
      padding: 12px;
      border-radius: 4px;
      line-height: 100%;
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
