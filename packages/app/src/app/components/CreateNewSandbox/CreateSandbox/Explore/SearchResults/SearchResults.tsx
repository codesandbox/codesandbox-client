import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX,
} from '@codesandbox/common/es/utils/config';
import React from 'react';
import { connectStateResults } from 'react-instantsearch-dom';
import { Configure, InstantSearch, Stats } from 'react-instantsearch/dom';

import { SubHeader } from '../../elements';
import { Loader } from '../../Loader';
import { GlobalSearchStyles } from './elements';
import { ExploreResultList } from './ExploreResultList';

const LoadingIndicator = connectStateResults(({ isSearchStalled }) =>
  isSearchStalled ? <Loader /> : null
);

export const SearchResults = ({ search }: { search: string }) => (
  <>
    <GlobalSearchStyles />
    <InstantSearch
      appId={ALGOLIA_APPLICATION_ID}
      apiKey={ALGOLIA_API_KEY}
      indexName={ALGOLIA_DEFAULT_INDEX}
    >
      <Configure
        query={search}
        hitsPerPage={50}
        facetFilters={[
          [
            'custom_template.published: true',
            'custom_template.published: false',
          ],
        ]}
      />

      <SubHeader>
        <Stats
          translations={{
            stats: nbHits => `${nbHits.toLocaleString()} results found`,
          }}
        />
      </SubHeader>
      <LoadingIndicator />
      <ExploreResultList />
    </InstantSearch>
  </>
);
