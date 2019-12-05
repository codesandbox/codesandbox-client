import algoliasearch from 'algoliasearch/lite';
import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX,
} from '@codesandbox/common/lib/utils/config';

const client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY);
const index = client.initIndex(ALGOLIA_DEFAULT_INDEX);

export function searchFacets({ facet, query, hitsPerPage }) {
  return index.searchForFacetValues({
    facetName: facet,
    facetQuery: query,
    maxFacetHits: hitsPerPage,
    typoTolerance: 'strict',
  });
}

export function search({
  query,
  attributesToRetrieve,
  attributesToHighlight,
  hitsPerPage,
  searchParameters,
}) {
  return index.search({
    query,
    attributesToRetrieve,
    attributesToHighlight,
    hitsPerPage,
    ...searchParameters,
  });
}
