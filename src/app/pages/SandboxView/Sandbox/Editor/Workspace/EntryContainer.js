import styled from 'styled-components';

import theme from '../../../../../common/theme';

export const getContainerStyles = (props) => {
  let styles = `
    transition: 0.3s ease all;
    position: relative;
    display: flex;
    font-size: 14px;
    padding: 0.6rem;
    padding-left: ${props.depth != null ? `${props.depth + 1.5}rem` : 'calc(1rem - 2px)'};
    color: ${props.theme.background.lighten(2)()};
    text-decoration: none;
    font-weight: 400;
    min-width: 100px;
    border-left: 2px solid transparent;
    cursor: pointer;
    user-select: none;

    &:hover {
      ${props.active || props.editing ? '' : `
        background-color: ${theme.background3.darken(0.2)()};
        color: ${theme.background.lighten(5)()};
        border-color: ${theme.primary.darken(0.4)()};
      `}

      > div {
        opacity: 1; !important
      }
    }
  `;

  if (props.editing) {
    styles += `
      color: ${theme.white()};
      background-color: ${theme.background3.darken(0.15)()};
    `;

    if (props.nameValidationError) {
      styles += `
        border-color: ${theme.red()} !important;
        background-color: ${theme.redBackground.clearer(0.4)()} !important;
      `;
    }
  }

  if (props.active) {
    styles += `
      color: ${theme.white()} !important;
      border-color: ${theme.primary()} !important;
      background-color: ${theme.background3()} !important;
    `;
  }

  return styles;
};

export default styled.span`
  ${props => getContainerStyles(props)}
`;
