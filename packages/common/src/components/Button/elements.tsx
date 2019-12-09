import React, { ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import { Button as ReakitButtonBase } from 'reakit/Button';
import styled, { css } from 'styled-components';

import theme from '../../theme';
import { withoutProps } from '../../utils';

import { Button } from '.';

export type OptionProps = {
  theme: any;
  disabled?: boolean;
  red?: boolean;
  secondary?: boolean;
  danger?: boolean;
};

const getBackgroundColor = ({
  theme: internalTheme,
  disabled,
  red,
  secondary,
  danger,
}: OptionProps) => {
  if (disabled)
    return `background-color: ${
      internalTheme.light
        ? 'rgba(0, 0, 0, 0.4)'
        : theme.background2.darken(0.3)()
    }`;
  if (danger) return `background-color: ${theme.dangerBackground()}`;
  if (secondary) return `background-color: transparent`;
  if (red) return `background-color: ${theme.red.darken(0.2)()}`;
  if (internalTheme && internalTheme['button.background']) {
    return `background-color: ${internalTheme['button.background']}`;
  }

  return `background-color: #40A9F3;`;
};

const getBackgroundHoverColor = ({
  theme: internalTheme,
  disabled,
  red,
  secondary,
  danger,
}: OptionProps) => {
  if (disabled)
    return `background-color: ${
      internalTheme.light
        ? 'rgba(0, 0, 0, 0.4)'
        : theme.background2.darken(0.3)()
    }`;
  if (danger) return `background-color: #E25D6A`;
  if (red) return `background-color: #F27777`;
  if (internalTheme && internalTheme['button.hoverBackground']) {
    return `background-color: ${internalTheme['button.hoverBackground']}`;
  }
  if (secondary) return `background-color: #66b9f4`;

  return `background-color: #66b9f4;`;
};

const getColor = ({
  disabled,
  secondary,
  theme: internalTheme,
}: OptionProps) => {
  if (disabled) return theme.background2.lighten(1.5)();
  if (secondary)
    return internalTheme.light
      ? 'rgba(0, 0, 0, 0.75)'
      : 'rgba(255, 255, 255, 0.75)';

  return 'white';
};

const getHoverColor = ({ secondary, disabled }: OptionProps) => {
  if (disabled) return '';
  if (secondary) return 'color: white';

  return '';
};

const getBorder = ({
  theme: internalTheme,
  secondary,
  danger,
  red,
  disabled,
}: OptionProps) => {
  if (disabled)
    return internalTheme.light
      ? '2px solid rgba(0, 0, 0, 0.3)'
      : '2px solid #161A1C';
  if (red) return '2px solid #F27777';
  if (danger) return '2px solid #E25D6A';
  if (internalTheme && internalTheme['button.hoverBackground']) {
    return `2px solid ${internalTheme['button.hoverBackground']}`;
  }
  if (secondary) return `2px solid #66B9F4`;

  return '2px solid #66B9F4';
};

export const styles = css<ComponentProps<typeof Button> | any>`
  transition: 0.3s ease all;
  font-family: Poppins, Roboto, sans-serif;

  border: none;
  outline: none;
  ${props => getBackgroundColor(props)};
  background-size: 720%;

  border: ${props => getBorder(props)};
  border-radius: 4px;

  box-sizing: border-box;
  font-size: 1.125em;
  text-align: center;
  color: ${props => getColor(props)};
  font-weight: 600;
  width: ${props => (props.block ? '100%' : 'inherit')};

  user-select: none;
  text-decoration: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  ${props =>
    props.small
      ? css`
          padding: 0.5em 0.7em;
          font-size: 0.875em;
        `
      : css`
          padding: 0.65em 2.25em;
        `};

  ${props =>
    !props.disabled &&
    css`
      cursor: pointer;
    `};

  &:hover,
  &:focus {
    ${props => getBackgroundHoverColor(props)};
    ${props => getHoverColor(props)};

    outline: 0 !important;
  }
`;

// @ts-ignore
export const LinkButton = styled(withoutProps(`small`)(Link))`
  ${styles};
`;
// eslint-disable-next-line
export const AButton = styled(withoutProps(`small`)(props => <a {...props} />))`
  ${styles};
`;
export const ReakitButton = styled(withoutProps(`small`)(ReakitButtonBase))`
  ${styles}
`;
