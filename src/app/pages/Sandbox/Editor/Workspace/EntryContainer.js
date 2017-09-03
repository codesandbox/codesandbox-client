import styled from 'styled-components';

export const getContainerStyles = props => {
  const { theme } = props;
  const color = props.alternative
    ? theme.primary
    : theme.templateColor || theme.secondary;
  let styles = `
    ${styleProps => styleProps.noTransition || 'transition: 0.3s ease all;'}
    position: relative;
    display: flex;
    font-size: 14px;
    padding: 0.6rem;
    padding-left: ${props.depth != null
      ? `${props.depth + 1.5}rem`
      : 'calc(1rem - 2px)'};
    color: ${theme.background.lighten(2)()};
    text-decoration: none;
    font-weight: 400;
    min-width: 100px;
    border-left: 2px solid transparent;
    cursor: pointer;
    user-select: none;

    &:hover {
      ${props.active || props.editing
        ? ''
        : `
        background-color: ${color.clearer(0.9)()};
        color: ${theme.background.lighten(5)()};
        border-color: ${color.darken(0.4)()};
      `}

      > div {
        opacity: 1 !important;
      }
    }
  `;

  if (props.editing) {
    styles += `
      color: ${theme.white()};
      background-color: ${color.clearer(0.9)()};
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
      border-color: ${color()} !important;
      background-color: ${color.lighten(0.1).clearer(0.8)()} !important;
    `;
  }

  return styles;
};

export default styled.span`
  ${props => getContainerStyles(props)};
`;
