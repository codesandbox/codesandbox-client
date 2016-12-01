import theme from '../../../../../common/theme';

export default (props) => {
  let styles = `
    transition: 0.3s ease all;
    position: relative;
    display: flex;
    font-size: 14px;
    padding: 0.6rem;
    padding-left: ${props.depth + 2.9}rem;
    color: ${props.theme.background.lighten(2)()};
    text-decoration: none;
    font-weight: 400;
    min-width: 100px;
    border-left: 2px solid transparent;

    &:hover {
      ${props.active ? '' : `
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
      color: ${theme.white()}
    `;

    if (props.nameValidationError) {
      styles += `
        border-color: ${theme.red()} !important;
        background-color: ${theme.redBackground.clearer(0.4)()} !important;
      `;
    }
  }

  return styles;
};
