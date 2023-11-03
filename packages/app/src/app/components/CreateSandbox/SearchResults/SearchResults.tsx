import React from 'react';
import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX, // eslint-disable-line
} from '@codesandbox/common/lib/utils/config';
import { InstantSearch, Configure, Stats } from 'react-instantsearch/dom';
import { connectStateResults } from 'react-instantsearch-dom';
import { createGlobalStyle } from 'styled-components';
import { Text, Stack } from '@codesandbox/components';
import { TemplateFragment } from 'app/graphql/types';
import { SearchResultList } from './SearchResultList';
import { Loader } from '../Loader';

const LoadingIndicator = connectStateResults(({ isSearchStalled }) =>
  isSearchStalled ? <Loader /> : null
);

const GlobalSearchStyles = createGlobalStyle`
.ais-InstantSearch__root {
  display: flex;
  flex-direction: column;
  height: 100%;
}
`;

export const SearchResults = ({
  onCreateCheckout,
  isInCollection,
  search,
  onSelectTemplate,
  onOpenTemplate,
  officialTemplates,
}: {
  onCreateCheckout: () => void;
  isInCollection: boolean;
  search: string;
  onSelectTemplate: (template: TemplateFragment) => void;
  onOpenTemplate: (template: TemplateFragment) => void;
  officialTemplates: TemplateFragment[];
}) => {
  return (
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
          facetFilters={[['is_template: true']]}
        />

        <Stack css={{ height: '100%' }} direction="vertical" gap={4}>
          <Text
            as="h2"
            size={4}
            css={{
              fontWeight: 500,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            <Stats
              translations={{
                stats: nbHits => `${nbHits.toLocaleString()} results found`,
              }}
            />
          </Text>

          <LoadingIndicator />
          <SearchResultList
            onSelectTemplate={onSelectTemplate}
            onOpenTemplate={onOpenTemplate}
            officialTemplates={officialTemplates}
          />
        </Stack>
      </InstantSearch>
    </>
  );
};
