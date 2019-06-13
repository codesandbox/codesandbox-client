import { createGlobalStyle, css } from 'styled-components';

export default createGlobalStyle`${({ theme }: { theme: any }) => css`
  .ReactModal__Content div[class^='Modal__ModalBody'] {
    /*
   * app/src/app/containers/Modal.js sets ModalBody background to white.
   * We don't want to risk messing up something else, so we fix that here.
   */
    background: transparent;
  }

  .search-dependencies {
    .ais-Pagination {
      color: ${theme.light
        ? css`rgba(0, 0, 0, 1)`
        : css`rgba(255, 255, 255, 1)`};
      background-color: ${props => props.theme[`sideBar.background`]};
      border-radius: 0;
      display: flex;
      justify-content: center;
      padding: 0;
    }

    .ais-Pagination-link {
      color: ${theme.light
        ? css`rgba(0, 0, 0, 0.5)`
        : css`rgba(255, 255, 255, 0.5)`};
    }

    .ais-Pagination-item--selected {
      color: ${theme.white};
      background: ${theme[`button.hoverBackground`]};
    }

    .ais-Highlight-highlighted {
      color: ${theme[`button.hoverBackground`]};
    }

    .ais-PoweredBy-link svg path:nth-child(4) {
      fill: ${theme.light
        ? css`rgba(0, 0, 0, 0.8)`
        : css`rgba(255, 255, 255, 0.8)`} !important;
    }

    footer {
      height: 40px;
      background-color: ${theme[`sideBar.background`]};

      .ais-PoweredBy {
        color: ${theme.light
          ? css`rgba(0, 0, 0, 1)`
          : css`rgba(255, 255, 255, 1)`};
      }
    }
  }
`}`;
