import React from 'react';
import styled from 'styled-components';

import algoliasearch from 'algoliasearch';
import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX,
} from 'app/utils/config';

import Input from './Input';
import Hit from './Hit';

import algoliaImage from './algolia.svg';

const Legenda = styled.div`
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
    this.index.searchForFacetValues(
      { facetName: 'npm_dependencies.dependency', facetQuery: query },
      (err, content) => {
        if (err) {
          console.error(err);
        }

        this.setState({ hits: content.facetHits.slice(0, 3) });
      }
    );
  };

  render() {
    return (
      <div>
        <Input searchQuery={this.searchQuery} />
        <Legenda>
          <div>Dependency</div>
          <div>Sandbox Count</div>
        </Legenda>
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
