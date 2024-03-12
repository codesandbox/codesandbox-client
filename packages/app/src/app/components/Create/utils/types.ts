import { TemplateFragment, GetGithubRepoQuery } from 'app/graphql/types';

export type CreateParams = {
  name?: string;
  createAs: 'devbox' | 'sandbox';
  permission: 0 | 1 | 2;
  editor: 'csb' | 'vscode';
  customVMTier?: number;
};

export interface TemplateCollection {
  title?: string;
  key: string;
  templates: TemplateFragment[];
  isOwned?: boolean;
}

export type RepoDefinition = {
  owner: string;
  name: string;
};

export type GithubRepoToImport = NonNullable<
  GetGithubRepoQuery['githubRepo']
> & { appInstalled: boolean | undefined }; // When appInstalled is undefined, it must be queried separately
