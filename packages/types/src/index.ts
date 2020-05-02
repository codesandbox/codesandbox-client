import { Component } from 'react';

export type Badge = {
  id: string;
  name: string;
  visible: boolean;
};

export enum CommentsFilterOption {
  ALL = 'All',
  OPEN = 'Open',
  RESOLVED = 'Resolved',
}

export type Configuration = {
  description: string;
  moreInfoUrl: string;
  title: string;
  type: string;
};

export type Contributor = {
  login: string;
};

export type CurrentUser = {
  avatarUrl: string;
  badges: Badge[];
  curatorAt: string;
  email: string;
  experiments: {
    [key: string]: boolean;
  };
  id: string;
  integrations: {
    github: {
      email: string;
    } | null;
    zeit: {
      email?: string;
      token: string;
    } | null;
  };
  name: string | null;
  provider: 'github' | 'google';
  sendSurvey: boolean;
  subscription: {
    amount: number;
    cancelAtPeriodEnd: boolean;
    duration: 'monthly' | 'yearly';
    plan: 'pro' | 'patron';
    since: string;
  } | null;
  username: string;
};

export type CustomTemplate = {
  color?: string;
  iconUrl?: string;
  id: string;
  published?: boolean;
  title: string;
  url: string | null;
};

export type Dependency = {
  name: string;
  version: string;
};

export type DevToolsTabPosition = {
  devToolIndex: number;
  tabPosition: number;
};

export type DiffTab = {
  codeA: string;
  codeB: string;
  fileTitle?: string;
  id: string;
  titleA: string;
  titleB: string;
  type: TabType.DIFF;
};

export type Directory = {
  directoryShortid: string | null;
  id: string;
  path: string | null;
  shortid: string;
  sourceId: string;
  title: string;
  type: 'directory';
};

export type EnvironmentVariable = {
  name: string;
  value: any;
};

export type EditorSelection = {
  color: number[];
  name: string | null;
  selection: UserSelection | null;
  userId: string;
};

export type ForkedSandbox = {
  alias: string | null;
  customTemplate: CustomTemplate | null;
  git: GitInfo | null;
  id: string;
  insertedAt: string;
  privacy: 0 | 1 | 2;
  template: string;
  title: string | null;
  updatedAt: string;
};

export type GitChanges = {
  added: Array<{
    content: string;
    encoding: 'base64' | 'utf-8';
    path: string;
  }>;
  deleted: string[];
  modified: Array<{
    content: string;
    encoding: 'base64' | 'utf-8';
    path: string;
  }>;
};

export type GitCommit = {
  git: GitInfo;
  merge: boolean;
  newBranch: string;
  sha: string;
  url: string;
};

export type GitFileCompare = {
  additions: number;
  changes: number;
  content?: string;
  deletions: number;
  filename: string;
  isBinary: boolean;
  status: 'added' | 'modified' | 'removed';
};

export type GitInfo = {
  branch: string;
  commitSha: string | null;
  path: string;
  repo: string;
  username: string;
};

export type GitPathChanges = {
  added: string[];
  deleted: string[];
  modified: string[];
};

export type GitPr = {
  additions: number;
  baseCommitSha: string;
  branch: string;
  changed_files: number;
  commitSha: string;
  commits: number;
  deletions: number;
  mergeable: boolean;
  mergeableState: string;
  merged: boolean;
  number: number;
  rebaseable: boolean;
  repo: string;
  state: string;
  username: string;
};

export interface IModuleState {
  [moduleId: string]: IModuleStateModule;
}

export interface IModuleStateModule {
  code?: string;
  revision?: number;
  saved_code?: string | null;
  synced?: boolean;
}

export type LiveDisconnectReason = 'close' | 'inactivity';

export type LiveMessage<data = unknown> = {
  _isOwnMessage: boolean;
  data: data;
  event: LiveMessageEvent;
};

