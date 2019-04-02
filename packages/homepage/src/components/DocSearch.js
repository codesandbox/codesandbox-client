import React, { Component } from 'react';
import Input from '@codesandbox/common/lib/components/Input';
import styled from 'styled-components';
import DocSearchStyle from '../css/docSearch';

const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 500;
`;

const StyledInput = styled(Input)`
  border: 1px solid #0d7bc9;
  box-sizing: border-box;
  box-shadow: inset 0px 2px 2px rgba(0, 0, 0, 0.25);
  padding-left: 8px;
  border-radius: 4px;
  padding-right: 30px;

  ::-webkit-input-placeholder {
    color: ${props => props.theme.lightText};
    opacity: 0.8;
  }
  ::-moz-placeholder {
    color: ${props => props.theme.lightText};
    opacity: 0.8;
  }
  :-ms-input-placeholder {
    color: ${props => props.theme.lightText};
    opacity: 0.8;
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
        <StyledInput
          id="algolia-doc-search"
          type="search"
          placeholder="Search"
          aria-label="Search docs"
          block
        />
        <DocSearchStyle />
      </form>
    ) : null;
  }
}

export default DocSearch;
