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
import { useSubscription } from 'app/hooks/useSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { SearchResultList } from './SearchResultList';
import { Loader } from '../Loader';
import { MaxPublicSandboxes } from '../stripes';

const LoadingIndicator = connectStateResults(({ isSearchStalled }) =>
  isSearchStalled ? <Loader /> : null
);

const GlobalSearchStyles = createGlobalStyle`
.ais-InstantSearch__root {
  display: flex;
  flex-direction: column;
  height: 496px;
}
`;

export const SearchResults = ({
  checkoutUrl,
  isInCollection,
  search,
  onSelectTemplate,
  onOpenTemplate,
}: {
  // Receiving as prop to avoid fetching the checkout
  // url every time the templates list re-renders.
  checkoutUrl: string | undefined;
  isInCollection: boolean;
  search: string;
  onSelectTemplate: (template: TemplateFragment) => void;
  onOpenTemplate: (template: TemplateFragment) => void;
}) => {
  const { hasMaxPublicSandboxes, isEligibleForTrial } = useSubscription();
  const { isTeamAdmin } = useWorkspaceAuthorization();

  const limitNewSandboxes = isInCollection && hasMaxPublicSandboxes;

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
          facetFilters={[
            [
              'custom_template.published: true',
              'custom_template.published: false',
            ],
          ]}
        />

        <Stack css={{ height: '100%' }} direction="vertical" gap={6}>
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

          {limitNewSandboxes ? (
            <MaxPublicSandboxes
              checkoutUrl={checkoutUrl}
              isEligibleForTrial={isEligibleForTrial}
              isTeamAdmin={isTeamAdmin}
            />
          ) : null}

          <LoadingIndicator />
          <SearchResultList
            disableTemplates={limitNewSandboxes}
            onSelectTemplate={onSelectTemplate}
            onOpenTemplate={onOpenTemplate}
          />
        </Stack>
      </InstantSearch>
    </>
  );
};
