import { RepoInfo } from './types';

type SidebarState = {
  hasSyncedSandboxes: boolean | null;
  hasTemplates: boolean | null;
  repositories: Array<RepoInfo>;
};

export type State = Record<string, SidebarState>;

export const state: State = {};
