export type Dependency = {
  name: string;
  downloadsLast30Days: number;
  downloadsRatio: number;
  humanDownloadsLast30Days: string;
  popular: boolean;
  version: string;
  versions: {
    [a: string]: string;
  };
  tags: { latest: string };
  description: string;
  dependencies: {};
  devDependencies: {};
  repository: {
    url: string;
    project: string;
    user: string;
    host: string;
    path: string;
    head: string;
    branch: string;
  };
  githubRepo: {
    user: string;
    project: string;
    path: string;
    head: string;
  };
  gitHead: string;
  readme: string;
  owner: {
    name: string;
    avatar: string;
    link: string;
  };
  deprecated: boolean;
  homepage: string;
  license: string;
  keywords: string[];
  computedKeywords: [];
  computedMetadata: {};
  created: number;
  modified: number;
  lastPublisher: {
    name: string;
    email: string;
    avatar: string;
    link: string;
  };
  owners: [
    {
      email: string;
      name: string;
      avatar: string;
      link: string;
    }
  ];
  types: { [a: string]: string };
  moduleTypes: ['unknown'];
  lastCrawl: string;
  _searchInternal: {
    alternativeNames: string[];
    popularName: string;
    downloadsMagnitude: number;
    jsDelivrPopularity: number;
  };
  dependents: number;
  humanDependents: string;
  changelogFilename: null;
  jsDelivrHits: number;
  objectID: string;
  // _highlightResult: {
  //   name: { value: 'lodash', matchLevel: 'none', matchedWords: [] },
  //   description: {
  //     value: 'Lodash modular utilities.',
  //     matchLevel: 'none',
  //     matchedWords: [],
  //   },
  //   owner: { name: { value: 'lodash', matchLevel: 'none', matchedWords: [] } },
  //   keywords: [
  //     { value: 'modules', matchLevel: 'none', matchedWords: [] },
  //     { value: 'stdlib', matchLevel: 'none', matchedWords: [] },
  //     { value: 'util', matchLevel: 'none', matchedWords: [] },
  //   ],
  //   owners: [
  //     { name: { value: 'bnjmnt4n', matchLevel: 'none', matchedWords: [] } },
  //     { name: { value: 'jdalton', matchLevel: 'none', matchedWords: [] } },
  //     { name: { value: 'mathias', matchLevel: 'none', matchedWords: [] } },
  //   ],
  //   _searchInternal: {
  //     alternativeNames: [
  //       { value: 'lodash', matchLevel: 'none', matchedWords: [] },
  //       { value: 'lodash.js', matchLevel: 'none', matchedWords: [] },
  //       { value: 'lodashjs', matchLevel: 'none', matchedWords: [] },
  //     ],
  //     popularName: { value: 'lodash', matchLevel: 'none', matchedWords: [] },
  //   },
  // },
};

type State = {
  project: {
    title: string;
    description: string;
    alias: string;
  };
  tags: {
    tagName: string;
  };
  openedWorkspaceItem: string | null;
  workspaceHidden: boolean;
  showDeleteSandboxModal: boolean;
  dependencies: Dependency[];
  starterDependencies: Dependency[];
  selectedDependencies:
    | {
        [a: string]: Dependency;
      }
    | {};
  loadingDependencySearch: boolean;
  hitToVersionMap: Map<any, any>;
};

export const state: State = {
  project: {
    title: '',
    description: '',
    alias: '',
  },
  tags: {
    tagName: '',
  },
  openedWorkspaceItem: null,
  workspaceHidden: false,
  showDeleteSandboxModal: false,
  dependencies: [],
  starterDependencies: [],
  selectedDependencies: {},
  loadingDependencySearch: false,
  hitToVersionMap: new Map(),
};
