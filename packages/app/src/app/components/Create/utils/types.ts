import { GetGithubRepoQuery } from 'app/graphql/types';

export type CreateParams = {
  name?: string;
  createAs: 'devbox' | 'sandbox';
  permission: 0 | 1 | 2;
  editor: 'csb' | 'vscode';
  customVMTier?: number;
};

export type SandboxToFork = {
  id: string;
  alias: string | null;
  title: string | null;
  description: string | null;
  insertedAt: string;
  updatedAt: string;
  isV2: boolean;
  forkCount: number;
  viewCount: number;
  iconUrl?: string;
  sourceTemplate?: string;
  owner: string;
};

export interface TemplateCollection {
  title?: string;
  key: string;
  templates: SandboxToFork[];
  isOwned?: boolean;
}

export type RepoDefinition = {
  owner: string;
  name: string;
};

export type GithubRepoToImport = NonNullable<
  GetGithubRepoQuery['githubRepo']
> & { appInstalled: boolean | undefined }; // When appInstalled is undefined, it must be queried separately
