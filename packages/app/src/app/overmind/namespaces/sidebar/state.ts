type SidebarState = {
  hasSyncedSandboxes: boolean | null;
  hasTemplates: boolean | null;
  repositories: Array<{ name: string; owner: string }>;
};

export type State = Record<string, SidebarState>;

export const state: State = {};
