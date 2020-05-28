import { createGlobalStyle } from 'styled-components';

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
