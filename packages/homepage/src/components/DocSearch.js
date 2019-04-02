import React, { Component } from 'react';
import Input from '@codesandbox/common/lib/components/Input';
import styled, { createGlobalStyle } from 'styled-components';

const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 500;
`;

const Style = createGlobalStyle`
  body .algolia-autocomplete {
    .ds-dropdown-menu [class^=ds-dataset-],  .algolia-docsearch-suggestion.algolia-docsearch-suggestion__secondary {
      padding: 0;
      border: none;
    }
    .ds-dropdown-menu .ds-suggestions {
      margin-top: 0;
    }

    .algolia-docsearch-suggestion--wrapper {
      padding:8px;
    }

    .ds-dropdown-menu {
      width: 500px;
      font-family: Source Sans Pro, Open Sans, Segoe UI, sans-serif;
    }

    .algolia-docsearch-footer {
      margin: 8px;
    }

    .algolia-docsearch-suggestion--category-header {
      background: #111518;
      color: white;
      padding:8px;
      font-family: 'Poppins', sans-serif;
    }

    .algolia-docsearch-suggestion--subcategory-column {
      color: #24282A
    }

    .algolia-docsearch-suggestion--title {
      font-weight: bold;
      color: #24282A;
    }

    .algolia-docsearch-suggestion--text {
      font-size: 0.8rem;
      color: #24282A
    }

    .algolia-autocomplete-left {
      width: 90%;
    }

    .algolia-docsearch-suggestion--category-header .algolia-docsearch-suggestion--category-header-lvl0 .algolia-docsearch-suggestion--highlight, .algolia-docsearch-suggestion--category-header .algolia-docsearch-suggestion--category-header-lvl1 .algolia-docsearch-suggestion--highlight, .algolia-docsearch-suggestion--text .algolia-docsearch-suggestion--highlight {
      box-shadow: inset 0 -2px 0 0 rgb(64, 169, 243);
    }

    .algolia-docsearch-suggestion--highlight {
      color: rgb(64, 169, 243)
    }
  }
`;

class DocSearch extends Component {
  state = {
    enabled: true,
  };
  componentDidMount() {
    // Initialize Algolia search.
    // eslint-disable-next-line no-undef
    if (window.docsearch) {
      window.docsearch({
        apiKey: '45db7de01ac97a7c4c673846830c4117',
        indexName: 'codesandbox',
        inputSelector: '#algolia-doc-search',
        debug: true,
      });
    } else {
      // eslint-disable-next-line
      console.warn('Search has failed to load and now is being disabled');
      // eslint-disable-next-line
      this.setState({ enabled: false });
    }
  }

  render() {
    const { enabled } = this.state;

    return enabled ? (
      <form>
        <Title>Search our docs</Title>
        <Input
          id="algolia-doc-search"
          type="search"
          placeholder="Search"
          aria-label="Search docs"
          block
        />
        <Style />
      </form>
    ) : null;
  }
}

export default DocSearch;
