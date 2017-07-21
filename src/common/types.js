// @flow
import React from 'react';

export type ModuleError = {
  message: string,
  line: number,
  column: number,
  title: string,
  moduleId: ?string,
  severity: 'error' | 'warning',
  type: 'compile' | 'dependency-not-found' | 'no-dom-change',
  payload: Object,
};

export type Module = {
  id: string,
  title: string,
  code: ?string,
  shortid: string,
  directoryShortid: ?string,
  isNotSynced: boolean,
};

export type Directory = {
  id: string,
  title: string,
  directoryShortid: ?string,
  shortid: string,
};

export type Badge = {
  id: string,
  name: string,
  visible: boolean,
};

export type CurrentUser = {
  id: ?string,
  email: ?string,
  name: ?string,
  username: ?string,
  avatarUrl: ?string,
  jwt: ?string,
  subscription: ?{
    since: string,
    amount: string,
  },
  badges: Array<Badge>,
};

export type SmallSandbox = {
  id: string,
  title: ?string,
  insertedAt: string,
  updatedAt: string,
  likeCount: number,
  viewCount: number,
  forkCount: number,
  privacy: 0 | 1 | 2,
};

export type PaginatedSandboxes = {
  [page: number]: Array<SmallSandbox>,
};

export type User = {
  id: string,
  username: string,
  name: string,
  avatarUrl: string,
  showcasedSandboxShortid: ?string,
  sandboxCount: number,
  givenLikeCount: number,
  receivedLikeCount: number,
  viewCount: number,
  forkedCount: number,
  sandboxes: PaginatedSandboxes,
  likedSandboxes: PaginatedSandboxes,
  badges: Array<Badge>,
  subscriptionSince: string,
};

export type GitInfo = {
  repo: string,
  username: string,
  path: string,
  branch: string,
  commitSha: string,
};

export type Sandbox = {
  id: string,
  title: ?string,
  description: string,
  viewCount: number,
  likeCount: number,
  forkCount: number,
  userLiked: boolean,
  modules: Array<string | Module>,
  currentModule: ?string,
  isInProjectView: ?boolean,
  initialPath?: string,
  directories: Array<string | Directory>,
  owned: boolean,
  npmDependencies: {
    [dep: string]: string,
  },
  externalResources: Array<string>,
  isInProjectView: ?boolean,
  dependencyBundle: ?{
    externals?: Object,
    hash?: string,
    url?: string,
    error?: string,
    processing?: boolean,
  },
  privacy: 0 | 1 | 2,
  showEditor: ?boolean,
  showPreview: ?boolean,
  author: ?User,
  forkedFromSandbox: ?{ title: string, id: string },
  errors: Array<ModuleError>,
  git: ?GitInfo,
  tags: Array<string>,
};

export type Preferences = {
  autoCompleteEnabled: ?boolean,
  vimMode: ?boolean,
  livePreviewEnabled: ?boolean,
  prettifyOnSaveEnabled: ?boolean,
  lintEnabled: ?boolean,
  instantPreviewEnabled: ?boolean,
  fontSize: ?number,
  clearConsoleEnabled: ?boolean,
};

export type NotificationButton = {
  title: string,
  action: Function,
};

export type Notification = {
  id: number,
  title: string,
  type: 'notice' | 'success' | 'warning' | 'error',
  number: Date,
  buttons: ?Array<NotificationButton>,
};

export type Modal = {
  open: boolean,
  title: ?string,
  Body: ?React.Element<*>,
};
