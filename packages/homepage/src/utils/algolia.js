import algoliasearch from 'algoliasearch';
import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX,
} from 'common/utils/config';

const client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY);
const index = client.initIndex(ALGOLIA_DEFAULT_INDEX);

export function searchFacets(facet, query) {
  return index.searchForFacetValues(
    { facetName: facet, facetQuery: query }
  );
}

export function search(query: string, filter: Object) {
  return new Promise((resolve, reject) => {
    index.search({ facetFilters: filter, query }, (err, res) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(res);
    });
  });
}
