import React from 'react';
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
  id?: string;
  title: string;
  code: string | undefined;
  savedCode: string | undefined;
  shortid: string;
  directoryShortid: string | undefined;
  isNotSynced: boolean;
  sourceId: string;
  isBinary: boolean;
  insertedAt: string;
  updatedAt: string;
  path?: string;
  now?: any;
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
      email?: string;
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
  alias: string | null;
  customTemplate: CustomTemplate | null;
  title: string;
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
  currentModuleShortid: string;
  viewCount: number;
  forkedCount: number;
  sandboxes: PaginatedSandboxes;
  likedSandboxes: PaginatedSandboxes;
  badges: Array<Badge>;
  subscriptionSince: string;
  selection: Selection;
  color: any;
};

export type RoomInfo = {
  startTime: number;
  ownerIds: string[];
  roomId: string;
  mode: string;
  chatEnabled: boolean;
  sandboxId: string;
  editorIds: string[];
  users: User[];
  chat: {
    messages: Array<{
      userId: string;
      date: number;
      message: string;
    }>;
    // We keep a separate map of user_id -> username for the case when
    // a user disconnects. We still need to keep track of the name.
    users: {
      [id: string]: string;
    };
  };
};

export type PaymentDetails = {
  brand: string;
  expMonth: number;
  expYear: number;
  last4: string;
  name: string;
};

export type SandboxPick = {
  title: string;
  description: string;
  id: string;
  insertedAt: string;
};

export type MiniSandbox = {
  viewCount: number;
  title: string;
  template: string;
  id: string;
  picks: SandboxPick[];
  description: string;
  git: GitInfo;
  author: User;
};

export type GitCommit = {
  git: GitInfo;
  merge: boolean;
  newBranch: string;
  sha: string;
  url: string;
};

export type GitPr = {
  git: GitInfo;
  newBranch: string;
  sha: string;
  url: string;
  prURL: string;
};

export type PopularSandboxes = {
  startDate: string;
  sandboxes: MiniSandbox[];
  endDate: string;
};

export type PickedSandboxes = {
  sandboxes: MiniSandbox[];
  page: number;
};

export type PickedSandboxDetails = {
  title: string;
  id: string;
  description: string;
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
  collection: boolean;
  owned: boolean;
  npmDependencies: {
    [dep: string]: string;
  };
  customTemplate: CustomTemplate | null;
  forkedTemplate: CustomTemplate | null;
  externalResources: string[];
  team: {
    id: string;
  };
  roomId: string;
  privacy: 0 | 1 | 2;
  author: User | undefined;
  forkedFromSandbox: SmallSandbox | undefined;
  git: GitInfo | undefined;
  tags: string[];
  isFrozen: boolean;
  environmentVariables: EnvironmentVariable[];
  /**
   * This is the source it's assigned to, a source contains all dependencies, modules and directories
   *
   * @type {string}
   */
  sourceId: string;
  source?: {
    template: string;
  };
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

export type Settings = {
  autoResize: boolean;
  enableEslint: boolean;
  forceRefresh: boolean;
  codeMirror: boolean;
  lineHeight: number;
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
  jsxBracketSameLine: boolean;
  printWidth: number;
  semi: boolean;
  singleQuote: boolean;
  tabWidth: number;
  trailingComma: string;
  useTabs: boolean;
  enableLigatures: boolean;
  customVSCodeTheme: string;
  manualCustomVSCodeTheme: string;
  experimentVSCode: boolean;
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

export type Selection = {
  selection: number[];
  cursorPosition: number;
};

export type UserSelection = {
  primary: Selection;
  secondary: Selection[];
};

export type EditorSelection = {
  userId: string;
  name: string;
  selection: UserSelection;
  color: number[];
};

export type EditorError = {
  column: number;
  line: number;
  columnEnd: number;
  lineEnd: number;
  message: string;
  source: string;
  title: string;
  path: string;
};

export type EditorCorrection = {
  column: number;
  line: number;
  columnEnd: number;
  lineEnd: number;
  message: string;
  source: string;
  path: string;
  severity: string;
};

export enum WindowOrientation {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL',
}

export type Profile = {
  viewCount: number;
  username: string;
  subscriptionSince: string;
  showcasedSandboxShortid: string;
  sandboxCount: number;
  receivedLikeCount: number;
  name: string;
  id: string;
  givenLikeCount: number;
  forkedCount: number;
  badges: Badge[];
  avatarUrl: string;
};

export type UserSandbox = {
  id: string;
  title: string;
  insertedAt: string;
  updatedAt: string;
};

export enum ServerStatus {
  INITIALIZING = 'initializing',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
}

export enum ServerContainerStatus {
  INITIALIZING = 'initializing',
  CONTAINER_STARTED = 'container-started',
  SANDBOX_STARTED = 'sandbox-started',
  STOPPED = 'stopped',
  HIBERNATED = 'hibernated',
  ERROR = 'error',
}

export type ZeitUser = {
  uid: string;
  email: string;
  name: string;
  username: string;
  avatar: string;
  platformVersion: number;
  billing: {
    plan: string;
    period: string;
    trial: string;
    cancelation: string;
    addons: string;
  };
  bio: string;
  website: string;
  profiles: Array<{
    service: string;
    link: string;
  }>;
};

export type ZeitCreator = {
  uid: string;
};

export type ZeitScale = {
  current: number;
  min: number;
  max: number;
};

export type ZeitAlias = {
  alias: string;
  created: string;
  uid: string;
};

export enum ZeitDeploymentState {
  'DEPLOYING',
  'INITIALIZING',
  'DEPLOYMENT_ERROR',
  'BOOTED',
  'BUILDING',
  'READY',
  'BUILD_ERROR',
  'FROZEN',
  'ERROR',
}

export enum ZeitDeploymentType {
  'NPM',
  'DOCKER',
  'STATIC',
  'LAMBDAS',
}

export type ZeitDeployment = {
  uid: string;
  name: string;
  url: string;
  created: number;
  state: ZeitDeploymentState;
  instanceCount: number;
  alias: ZeitAlias[];
  scale: ZeitScale;
  createor: ZeitCreator;
  type: ZeitDeploymentType;
};

export type ZeitConfig = {
  name?: string;
  alias?: string;
};

export type NetlifySite = {
  id: string;
  site_id: string;
  name: string;
  url: string;
  state: string;
  screenshot_url: string;
  sandboxId: string;
};

export type Dependency = {
  name: string;
  version: string;
};

export enum TabType {
  MODULE = 'MODULE',
  DIFF = 'DIFF',
}

export type ModuleTab = {
  type: TabType.MODULE;
  moduleShortid: string;
  dirty: boolean;
};

export type DiffTab = {
  id: string;
  type: TabType.DIFF;
  codeA: string;
  codeB: string;
  titleA: string;
  titleB: string;
  fileTitle?: string;
};

export type Tabs = Array<ModuleTab | DiffTab>;

export type GitChanges = {
  added: string[];
  deleted: string[];
  modified: string[];
  rights: string;
};

export type EnvironmentVariable = {
  name: string;
  value: any;
};

export type UploadedFilesInfo = {
  uploads: UploadFile[];
  maxSize: number;
  currentSize: number;
};

export type SandboxUrlSourceData = {
  id?: string;
  alias?: string;
  git?: GitInfo;
};
