import { SandboxFragmentDashboardFragment as Sandbox } from 'app/graphql/types';
import { RepoInfo } from './types';

type SidebarState = {
  hasSyncedSandboxes: boolean | null;
  hasTemplates: boolean | null;
  repositories: Array<RepoInfo>;
  sandboxes: Array<Sandbox>;
};

export type State = Record<string, SidebarState>;

export const state: State = {};
