import * as React from 'react';
import { TemplateType } from '../templates';

export type SSEContainerStatus =
  | 'initializing'
  | 'container-started'
  | 'sandbox-started'
  | 'stopped'
  | 'hibernated'
  | 'error';
export type SSEManagerStatus = 'connected' | 'disconnected' | 'initializing';

export type ModuleError = {
  message: string;
  line: number;
  column: number;
  title: string;
  path: string;
  severity: 'error' | 'warning';
  type: 'compile' | 'dependency-not-found' | 'no-dom-change';
  payload: Object;
  source: string | undefined;
};

export type Contributor = {
  login: string;
};

export type ModuleCorrection = {
  message: string;
  line: number;
  column: number;
  lineEnd?: number;
  columnEnd?: number;
  source: string | undefined;
  path: string | undefined;
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
  path?: string;
};

export type Directory = {
  id: string;
  title: string;
  directoryShortid: string | undefined;
  shortid: string;
  sourceId: string;
};

export type Template = {
  name: TemplateType;
  niceName: string;
  shortid: string;
  url: string;
  main: boolean;
  color: string;
  backgroundColor: () => string | undefined;

  popular: boolean;
  showOnHomePage: boolean;
  distDir: string;
  netlify: boolean;
  isTypescript: boolean;
  externalResourcesEnabled: boolean;
  showCube: boolean;
  isServer: boolean;
  mainFile: undefined | string[];
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

export type CustomTemplate = {
  color?: string;
  title: string;
  id: string;
  iconUrl?: string;
  url: string | null;
};

export type GitInfo = {
  repo: string;
  username: string;
  path: string;
  branch: string;
  commitSha: string;
};

export type SmallSandbox = {
  id: string;
  title: string | null;
  alias: string | null;
  customTemplate: CustomTemplate | null;
  insertedAt: string;
  updatedAt: string;
  likeCount: number;
  viewCount: number;
  forkCount: number;
  template: string;
  privacy: 0 | 1 | 2;
  git: GitInfo | null;
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

export type Sandbox = {
  id: string;
  alias: string | undefined;
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
  customTemplate: CustomTemplate | null;
  forkedTemplate: CustomTemplate | null;
  externalResources: string[];
  privacy: 0 | 1 | 2;
  author: User | undefined;
  forkedFromSandbox: SmallSandbox | undefined;
  git: GitInfo | undefined;
  tags: string[];
  /**
   * This is the source it's assigned to, a source contains all dependencies, modules and directories
   *
   * @type {string}
   */
  sourceId: string;
  template: TemplateType;
  entry: string;
  originalGit: GitInfo | undefined;
  originalGitCommitSha: string | undefined;
  originalGitChanges:
    | {
        added: string[];
        modified: string[];
        deleted: string[];
        rights: 'none' | 'read' | 'write' | 'admin';
      }
    | undefined;
  version: number;
  screenshotUrl: string | undefined;
};

export type PrettierConfig = {
  fluid: boolean;
  printWidth: number;
  tabWidth: number;
  useTabs: boolean;
  semi: boolean;
  singleQuote: boolean;
  trailingComma: string;
  bracketSpacing: boolean;
  jsxBracketSameLine: boolean;
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
  prettierConfig: PrettierConfig;
  autoDownloadTypes: boolean | undefined;
  newPackagerExperiment: boolean | undefined;
  zenMode: boolean | undefined;
  keybindings: any[];
};

export type NotificationButton = {
  title: string;
  action: Function;
};

export type Notification = {
  id: number;
  title: string;
  type: 'notice' | 'success' | 'warning' | 'error';
  endTime: number;
  buttons: Array<NotificationButton>;
};

export type Modal = {
  open: boolean;
  title: string | undefined;
  Body: React.Component<any> | undefined;
};

export type PackageJSON = {
  name: string;
  description: string;
  keywords: string[];
  main: string;
  dependencies: {
    [dep: string]: string;
  };
  devDependencies: {
    [dep: string]: string;
  };
};

export type UploadFile = {
  id: string;
  url: string;
  objectSize: number;
  name: string;
  path: string;
};
