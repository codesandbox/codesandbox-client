import search from 'algoliasearch';
import { Dependency } from '@codesandbox/common/lib/types/algolia';

const client = search('OFCNCOG2CU', '00383ecd8441ead30b1b0ff981c426f5');
const NPMSearchIndex = client.initIndex('npm-search');

export default {
  async searchDependencies(value: string | void, hits?: number) {
    // @ts-ignore
    const all: {
      hits: Dependency[];
    } = await NPMSearchIndex.search(value || '', {
      // @ts-ignore
      hitsPerPage: hits || 10,
    });

    return all?.hits || [];
  },
};