export enum LiveMessageEvent {
  CHAT = 'chat',
  CONNECTION_LOSS = 'connection-loss',
  DIRECTORY_CREATED = 'directory:created',
  DIRECTORY_DELETED = 'directory:deleted',
  DIRECTORY_UPDATED = 'directory:updated',
  DISCONNECT = 'disconnect',
  EXTERNAL_RESOURCES = 'sandbox:external-resources',
  JOIN = 'join',
  LIVE_ADD_EDITOR = 'live:add-editor',
  LIVE_CHAT_ENABLED = 'live:chat_enabled',
  LIVE_MODE = 'live:mode',
  LIVE_REMOVE_EDITOR = 'live:remove-editor',
  MODULE_CREATED = 'module:created',
  MODULE_DELETED = 'module:deleted',
  MODULE_MASS_CREATED = 'module:mass-created',
  MODULE_SAVED = 'module:saved',
  MODULE_STATE = 'module_state',
  MODULE_UPDATED = 'module:updated',
  NOTIFICATION = 'notification',
  OPERATION = 'operation',
  OWNER_LEFT = 'owner_left',
  SAVE = 'save',
  USERS_CHANGED = 'users:changed',
  USER_CURRENT_MODULE = 'user:current-module',
  USER_ENTERED = 'user:entered',
  USER_LEFT = 'user:left',
  USER_SELECTION = 'user:selection',
  USER_VIEW_RANGE = 'user:view-range',
}

export type LiveUser = {
  avatarUrl: string;
  color: [number, number, number];
  currentModuleShortid: string | null;
  id: string;
  selection: UserSelection | null;
  userId: string | null;
  username: string;
  viewRange: UserViewRange | null;
};

export type MiniSandbox = {
  author: User;
  description: string;
  git: GitInfo;
  id: string;
  picks: SandboxPick[];
  screenshotUrl: string;
  template: string;
  title: string;
  viewCount: number;
};

export type Modal = {
  Body: Component<any> | undefined;
  open: boolean;
  title: string | undefined;
};

export type Module = {
  code: string;
  corrections: ModuleCorrection[];
  directoryShortid: string | null;
  errors: ModuleError[];
  id: string;
  insertedAt: string;
  isBinary: boolean;
  isNotSynced: boolean;
  path: string;
  savedCode: string | null;
  sha?: string;
  shortid: string;
  sourceId: string;
  title: string;
  type: 'file';
  updatedAt: string;
  uploadId?: string;
};

export type ModuleCorrection = {
  column: number;
  columnEnd?: number;
  line: number;
  lineEnd?: number;
  message: string;
  path: string | undefined;
  severity: 'notice' | 'warning';
  source: string | undefined;
};

export type ModuleError = {
  column: number;
  columnEnd?: number;
  line: number;
  lineEnd?: number;
  message: string;
  path: string;
  payload?: Object;
  severity: 'error' | 'warning';
  source: string | undefined;
  title: string;
  type: 'compile' | 'dependency-not-found' | 'no-dom-change';
};

export type ModuleTab = {
  dirty: boolean;
  moduleShortid: string | null;
  type: TabType.MODULE;
};

export type NetlifySite = {
  id: string;
  name: string;
  sandboxId: string;
  screenshot_url: string;
  site_id: string;
  state: string;
  url: string;
};

export type Notification = {
  buttons: NotificationButton[];
  endTime: number;
  id: number;
  title: string;
  type: 'error' | 'notice' | 'success' | 'warning';
};

export type NotificationButton = {
  action: Function;
  title: string;
};

export type PackageJSON = {
  alias?: { [key: string]: string };
  dependencies?: { [dependency: string]: string };
  description?: string;
  devDependencies?: { [dependency: string]: string };
  jest?: { setupFilesAfterEnv?: string[] };
  keywords?: string[];
  main?: string;
  module?: string;
  name: string;
  resolutions?: { [dependency: string]: string };
  scripts?: { [command: string]: string };
  version: string;
};

