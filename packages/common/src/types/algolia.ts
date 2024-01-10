export interface AlgoliaSandboxHit {
  alias: string | null;
  author: Author | null;
  custom_template: CustomTemplate;
  description: string | null;
  external_resources: string[];
  fork_count: number;
  forked_sandbox: string;
  git: {
    path: string | null;
    repo: string;
    branch: string;
    username: string;
    commit_sha: string;
  };
  inserted_at: number;
  like_count: number;
  npm_dependencies: NpmDependency[];
  objectID: string;
  picks: string[];
  tags: string[];
  team: { id: string; name: string } | null;
  template: string;
  title: string | null;
  updated_at: number;
  view_count: number;
}

interface NpmDependency {
  version: string;
  dependency: string;
}

interface CustomTemplate {
  url: string | null;
  title: string;
  published: boolean;
  official: boolean;
  id: string;
  icon_url: string | null;
  color: string;
  v2: boolean | null;
}

interface Author {
  username: string;
  avatar_url: string;
}

export interface Dependency {
  name: string;
  downloadsLast30Days: number;
  downloadsRatio: number;
  humanDownloadsLast30Days: string;
  popular: boolean;
  version: string;
  versions: {
    [versionNumber: string]: string;
  };
  tags: { latest: string };
  description: string;
  dependencies: {
    [name: string]: string;
  };

  devDependencies: {
    [name: string]: string;
  };
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
  types: { [url: string]: string };
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
  _highlightResult: {
    name: { value: string; matchLevel: string; matchedWords: string[] };
    description: {
      value: string;
      matchLevel: string;
      matchedWords: string[];
    };
    owner: {
      name: { value: string; matchLevel: string; matchedWords: string[] };
    };
    keywords: { value: string; matchLevel: string; matchedWords: string[] }[];
    owners: {
      name: { value: string; matchLevel: string; matchedWords: string[] };
    }[];
    _searchInternal: {
      alternativeNames: {
        value: string;
        matchLevel: string;
        matchedWords: [];
      }[];
      popularName: {
        value: string;
        matchLevel: string;
        matchedWords: string[];
      };
    };
  };
}
