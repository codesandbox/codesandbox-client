import type { SidebarCollectionFragmentFragment } from 'app/graphql/types';

// Updated Collection type to align with what we need in the dashboard. The GraphQL
// result doesn't contain name and parent, so we generate these in the frontend.
type SidebarCollection = Pick<SidebarCollectionFragmentFragment, 'path'> & {
  name: string;
  parent: string;
};

/**
 * SidebarState, required to be named just State. Can be an interface instead
 * of a type though.
 *
 * ❗️ TODO: Add sidebar notification indicator state
 */
export interface State {
  hasSyncedSandboxes: boolean | null;
  hasTemplates: boolean | null;
  collections: Array<SidebarCollection> | null;
}

/**
 * Default state for the sidebar
 */
export const state: State = {
  hasSyncedSandboxes: null,
  hasTemplates: null,
  collections: null,
};