export type PaginatedSandboxes = {
  [page: number]: SmallSandbox[];
};

export enum PatronBadge {
  ONE = 'patron-1',
  TWO = 'patron-2',
  THREE = 'patron-3',
  FOURTH = 'patron-4',
}

export type PatronTier = 1 | 2 | 3 | 4;

export type PaymentDetails = {
  brand: string;
  expMonth: number;
  expYear: number;
  last4: string;
  name: string;
};

export type PermissionType =
  | 'comment'
  | 'none'
  | 'owner'
  | 'read'
  | 'write_code'
  | 'write_project';

export type PickedSandboxDetails = {
  description: string;
  id: string;
  title: string;
};

export type PickedSandboxes = {
  page: number;
  sandboxes: MiniSandbox[];
};

export type PopularSandboxes = {
  endDate: string;
  sandboxes: MiniSandbox[];
  startDate: string;
};

export type PrettierConfig = {
  bracketSpacing: boolean;
  fluid: boolean;
  jsxBracketSameLine: boolean;
  printWidth: number;
  semi: boolean;
  singleQuote: boolean;
  tabWidth: number;
  trailingComma: string;
  useTabs: boolean;
};

export type Profile = {
  avatarUrl: string;
  badges: Badge[];
  bio?: string;
  featuredSandboxes: Sandbox[];
  forkedCount: number;
  githubUsername: string | null;
  givenLikeCount: number;
  id: string;
  name: string;
  personalWorkspaceId: string;
  receivedLikeCount: number;
  sandboxCount: number;
  showcasedSandboxShortid: string;
  socialLinks?: string[];
  subscriptionSince: string;
  teams: Array<{
    avatarUrl?: string;
    id: string;
    name: string;
  }>;
  templateCount: number;
  username: string;
  viewCount: number;
};

export type RoomInfo = {
  chat: {
    messages: Array<{
      date: number;
      message: string;
      userId: string;
    }>;
    // We keep a separate map of user_id -> username for the case when
    // a user disconnects. We still need to keep track of the name.
    users: {
      [id: string]: string;
    };
  };
  chatEnabled: boolean;
  editorIds: string[];
  mode: string;
  ownerIds: string[];
  roomId: string;
  sandboxId: string;
  startTime: number;
  users: LiveUser[];
};

export type Sandbox = {
  alias: string | null;
  author: SandboxAuthor | null;
  authorization: PermissionType;
  baseGit: GitInfo | null;
  baseGitCommitSha: string | null;
  collection?: {
    path: string;
  };
  customTemplate: CustomTemplate | null;
  description: string;
  directories: Directory[];
  entry: string;
  environmentVariables: {
    [key: string]: string;
  } | null;
  externalResources: string[];
  featureFlags: {
    [key: string]: boolean;
  };
  forkCount: number;
  forkedFromSandbox: ForkedSandbox | null;
  /**
   * Which template this sandbox is based on
   */
  forkedTemplate: CustomTemplate | null;
  /**
   * Sandbox the forked template is from
   */
  forkedTemplateSandbox: ForkedSandbox | null;
  git: GitInfo | null;
  id: string;
  isFrozen: boolean;
  isSse?: boolean;
  likeCount: number;
  modules: Module[];
  npmDependencies: {
    [dep: string]: string;
  };
  originalGit: GitInfo | null;
  originalGitChanges: {
    added: string[];
    deleted: string[];
    modified: string[];
    rights: 'admin' | 'none' | 'read' | 'write';
  } | null;
  originalGitCommitSha: string | null;
  owned: boolean;
  prNumber: number | null;
  previewSecret: string | null;
  privacy: 0 | 1 | 2;
  roomId: string | null;
  screenshotUrl: string | null;
  source?: {
    template: string;
  };
  /**
   * This is the source it's assigned to, a source contains all dependencies, modules and directories
   */
  sourceId: string;
  tags: string[];
  team: {
    avatarUrl: string | undefined;
    id: string;
    name: string;
  } | null;
  template: TemplateType;
  title: string | null;
  userLiked: boolean;
  version: number;
  viewCount: number;
};

