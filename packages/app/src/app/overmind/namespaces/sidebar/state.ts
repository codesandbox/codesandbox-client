import type {
  SidebarCollectionFragmentFragment,
  SidebarSyncedSandboxFragmentFragment,
  SidebarTemplateFragmentFragment,
} from 'app/graphql/types';

/**
 * SidebarState, required to be named just State. Can be an interface instead
 * of a type though.
 *
 * ❗️ TODO: Add sidebar notification indicator state
 */
export interface State {
  syncedSandboxes: Array<SidebarSyncedSandboxFragmentFragment> | null;
  collections: Array<SidebarCollectionFragmentFragment> | null;
  templates: Array<SidebarTemplateFragmentFragment> | null;
}

/**
 * Default state for the sidebar
 */
export const state: State = {
  syncedSandboxes: null,
  collections: null,
  templates: null,
};
