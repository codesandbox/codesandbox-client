import search from 'algoliasearch';
import { Dependency } from '@codesandbox/common/lib/types/algolia';
import { isGreensockTrialLibrary } from './utils/greensock';

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

    const isGreensock = isGreensockTrialLibrary(value);
    let searchResults: Dependency[];
    if (isGreensock) {
      const [depResults, gsap] = await Promise.all([
        searchAlgolia(value, 3),
        searchAlgolia('gsap-trial', 1),
      ]);
      searchResults = [gsap[0], ...depResults];
    } else {
      searchResults = await searchAlgolia(value, 4);
    }

    return searchResults;
  },
};
