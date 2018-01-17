import React from 'react';
import styled from 'styled-components';

import algoliasearch from 'algoliasearch';
import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX,
} from 'common/utils/config';

import Input from './Input';
import Hit from './Hit';

import algoliaImage from './algolia.svg';
import { searchFacets } from '../../../../utils/algolia';

const Legend = styled.div`
  display: flex;

  justify-content: space-between;

  margin-bottom: 0.5rem;

  color: white;
`;

// eslint-disable-next-line
export default class SearchInput extends React.PureComponent {
  state = {
    hits: [],
  };

  componentDidMount() {
    this.client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY);
    this.index = this.client.initIndex(ALGOLIA_DEFAULT_INDEX);

    this.searchQuery('');
  }

  searchQuery = (query: string) => {
    searchFacets('npm_dependencies.dependency', query).then(res => {
      const { facetHits } = res;

      facetHits.sort((a, b) => {
        if (a.value === query) {
          return -1;
        } else if (b.value === query) {
          return 1;
        }

        return 0;
      });

      this.setState({ hits: facetHits.slice(0, 3) });
    });
  };

  render() {
    return (
      <div style={{ width: '100%' }}>
        <Input searchQuery={this.searchQuery} />
        <Legend>
          <div>Dependency</div>
          <div>Sandbox Count</div>
        </Legend>
        {this.state.hits.map((hit, i) => <Hit key={i} hit={hit} />)}
        <a
          href="https://www.algolia.com/?utm_source=algoliaclient&utm_medium=website&utm_content=codesandbox.io&utm_campaign=poweredby"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            alt="Algolia"
            style={{ marginTop: '1rem' }}
            width={160}
            src={algoliaImage}
          />
        </a>
      </div>
    );
  }
}
