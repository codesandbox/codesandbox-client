import { createGlobalStyle, css } from 'styled-components';

export const Global = createGlobalStyle`
  body {
    .algolia-autocomplete .ds-dropdown-menu {
      .algolia-docsearch-suggestion--category-header .algolia-docsearch-suggestion--category-header-lvl0 .algolia-docsearch-suggestion--highlight {
        box-shadow: none;
      }
      .algolia-docsearch-suggestion--content:before, .algolia-docsearch-suggestion--subcategory-column:before {
          background: #242424;
      }
      &:before {
        background: #151515;
        border-top: 1px solid #242424;
        border-right: 1px solid #242424;
      }
      div[class^=ds-dataset-] {
        background: #151515;
        border: 1px solid #242424;
        box-sizing: border-box;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.12), 0px 16px 32px rgba(0, 0, 0, 0.24);
        color: white;
      }

      .algolia-docsearch-suggestion {
        background: #151515;
        color: white;
      }

      .algolia-docsearch-suggestion--category-header {
        border: none;
        color: white;
      }

      .algolia-docsearch-suggestion--title, .algolia-docsearch-suggestion--subcategory-column-text {
        color: #757575;
        font-weight: normal;

        .algolia-docsearch-suggestion--highlight {
          color: white;
          background: transparent;
          box-shadow: none;
        }
      }
    }
  }
`;

export const FAQStyle = css`
  h2 {
    font-size: 16px;
    padding: 40px 0;
    box-shadow: 0px -1px 0px #242424;
    margin: 0;
    user-select: none;
    cursor: pointer;
  }

  code {
    background: #151515;
    padding: 0.2em 0.4em;
    font-size: 85%;
    margin: 0;
    border-radius: 3px;
  }

  section .show:last-child {
    padding-bottom: 40px;
  }

  img {
    border: 1px solid #242424;
    border-radius: 4px;
  }

  a {
    color: white;
  }

  ul {
    display: none;
    opacity: 0;
    transition: opacity 200ms ease;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 23px;
    color: #999999;

    &.show {
      display: block;
      opacity: 1;
    }
  }
  p {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 23px;
    color: #999999;
    display: none;
    opacity: 0;
    transition: opacity 200ms ease;

    &.show {
      display: block;
      opacity: 1;
    }
  }
`;
