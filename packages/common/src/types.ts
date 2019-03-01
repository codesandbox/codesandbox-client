// @flow
import * as React from 'react';

export type ModuleError = {
  message: string;
  line: number;
  column: number;
  title: string;
  moduleId: string | undefined;
  severity: 'error' | 'warning';
  type: 'compile' | 'dependency-not-found' | 'no-dom-change';
  payload: Object;
};

export type ModuleCorrection = {
  message: string;
  line: number;
  column: number;
  moduleId: string;
  source: string | undefined;
  severity: 'notice' | 'warning';
};

export type Module = {
  id: string;
  title: string;
  code: string | undefined;
  shortid: string;
  directoryShortid: string | undefined;
  isNotSynced: boolean;
  sourceId: string;
  isBinary: boolean;
};

export type Directory = {
  id: string;
  title: string;
  directoryShortid: string | undefined;
  shortid: string;
  sourceId: string;
};

export type Badge = {
  id: string;
  name: string;
  visible: boolean;
};

export type CurrentUser = {
  id: string | undefined;
  email: string | undefined;
  name: string | undefined;
  username: string;
  avatarUrl: string | undefined;
  jwt: string | undefined;
  subscription:
    | {
        since: string;
        amount: string;
      }
    | undefined;
  curatorAt: string;
  badges: Array<Badge>;
  integrations: {
    zeit?: {
      token: string;
      email: string | undefined;
    };
    github?: {
      email: string;
    };
  };
};

export type SmallSandbox = {
  id: string;
  title: string | undefined;
  insertedAt: string;
  updatedAt: string;
  likeCount: number;
  viewCount: number;
  forkCount: number;
  template: string;
  privacy: 0 | 1 | 2;
};

export type PaginatedSandboxes = {
  [page: number]: Array<SmallSandbox>;
};

export type User = {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  showcasedSandboxShortid: string | undefined;
  sandboxCount: number;
  givenLikeCount: number;
  receivedLikeCount: number;
  viewCount: number;
  forkedCount: number;
  sandboxes: PaginatedSandboxes;
  likedSandboxes: PaginatedSandboxes;
  badges: Array<Badge>;
  subscriptionSince: string;
};

export type GitInfo = {
  repo: string;
  username: string;
  path: string;
  branch: string;
  commitSha: string;
};

export type Sandbox = {
  id: string;
  title: string | undefined;
  description: string;
  viewCount: number;
  likeCount: number;
  forkCount: number;
  userLiked: boolean;
  modules: Array<Module>;
  directories: Array<Directory>;
  owned: boolean;
  npmDependencies: {
    [dep: string]: string;
  };
  externalResources: Array<string>;
  privacy: 0 | 1 | 2;
  author: User | undefined;
  forkedFromSandbox: { title: string; id: string } | undefined;
  git: GitInfo | undefined;
  tags: Array<string>;
  /**
   * This is the source it's assigned to, a source contains all dependencies, modules and directories
   *
   * @type {string}
   */
  sourceId: string;
  template:
    | 'create-react-app'
    | 'create-react-app-typescript'
    | 'angular-cli'
    | '@dojo/cli-create-app'
    | 'vue-cli'
    | 'preact-cli'
    | 'svelte';
  entry: string;
  originalGit: GitInfo | undefined;
  originalGitCommitSha: string | undefined;
  originalGitChanges:
    | {
        added: Array<string>;
        modified: Array<string>;
        deleted: Array<string>;
        rights: 'none' | 'read' | 'write' | 'admin';
      }
    | undefined;
  version: number;
  screenshotUrl: string | undefined;
};

export type Preferences = {
  autoCompleteEnabled: boolean | undefined;
  vimMode: boolean | undefined;
  livePreviewEnabled: boolean | undefined;
  prettifyOnSaveEnabled: boolean | undefined;
  lintEnabled: boolean | undefined;
  instantPreviewEnabled: boolean | undefined;
  fontSize: number | undefined;
  fontFamily: string | undefined;
  clearConsoleEnabled: boolean | undefined;
  prettierConfig: Object;
  autoDownloadTypes: boolean | undefined;
  newPackagerExperiment: boolean | undefined;
  zenMode: boolean | undefined;
};

export type NotificationButton = {
  title: string;
  action: Function;
};

export type Notification = {
  id: number;
  title: string;
  type: 'notice' | 'success' | 'warning' | 'error';
  number: Date;
  buttons: Array<NotificationButton> | undefined;
};

export type Modal = {
  open: boolean;
  title: string | undefined;
  Body: React.Component<any> | undefined;
};

export type PackageJSON = {
  name: string;
  description: string;
  keywords: Array<string>;
  main: string;
  dependencies: {
    [dep: string]: string;
  };
  devDependencies: {
    [dep: string]: string;
  };
};
