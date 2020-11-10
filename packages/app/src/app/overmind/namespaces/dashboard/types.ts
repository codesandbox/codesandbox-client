import { SidebarCollectionDashboardFragment as Collection } from 'app/graphql/types';

export type PageTypes =
  | 'search'
  | 'home'
  | 'recents'
  | 'deleted'
  | 'templates'
  | 'drafts'
  | 'sandboxes'
  | 'repos'
  | 'always-on';

export type OrderBy = {
  field: string;
  order: 'desc' | 'asc';
};

export type DELETE_ME_COLLECTION = Collection & {
  name: string;
  level: number;
  parent: string;
};

export enum sandboxesTypes {
  DRAFTS = 'DRAFTS',
  TEMPLATES = 'TEMPLATES',
  DELETED = 'DELETED',
  RECENT = 'RECENT',
  HOME = 'HOME',
  TEMPLATE_HOME = 'TEMPLATE_HOME',
  RECENT_HOME = 'RECENT_HOME',
  ALL = 'ALL',
  SEARCH = 'SEARCH',
  REPOS = 'REPOS',
  ALWAYS_ON = 'ALWAYS_ON',
}
