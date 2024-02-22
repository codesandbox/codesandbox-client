import { TemplateFragment } from 'app/graphql/types';

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
