import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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

const SearchInput = () => {
  const [hits, setHits] = useState([]);

  const searchQuery = (query: string) => {
    searchFacets({
      facet: 'npm_dependencies.dependency',
      query,
      hitsPerPage: 3,
    }).then(({ facetHits }) => {
      setHits(facetHits);
    });
  };

  useEffect(() => {
    searchQuery('');
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <Input searchQuery={searchQuery} />

      <Legend>
        <div>Dependency</div>
        <div>Sandbox Count</div>
      </Legend>

      {hits.map(hit => (
        <Hit key={hit.value} hit={hit} />
      ))}

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
          loading="lazy"
        />
      </a>
    </div>
  );
};

export default SearchInput;
