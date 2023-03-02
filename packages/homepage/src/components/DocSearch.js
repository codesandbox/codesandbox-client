import Input from '@codesandbox/common/lib/components/Input';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DocSearchStyle from '../css/docSearch';

const StyledInput = styled(Input)`
  border: 1px solid ${props => props.theme.background2.lighten(0.3)};
  transition: all 300ms ease;
  box-sizing: border-box;
  padding-left: 0.5rem;
  border-radius: 4px;
  padding-right: 30px;
  box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.25);

  &:focus,
  &:hover {
    border: 1px solid #0d7bc9;
    box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.6);
  }
`;

const DocSearch = () => {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Initialize Algolia search.
    if (window.docsearch) {
      window.docsearch({
        apiKey: '45db7de01ac97a7c4c673846830c4117',
        debug: false,
        indexName: 'codesandbox',
        inputSelector: '#algolia-doc-search',
      });
    } else {
      // eslint-disable-next-line
      console.warn('Search has failed to load and now is being disabled');

      setEnabled(false);
    }
  }, []);

  return enabled ? (
    <form style={{ margin: 0 }}>
      <StyledInput
        aria-label="Search docs"
        block
        id="algolia-doc-search"
        placeholder="Search our docs"
        type="search"
      />

      <DocSearchStyle />
    </form>
  ) : null;
};

export default DocSearch;
