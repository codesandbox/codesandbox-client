import styled, { css } from 'styled-components';
import { Button } from 'reakit/Button';
import { withoutProps } from '../../utils';

export type OptionProps = {
  theme: any;
  disabled?: boolean;
  red?: boolean;
  secondary?: boolean;
  danger?: boolean;
};

const getBackgroundColor = ({
  disabled = false,
  secondary = false,
  red = false,
  danger = false,
  theme = {},
}: OptionProps) => {
  switch (true) {
    case disabled:
      return theme.light
        ? css`rgba(0, 0, 0, 0.4)`
        : theme.background2.darken(0.3)();
    case danger:
      return theme.dangerBackground();
    case secondary:
      return css`transparent`;
    case red:
      return theme.red.darken(0.2)();
    case theme[`button.background`]:
      return theme[`button.background`];
    default:
      return css`#40a9f3;`;
  }
};

const getBackgroundHoverColor = ({
  disabled = false,
  secondary = false,
  red = false,
  danger = false,
  theme = {},
}: OptionProps) => {
  switch (true) {
    case disabled:
      return theme.light
        ? css`rgba(0, 0, 0, 0.4)`
        : theme.background2.darken(0.3)();
    case danger:
      return css` #e25d6a;`;
    case secondary:
      return css`#66b9f4;`;
    case red:
      return css`#f27777; `;
    case theme[`button.background`]:
      return theme[`button.hoverBackground`];
    default:
      return css`#66b9f4;`;
  }
};

const getColor = ({
  disabled = false,
  secondary = false,
  theme = {},
}: OptionProps) => {
  switch (true) {
    case disabled:
      return theme.background2.lighten(1.5)();
    case secondary:
      return theme.light
        ? css`rgba(0, 0, 0, 0.75)`
        : css`rgba(255, 255, 255, 0.75)`;
    default:
      return css`white`;
  }
};

const getBorder = ({
  disabled = false,
  secondary = false,
  red = false,
  danger = false,
  theme = {},
}: OptionProps) => {
  switch (true) {
    case disabled:
      return theme.light
        ? css`2px solid rgba(0, 0, 0, 0.3)`
        : css`2px solid #161A1C`;
    case secondary:
      return css`2px solid #66B9F4`;
    case red:
      return css`2px solid #F27777`;
    case danger:
      return css`2px solid #E25D6A`;
    case theme[`button.hoverBackground`]:
      return css`2px solid ${theme[`button.hoverBackground`]}`;
    default:
      return css`2px solid #66B9F4`;
  }
};

export interface IBaseProps {
  disabled?: boolean;
  secondary?: boolean;
  danger?: boolean;
  red?: boolean;
  block?: boolean;
  small?: boolean;
  children?: React.ReactNode;
}

export const buttonStyles = ({
  disabled = false,
  secondary = false,
  block = false,
  small = false,
}) => css`
  display: ${block ? css`flex` : css`inline-flex`};
  justify-content: center;
  align-items: center;
  width: ${block ? css`100%` : css`inherit`};
  padding: ${small ? css`0.5em 0.7em` : css`0.65em 2.25em`};
  border: ${getBorder};
  border-radius: 4px;
  background-color: ${getBackgroundColor};
  box-sizing: border-box;
  overflow: hidden;
  color: ${getColor};
  font-family: Poppins, Roboto, sans-serif;
  font-weight: 600;
  font-size: ${small ? css`0.875em` : css`1.125em`};
  white-space: nowrap;
  text-align: center;
  text-decoration: none;
  text-overflow: ellipsis;
  transition: 0.3s ease all;
  user-select: none;
  outline: none;
  ${!disabled &&
    css`
      cursor: pointer;
    `};

  -webkit-appearance: inherit !important;

  &:focus {
    outline: none;
  }

  &:hover,
  &:focus {
    background-color: ${getBackgroundHoverColor};
    ${secondary
      ? css`
          color: white;
        `
      : ``};
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
