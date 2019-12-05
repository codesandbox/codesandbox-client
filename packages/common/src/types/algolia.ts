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
}

interface Author {
  username: string;
  avatar_url: string;
}