export type SandboxAuthor = {
  avatarUrl: string;
  badges: Badge[];
  id: string;
  name: string;
  personalWorkspaceId: string;
  subscriptionPlan: 'pro' | 'patron';
  subscriptionSince: string | null;
  username: string;
};

export type SandboxFs = {
  [path: string]: Directory | Module;
};

export enum SandboxGitState {
  CONFLICT_PR_BASE = 'conflict in pr base',
  CONFLICT_SOURCE = 'conflict in source',
  OUT_OF_SYNC_PR_BASE = 'out of sync with pr base',
  OUT_OF_SYNC_SOURCE = 'out of sync with source',
  RESOLVED_PR_BASE = 'resolved pr base',
  RESOLVED_SOURCE = 'resolved source',
  SYNCED = 'synced',
  SYNCING = 'syncing',
}

export type SandboxPick = {
  description: string;
  id: string;
  insertedAt: string;
  title: string;
};

export type SandboxUrlSourceData = {
  alias?: string | null;
  git?: GitInfo | null;
  id?: string | null;
};

export type Selection = {
  cursorPosition: number;
  selection: number[];
};

export enum ServerContainerStatus {
  CONTAINER_STARTED = 'container-started',
  ERROR = 'error',
  HIBERNATED = 'hibernated',
  INITIALIZING = 'initializing',
  SANDBOX_STARTED = 'sandbox-started',
  STOPPED = 'stopped',
}

export type ServerPort = {
  hostname: string;
  main: boolean;
  name?: string;
  port: number;
};

export enum ServerStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  INITIALIZING = 'initializing',
}

export type Settings = {
  autoCompleteEnabled: boolean | undefined;
  autoDownloadTypes: boolean | undefined;
  autoResize: boolean;
  clearConsoleEnabled: boolean | undefined;
  codeMirror: boolean;
  customVSCodeTheme: string | null;
  enableEslint: boolean;
  enableLigatures: boolean;
  fontFamily: string | undefined;
  fontSize: number | undefined;
  forceRefresh: boolean;
  instantPreviewEnabled: boolean | undefined;
  jsxBracketSameLine: boolean;
  keybindings: any[];
  lineHeight: number;
  lintEnabled: boolean | undefined;
  livePreviewEnabled: boolean | undefined;
  manualCustomVSCodeTheme: string | null;
  newPackagerExperiment: boolean | undefined;
  prettierConfig: PrettierConfig;
  prettifyOnSaveEnabled: boolean | undefined;
  printWidth: number;
  semi: boolean;
  singleQuote: boolean;
  tabWidth: number;
  trailingComma: string;
  useTabs: boolean;
  vimMode: boolean | undefined;
  zenMode: boolean | undefined;
};

export type SmallSandbox = {
  alias: string | null;
  customTemplate: CustomTemplate | null;
  forkCount: number;
  git: GitInfo | null;
  id: string;
  insertedAt: string;
  likeCount: number;
  privacy: 0 | 1 | 2;
  template: string;
  title: string | null;
  updatedAt: string;
  viewCount: number;
};

export type SSEContainerStatus =
  | 'container-started'
  | 'error'
  | 'hibernated'
  | 'initializing'
  | 'sandbox-started'
  | 'stopped';

export type SSEManagerStatus = 'connected' | 'disconnected' | 'initializing';

export enum StripeErrorCode {
  REQUIRES_ACTION = 'requires_action',
}

export type Tabs = Array<ModuleTab | DiffTab>;

export enum TabType {
  DIFF = 'DIFF',
  MODULE = 'MODULE',
}

