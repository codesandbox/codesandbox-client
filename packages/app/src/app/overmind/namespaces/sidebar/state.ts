/**
 * SidebarState, required to be named just State. Can be an interface instead
 * of a type though.
 *
 * ❗️ TODO: Add sidebar notification indicator state
 */
export interface State {
  hasSyncedSandboxes: boolean | null;
  hasTemplates: boolean | null;
}

/**
 * Default state for the sidebar
 */
export const state: State = {
  hasSyncedSandboxes: null,
  hasTemplates: null,
};
