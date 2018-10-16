import styled, { css } from 'styled-components';
import Link from 'react-router-dom/Link';
import theme from 'common/theme';

const getBackgroundColor = ({
  theme: internalTheme,
  disabled,
  red,
  secondary,
  danger,
}) => {
  if (disabled) return `background-color: ${theme.background2.darken(0.1)()}`;
  if (internalTheme && internalTheme['button.background']) {
    return `background-color: ${internalTheme['button.background']}`;
  }
  if (danger) return `background-color: ${theme.dangerBackground()}`;
  if (secondary) return `background-color: transparent`;
  if (red) return `background-color: ${theme.red.darken(0.2)()}`;

  return `background-color: #40A9F3;`;
};

const getBackgroundHoverColor = ({
  theme: internalTheme,
  disabled,
  red,
  secondary,
  danger,
}) => {
  if (disabled) return `background-color: ${theme.background2.darken(0.1)()}`;
  if (internalTheme && internalTheme['button.hoverBackground']) {
    return `background-color: ${internalTheme['button.hoverBackground']}`;
  }
  if (danger) return `background-color: #E25D6A`;
  if (secondary) return `background-color: #66b9f4`;
  if (red) return `background-color: #F27777`;

  return `background-color: #66b9f4;`;
};

const getColor = ({ disabled, secondary }) => {
  if (disabled) return theme.background2.lighten(1.5)();
  if (secondary) return `#66b9f4`;

  return 'white';
};

const getHoverColor = ({ secondary }) => {
  if (secondary) return 'color: white';

  return '';
};

const getBorder = ({
  theme: internalTheme,
  secondary,
  danger,
  red,
  disabled,
}) => {
  if (disabled) return '2px solid #161A1C';
  if (internalTheme && internalTheme['button.hoverBackground']) {
    return `2px solid ${internalTheme['button.hoverBackground']}`;
  }
  if (secondary) return `2px solid #66B9F4`;
  if (red) return '2px solid #F27777';
  if (danger) return '2px solid #E25D6A';

  return '2px solid #66B9F4';
};

const styles = css`
  transition: 0.3s ease all;

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
  font-weight: 400;
  width: ${props => (props.block ? '100%' : 'inherit')};

  user-select: none;
  text-decoration: none;
  font-weight: 600;

  ${props =>
    !props.disabled &&
    `
  cursor: pointer;
  `};

  &:hover {
    ${props => getBackgroundHoverColor(props)};
    ${props => getHoverColor(props)};
  }
`;

export const LinkButton = styled(Link)`
  ${styles};
`;
export const AButton = styled.a`
  ${styles};
`;
export const Button = styled.button`
  ${styles};
`;
