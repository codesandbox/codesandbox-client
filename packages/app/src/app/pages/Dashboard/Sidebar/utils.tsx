import React from 'react';
import { PageTypes } from '../types';

export const SidebarContext = React.createContext(null);

export const MAP_SIDEBAR_ITEM_EVENT_TO_PAGE_TYPE: Partial<Record<
  PageTypes,
  string
>> = {
  recent: 'Dashboard - View Recent',
  'my-contributions': 'Dashboard - View My Contributions',
  repositories: 'Dashboard - View Repositories',
  drafts: 'Dashboard - View Drafts',
  templates: 'Dashboard - View Templates',
  sandboxes: 'Dashboard - View Sandboxes',
  'synced-sandboxes': 'Dashboard - View Synced Sandboxes',
  deleted: 'Dashboard - View Recently deleted',
  discover: 'Dashboard - View Discover',
  shared: 'Dashboard - View Shared',
  liked: 'Dashboard - View Liked',
};

export const linkStyles = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 8,
  paddingRight: 8,
  flex: 1,
  color: 'inherit',
};
