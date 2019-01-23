// @flow
import * as React from 'react';

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

export type ModuleCorrection = {
  message: string,
  line: number,
  column: number,
  moduleId: string,
  source: ?string,
  severity: 'notice' | 'warning',
};

export type Module = {
  id: string,
  title: string,
  code: ?string,
  shortid: string,
  directoryShortid: ?string,
  isNotSynced: boolean,
  sourceId: string,
  isBinary: boolean,
};

export type Directory = {
  id: string,
  title: string,
  directoryShortid: ?string,
  shortid: string,
  sourceId: string,
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
  username: string,
  avatarUrl: ?string,
  jwt: ?string,
  subscription: ?{
    since: string,
    amount: string,
  },
  curatorAt: string,
  badges: Array<Badge>,
  integrations: {
    zeit?: {
      token: string,
      email: ?string,
    },
    github?: {
      email: string,
    },
  },
};

export type SmallSandbox = {
  id: string,
  title: ?string,
  insertedAt: string,
  updatedAt: string,
  likeCount: number,
  viewCount: number,
  forkCount: number,
  template: string,
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
  modules: Array<Module>,
  directories: Array<Directory>,
  owned: boolean,
  npmDependencies: {
    [dep: string]: string,
  },
  externalResources: Array<string>,
  privacy: 0 | 1 | 2,
  author: ?User,
  forkedFromSandbox: ?{ title: string, id: string },
  git: ?GitInfo,
  tags: Array<string>,
  /**
   * This is the source it's assigned to, a source contains all dependencies, modules and directories
   *
   * @type {string}
   */
  sourceId: string,
  template:
    | 'create-react-app'
    | 'create-react-app-typescript'
    | 'angular-cli'
    | '@dojo/cli-create-app'
    | 'vue-cli'
    | 'preact-cli'
    | 'svelte',
  entry: string,
  originalGit: ?GitInfo,
  originalGitCommitSha: ?string,
  originalGitChanges: ?{
    added: Array<string>,
    modified: Array<string>,
    deleted: Array<string>,
    rights: 'none' | 'read' | 'write' | 'admin',
  },
  version: number,
  screenshotUrl: ?string,
};

export type Preferences = {
  autoCompleteEnabled: ?boolean,
  vimMode: ?boolean,
  livePreviewEnabled: ?boolean,
  prettifyOnSaveEnabled: ?boolean,
  lintEnabled: ?boolean,
  instantPreviewEnabled: ?boolean,
  fontSize: ?number,
  fontFamily: ?string,
  clearConsoleEnabled: ?boolean,
  prettierConfig: Object,
  autoDownloadTypes: ?boolean,
  newPackagerExperiment: ?boolean,
  zenMode: ?boolean,
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
  Body: ?React.Element<any>,
};

export type PackageJSON = {
  name: string,
  description: string,
  keywords: Array<string>,
  main: string,
  dependencies: {
    [dep: string]: string,
  },
  devDependencies: {
    [dep: string]: string,
  },
};