export type Template = {
  backgroundColor: () => string | undefined;
  color: () => string;
  distDir: string;
  externalResourcesEnabled: boolean;
  isServer: boolean;
  isTypescript: boolean;
  main: boolean;
  mainFile: undefined | string[];
  name: TemplateType;
  netlify: boolean;
  niceName: string;
  popular: boolean;
  shortid: string;
  showCube: boolean;
  showOnHomePage: boolean;
  url: string;
};

export type TemplateType =
  | '@dojo/cli-create-app'
  | 'adonis'
  | 'angular-cli'
  | 'apollo'
  | 'babel-repl'
  | 'create-react-app'
  | 'create-react-app-typescript'
  | 'custom'
  | 'cxjs'
  | 'ember'
  | 'gatsby'
  | 'gridsome'
  | 'marko'
  | 'mdx-deck'
  | 'nest'
  | 'next'
  | 'node'
  | 'nuxt'
  | 'parcel'
  | 'preact-cli'
  | 'quasar-framework'
  | 'reason'
  | 'sapper'
  | 'static'
  | 'styleguidist'
  | 'svelte'
  | 'unibit'
  | 'vue-cli'
  | 'vuepress';

export type UploadedFilesInfo = {
  currentSize: number;
  maxSize: number;
  uploads: UploadFile[];
};

export type UploadFile = {
  id: string;
  name: string;
  objectSize: number;
  path: string;
  url: string;
};

export type User = {
  avatarUrl: string;
  badges: Badge[];
  forkedCount: number;
  givenLikeCount: number;
  id: string;
  likedSandboxes: PaginatedSandboxes;
  name: string;
  receivedLikeCount: number;
  sandboxCount: number;
  sandboxes: PaginatedSandboxes;
  showcasedSandboxShortid: string | null;
  subscriptionSince: string | null;
  topSandboxes: SmallSandbox[];
  twitter: string | null;
  username: string;
  viewCount: number;
};

export type UserQuery = {
  avatarUrl: string;
  id: string;
  username: string;
};

export type UserSandbox = {
  id: string;
  insertedAt: string;
  title: string;
  updatedAt: string;
};

export type UserSelection = {
  primary: Selection;
  secondary: Selection[];
  source: string;
};

export type UserViewRange = {
  endColumn: number;
  endLineNumber: number;
  startColumn: number;
  startLineNumber: number;
};

export type VercelAlias = {
  alias: string;
  created: string;
  uid: string;
};

export type VercelConfig = {
  alias?: string;
  name?: string;
};

export type VercelCreator = {
  uid: string;
};

export type VercelDeployment = {
  alias: VercelAlias[];
  created: number;
  createor: VercelCreator;
  instanceCount: number;
  name: string;
  scale: VercelScale;
  state: VercelDeploymentState;
  type: VercelDeploymentType;
  uid: string;
  url: string;
};

export enum VercelDeploymentState {
  BOOTED = 'BOOTED',
  BUILDING = 'BUILDING',
  BUILD_ERROR = 'BUILD_ERROR',
  DEPLOYING = 'DEPLOYING',
  DEPLOYMENT_ERROR = 'DEPLOYMENT_ERROR',
  ERROR = 'ERROR',
  FROZEN = 'FROZEN',
  INITIALIZING = 'INITIALIZING',
  READY = 'READY',
}

export enum VercelDeploymentType {
  'NPM',
  'DOCKER',
  'STATIC',
  'LAMBDAS',
}

export type VercelScale = {
  current: number;
  min: number;
  max: number;
};

export type VercelUser = {
  avatar: string;
  billing: {
    addons: string;
    cancelation: string;
    period: string;
    plan: string;
    trial: string;
  };
  bio: string;
  email: string;
  name: string;
  platformVersion: number;
  profiles: Array<{
    link: string;
    service: string;
  }>;
  uid: string;
  username: string;
  website: string;
};

export enum WindowOrientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}
