import { GetGithubRepoQuery } from 'app/graphql/types';
import { TemplateType } from '@codesandbox/common/lib/templates';

export type CreateParams = {
  sandboxId: string;
  name?: string;
  createAs: 'devbox' | 'sandbox';
  permission: 0 | 1 | 2;
  editor: 'csb' | 'vscode';
  customVMTier?: number;
};

export type GithubTemplate = {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  tags: string[];
  editorUrl: string;
  forkCount: number;
  viewCount: number;
  author: string | null;
};

export interface OfficialTemplatesResponseType {
  sandboxes: {
    id: string;
    title: string | null;
    alias: string | null;
    description: string | null;
    v2?: boolean;
    fork_count: number;
    view_count: number;
    environment: TemplateType;
    custom_template: {
      icon_url: string;
    };
  }[];
}

export type SandboxToFork = {
  id: string;
  alias: string | null;
  title: string | null;
  description: string | null;
  editorUrl?: string;
  author: string;
  tags: string[];
  type: 'devbox' | 'sandbox';
  forkCount: number;
  viewCount: number;
  iconUrl?: string;
  sourceTemplate?: string;
  browserSandboxId?: string;
};

export interface TemplateCollection {
  title?: string;
  key: string;
  templates: SandboxToFork[];
}

export type RepoDefinition = {
  owner: string;
  name: string;
};

export type GithubRepoToImport = NonNullable<
  GetGithubRepoQuery['githubRepo']
> & { appInstalled: boolean | undefined }; // When appInstalled is undefined, it must be queried separately

export type PrivacyLevel = 0 | 1 | 2;
