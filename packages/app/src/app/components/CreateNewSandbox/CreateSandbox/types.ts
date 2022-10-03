import { TemplateFragment } from 'app/graphql/types';

export type CreateSandboxParams = {
  name?: string;
  githubOwner?: string;
  createRepo: boolean;
};

export interface TemplateInfo {
  title?: string;
  key: string;
  templates: TemplateFragment[];
  isOwned?: boolean;
}
