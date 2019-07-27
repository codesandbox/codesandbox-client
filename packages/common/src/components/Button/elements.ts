import styled, { css } from 'styled-components';
import { Button } from 'reakit/Button';
import { withoutProps } from '../../utils';

export interface OptionProps {
  theme: any;
  disabled?: boolean;
  red?: boolean;
  secondary?: boolean;
  danger?: boolean;
}

const getBackgroundColor = ({
  theme,
  disabled,
  red,
  secondary,
  danger,
}: OptionProps) => {
  if (disabled)
    return css`
      background-color: ${theme.light
        ? css`rgba(0, 0, 0, 0.4)`
        : theme.background2.darken(0.3)()};
    `;
  if (danger) {
    return css`
      background-color: ${theme.dangerBackground()};
    `;
  }
  if (secondary) {
    return css`
      background-color: transparent;
    `;
  }
  if (red) {
    return css`
      background-color: ${theme.red.darken(0.2)()};
    `;
  }
  if (theme[`button.background`]) {
    return css`
      background-color: ${theme[`button.background`]};
    `;
  }
  return css`
    background-color: #40a9f3;
  `;
};

const getBackgroundHoverColor = ({
  theme,
  disabled,
  red,
  secondary,
  danger,
}: OptionProps) => {
  if (disabled)
    return css`
      background-color: ${theme.light
        ? css`rgba(0, 0, 0, 0.4)`
        : theme.background2.darken(0.3)()};
    `;
  if (danger) {
    return css`
      background-color: #e25d6a;
    `;
  }
  if (secondary) {
    return css`
      background-color: #66b9f4;
    `;
  }
  if (red) {
    return css`
      background-color: #f27777;
    `;
  }
  if (theme[`button.hoverBackground`]) {
    return css`
      background-color: ${theme[`button.hoverBackground`]};
    `;
  }
  return css`
    background-color: #66b9f4;
  `;
};

const getColor = ({ disabled, secondary, theme }: OptionProps) => {
  if (disabled) {
    return theme.background2.lighten(1.5)();
  }
  if (secondary) {
    return theme.light ? `rgba(0, 0, 0, 0.75)` : `rgba(255, 255, 255, 0.75)`;
  }
  return `white`;
};

const getBorder = ({
  theme,
  secondary,
  danger,
  red,
  disabled,
}: OptionProps) => {
  if (disabled) {
    return theme.light ? `2px solid rgba(0, 0, 0, 0.3)` : `2px solid #161A1C`;
  }
  if (secondary) {
    return `2px solid #66B9F4`;
  }
  if (red) {
    return `2px solid #F27777`;
  }
  if (danger) {
    return `2px solid #E25D6A`;
  }
  if (theme && theme[`button.hoverBackground`]) {
    return `2px solid ${theme[`button.hoverBackground`]}`;
  }
  return `2px solid #66B9F4`;
};

export interface IBaseProps extends OptionProps {
  block?: boolean;
  small?: boolean;
}

export const buttonStyles = ({
  disabled = false,
  secondary = false,
  block = false,
  small = false,
  theme,
}) => css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: ${block ? '100%' : 'inherit'};
  padding: ${small ? `2px 6px` : `0.65rem 2.25rem`};
  border: ${getBorder};
  border-radius: 4px;
  ${getBackgroundColor};
  box-sizing: border-box;
  color: ${getColor};
  ${small ? theme.fonts.secondary.normal : theme.fonts.secondary.medium};
  line-height: 24px;
  text-align: center;
  text-decoration: none;
  transition: 0.3s ease all;
  user-select: none;
  outline: none;
  ${!disabled && `cursor: pointer;`};

  &:focus {
    outline: none;
  }

  &:hover,
  &:focus {
    ${getBackgroundHoverColor};
    ${secondary ? `color: white` : ``};
  }
`;

export const Base = styled(
  withoutProps(`block`, `secondary`, `danger`, `red`, `small`)(Button)
)<IBaseProps>`
  ${buttonStyles}
`;

export const ButtonIcon = styled.span`
  display: inline-flex;
  align-items: center;
  padding-right: 0.5rem;
  font-size: 16px;
`;
