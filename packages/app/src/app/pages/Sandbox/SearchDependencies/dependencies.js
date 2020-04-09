import { createGlobalStyle } from 'styled-components';
import Color from 'color';

export default createGlobalStyle`
.ReactModal__Content div[class^='Modal__ModalBody'] {
  /*
   * app/src/app/containers/Modal.js sets ModalBody background to white.
   * We don't want to risk messing up something else, so we fix that here.
   */
  background: transparent;
}

.search-dependencies {

  .ais-Pagination {
    color: ${props =>
      props.theme.light ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'};
    background-color: ${props => props.theme['sideBar.background']};
    border-radius: 0;
    display: flex;
    justify-content: center;
    padding: 0;
  }

  .ais-Pagination-link {
    &:not(.ais-Pagination-link--selected) {
      color: ${props =>
        Color(props.theme.colors.dialog.foreground)
          .alpha(0.6)
          .rgbString()} !important;
    }
  }

  .ais-Pagination-item--selected {
    color: ${props => props.theme.white};
    background: ${props => props.theme['button.hoverBackground']};
  }

  .ais-Highlight-highlighted {
    color: ${props => props.theme['button.hoverBackground']};
  }

  .ais-PoweredBy-link svg {
    fill: ${props =>
      Color(props.theme.colors.dialog.foreground)
        .alpha(0.8)
        .rgbString()} !important;

    path:nth-child(4) {
      fill: ${props =>
        Color(props.theme.colors.dialog.foreground)
          .alpha(0.8)
          .rgbString()} !important;
    }
  }

  footer {
    height: 40px;
    background-color: ${props => props.theme['sideBar.background']};

    .ais-PoweredBy {
      color: ${props =>
        Color(props.theme.colors.dialog.foreground).rgbString()} !important;
    }
  }
}
`;
