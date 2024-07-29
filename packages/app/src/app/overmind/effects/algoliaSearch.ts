import search from 'algoliasearch';
import { Dependency } from '@codesandbox/common/lib/types/algolia';
import { getGreensockAlias, GREENSOCK_ALIASES } from './utils/greensock';

const client = search('OFCNCOG2CU', '00383ecd8441ead30b1b0ff981c426f5');
const NPMSearchIndex = client.initIndex('npm-search');

async function searchAlgolia(value: string | void, hits?: number) {
  // @ts-ignore
  const all: {
    hits: Dependency[];
  } = await NPMSearchIndex.search(value || '', {
    // @ts-ignore
    hitsPerPage: hits || 10,
  });

  return all?.hits || [];
}

export default {
  async searchDependencies(value: string | void, hits?: number) {
    if (!value) {
      return searchAlgolia(value, hits);
    }

    const greensockAlias = getGreensockAlias(value);
    let searchResults: Dependency[];
    if (greensockAlias) {
      const [depResults, gsap] = await Promise.all([
        searchAlgolia(value, 3 + GREENSOCK_ALIASES.length),
        searchAlgolia(greensockAlias, 1),
      ]);
      // Alias any greensock result out, so that we don't have duplicate results and we don't show
      // gsap for a plugin where only gsap-trial is applicable.
      const filteredDepResults = depResults.filter(
        d => !GREENSOCK_ALIASES.includes(d.name)
      );
      // Then finally truncate the results back to 3
      filteredDepResults.length = 3;
      searchResults = [gsap[0], ...filteredDepResults];
    } else {
      searchResults = await searchAlgolia(value, 4);
    }

    return searchResults;
  },
};
