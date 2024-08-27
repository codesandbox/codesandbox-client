/* eslint-disable camelcase */
import type React from 'react';

import type { TemplateType } from '../templates';

export type SSEContainerStatus =
  | 'initializing'
  | 'container-started'
  | 'sandbox-started'
  | 'stopped'
  | 'hibernated'
  | 'error';

export type SSEManagerStatus = 'connected' | 'disconnected' | 'initializing';

export type PermissionType =
  | 'owner'
  | 'write_code'
  | 'write_project'
  | 'comment'
  | 'read'
  | 'none';

export type ModuleError = {
  message: string;
  line: number;
  column: number;
  title: string;
  path: string;
  severity: 'error' | 'warning';
  type: 'compile' | 'dependency-not-found' | 'no-dom-change';
  source: string | undefined;
  payload?: Object;
  columnEnd?: number;
  lineEnd?: number;
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
  code: string;
  savedCode: string | null;
  shortid: string;
  errors: ModuleError[];
  corrections: ModuleCorrection[];
  directoryShortid: string | null;
  isNotSynced: boolean;
  sourceId: string;
  isBinary: boolean;
  insertedAt: string;
  updatedAt: string;
  path: string;
  uploadId?: string;
  sha?: string;
  type: 'file';
};

export type Configuration = {
  title: string;
  moreInfoUrl: string;
  type: string;
  description: string;
};

export type Directory = {
  id: string;
  title: string;
  directoryShortid: string | null;
  shortid: string;
  path: string | null;
  sourceId: string;
  type: 'directory';
};

export type Template = {
  name: TemplateType;
  niceName: string;
  shortid: string;
  url: string;
  main: boolean;
  color: () => string;
  backgroundColor: () => string | undefined;
  popular: boolean;
  showOnHomePage: boolean;
  distDir: string;
  staticDeployment: boolean;
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

// This is the CurrentUser that is used everywhere, the CurrentUser coming from
// the GraphQL type is never used, except in GraphQL context.
export type CurrentUser = {
  id: string;
  email: string;
  name: string | null;
  username: string;
  avatarUrl: string;
  subscription: {
    since: string;
    amount: number;
    cancelAtPeriodEnd: boolean;
    plan: 'pro' | 'patron';
    duration: 'monthly' | 'yearly';
  } | null;
  experiments: {
    [key: string]: boolean;
  };
  metadata: {
    [key: string]: string;
  };
  curatorAt: string;
  badges: Badge[];
  betaAccess: boolean;
  provider: 'github' | 'google' | 'apple';
  integrations: {
    vercel: {
      token: string;
      email?: string;
    } | null;
    github: {
      email: string;
    } | null;
  };
  sendSurvey: boolean;
  deletionRequested: boolean;
  insertedAt: string;
  githubProfile:
    | {
        data: null;
        error: { code: string; message: string };
      }
    | {
        data: {
          avatarUrl: string;
          id: string;
          login: string;
          name?: string;
          scopes: string[];
        };
        error: null;
      };
};

// The zeit property comes from the API, but we want to rename it to vercel in the
// frontend. In the future we want to rename zeit coming from the API too.
export type CurrentUserFromAPI = Omit<CurrentUser, 'integrations'> & {
  // Omitting the vercel key from CurrentUser
  integrations: Omit<CurrentUser['integrations'], 'vercel'> & {
    // And replacing it with a zeit key with the same type
    zeit: CurrentUser['integrations']['vercel'];
  };
};

export type CustomTemplate = {
  color?: string;
  iconUrl?: string;
  id: string;
  published?: boolean;
  title: string;
  url: string | null;
  v2: boolean | null;
};

export type GitInfo = {
  repo: string;
  username: string;
  path: string;
  branch: string;
  commitSha: string | null;
};

export type SmallSandbox = {
  id: string;
  alias: string | null;
  title: string | null;
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

export type ForkedSandbox = {
  id: string;
  alias: string | null;
  title: string | null;
  customTemplate: CustomTemplate | null;
  insertedAt: string;
  updatedAt: string;
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
  twitter: string | null;
  showcasedSandboxShortid: string | null;
  sandboxCount: number;
  givenLikeCount: number;
  receivedLikeCount: number;
  viewCount: number;
  forkedCount: number;
  sandboxes: PaginatedSandboxes;
  likedSandboxes: PaginatedSandboxes;
  badges: Badge[];
  topSandboxes: SmallSandbox[];
  subscriptionSince: string | null;
};

export type LiveUser = {
  username: string;
  selection: UserSelection | null;
  viewRange: UserViewRange | null;
  id: string;
  currentModuleShortid: string | null;
  color: [number, number, number];
  avatarUrl: string;
  userId: string | null;
};

export type RoomInfo = {
  startTime: number;
  ownerIds: string[];
  roomId: string;
  mode: string;
  chatEnabled: boolean;
  sandboxId: string;
  editorIds: string[];
  users: LiveUser[];
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

export type GitCommit = {
  git: GitInfo;
  merge: boolean;
  newBranch: string;
  sha: string;
  url: string;
};

export type GitPr = {
  number: number;
  repo: string;
  username: string;
  branch: string;
  merged: boolean;
  state: string;
  mergeable: boolean;
  mergeableState: string;
  commitSha: string;
  baseCommitSha: string;
  rebaseable: boolean;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
};

export type GitFileCompare = {
  additions: number;
  changes: number;
  deletions: number;
  filename: string;
  status: 'added' | 'modified' | 'removed';
  isBinary: boolean;
  content?: string;
};

export enum SandboxGitState {
  SYNCED = 'synced',
  CONFLICT_SOURCE = 'conflict in source',
  CONFLICT_PR_BASE = 'conflict in pr base',
  OUT_OF_SYNC_SOURCE = 'out of sync with source',
  OUT_OF_SYNC_PR_BASE = 'out of sync with pr base',
  SYNCING = 'syncing',
  RESOLVED_SOURCE = 'resolved source',
  RESOLVED_PR_BASE = 'resolved pr base',
}

export type UserQuery = {
  id: string;
  avatarUrl: string;
  username: string;
};

export type SandboxAuthor = {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  badges: Badge[];
  subscriptionSince: string | null;
  subscriptionPlan: 'pro' | 'patron';
};

export type NpmRegistry = {
  enabledScopes: string[];
  limitToScopes: boolean;
  registryUrl: string;
  proxyEnabled?: boolean;
  registryAuthToken?: string;
  registryAuthType?: string;
};

export enum CommentsFilterOption {
  ALL = 'All',
  OPEN = 'Open',
  RESOLVED = 'Resolved',
}

type PackageVersionInfo = {
  name: string;
  description: string;
  version: string;
  author: string;
  bugs: unknown | null;
  dependencies: unknown | null;
  devDependencies: unknown | null;
  peerDependencies: unknown | null;
  main: string;
  scripts: {
    [script: string]: string;
  };
  dist: {
    integrity: string;
    shasum: string;
    tarball: string;
  };
};

export type NpmManifest = {
  name: string;
  description: string;
  'dist-tags'?: {
    [tag: string]: string;
  };
  versions: {
    [version: string]: PackageVersionInfo;
  };
};

// NOTE: These types are inferred from usage and might not reflect the actual
// types one on one. Used for the api.forkSandbox method.
export type ForkSandboxBody = {
  v2?: boolean;
  teamId?: string | null;
  privacy?: 0 | 1 | 2;
  collectionId?: string;
  alias?: string;
};

export type Sandbox = {
  id: string;
  alias: string | null;
  title: string | null;
  description: string;
  v2: boolean;
  viewCount: number;
  likeCount: number;
  forkCount: number;
  userLiked: boolean;
  modules: Module[];
  directories: Directory[];
  npmRegistries: NpmRegistry[];
  featureFlags: {
    [key: string]: boolean;
  };
  collection?: {
    path: string;
  };
  owned: boolean;
  authorization: PermissionType;
  npmDependencies: {
    [dep: string]: string;
  };
  customTemplate: CustomTemplate | null;
  /**
   * Which template this sandbox is based on
   */
  forkedTemplate: CustomTemplate | null;
  /**
   * Sandbox the forked template is from
   */
  forkedTemplateSandbox: ForkedSandbox | null;
  externalResources: string[];
  team: {
    id: string;
    name: string;
    avatarUrl: string | undefined;
  } | null;
  roomId: string | null;
  privacy: 0 | 1 | 2;
  draft: boolean;
  restricted: boolean;
  author: SandboxAuthor | null;
  forkedFromSandbox: ForkedSandbox | null;
  git: GitInfo | null;
  tags: string[];
  isFrozen: boolean;
  environmentVariables: {
    [key: string]: string;
  } | null;
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
  originalGit: GitInfo | null;
  baseGit: GitInfo | null;
  prNumber: number | null;
  originalGitCommitSha: string | null;
  baseGitCommitSha: string | null;
  originalGitChanges: {
    added: string[];
    modified: string[];
    deleted: string[];
    rights: 'none' | 'read' | 'write' | 'admin';
  } | null;
  version: number;
  screenshotUrl: string | null;
  previewSecret: string | null;
  permissions: {
    preventSandboxLeaving: boolean;
    preventSandboxExport: boolean;
  };
  // New restrictions object. Remove the optional from the properties
  // when resrcitions are deployed to production.
  restrictions?: {
    liveSessionsRestricted?: boolean;
  };
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
  customVSCodeTheme: string | null;
  manualCustomVSCodeTheme: string | null;
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
  version: string;
  description?: string;
  alias?: { [key: string]: string };
  keywords?: string[];
  main?: string;
  module?: string;
  scripts?: { [command: string]: string };
  dependencies?: { [dependency: string]: string };
  devDependencies?: { [dependency: string]: string };
  jest?: { setupFilesAfterEnv?: string[] };
  resolutions?: { [dependency: string]: string };
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
  source: string;
};

export type EditorSelection = {
  userId: string;
  name: string | null;
  selection: UserSelection | null;
  color: number[];
};

export type UserViewRange = {
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
};

export enum WindowOrientation {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export type Profile = {
  viewCount: number;
  githubUsername: string | null;
  username: string;
  subscriptionSince: string;
  showcasedSandboxShortid: string;
  sandboxCount: number;
  templateCount: number;
  receivedLikeCount: number;
  name: string | null;
  id: string;
  givenLikeCount: number;
  forkedCount: number;
  badges: Badge[];
  avatarUrl: string;
  bio?: string | null;
  socialLinks?: string[] | null;
  featuredSandboxes: Sandbox[];
  personalWorkspaceId: string;
  teams: Array<{
    id: string;
    name: string;
    avatarUrl?: string;
  }>;
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

export type ServerPort = {
  main: boolean;
  port: number;
  hostname: string;
  name?: string;
};

/**
 * The VercelUser type is a selection of what we use and what is or can be returned from
 * the user endpoint. The whole list of types can be found in the Vercel docs: https://vercel.com/docs/rest-api/interfaces#authuser
 */
export type VercelUser = {
  email: string;
};

/**
 * The VercelCreator type is a selection of what we use and what is or can be returned for
 * the creator property on the deployments endpoint.
 */
export type VercelCreator = {
  uid: string;
};

/**
 * Can't find where these types are documented on the Vercel side, but we're using these states
 * to show active deployment status to the user.
 */
export enum VercelDeploymentState {
  DEPLOYING = 'DEPLOYING',
  INITIALIZING = 'INITIALIZING',
  DEPLOYMENT_ERROR = 'DEPLOYMENT_ERROR',
  BOOTED = 'BOOTED',
  BUILDING = 'BUILDING',
  READY = 'READY',
  BUILD_ERROR = 'BUILD_ERROR',
  FROZEN = 'FROZEN',
  ERROR = 'ERROR',
}

/**
 * The VercelDeployment type is a selection of what we use and what is or can be returned from
 * the deployments endpoint.
 */
export type VercelDeployment = {
  uid: string;
  name: string;
  url: string;
  created: number;
  state: VercelDeploymentState;
};

/**
 * The VercelConfig type is a selection of (now legacy) properties we use from the vercel configuration
 * file. More info can be found in the Vercel docs: https://vercel.com/docs/concepts/projects/project-configuration#legacy
 */
export type VercelConfig = {
  name?: string;
  env?: string;
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
  moduleShortid: string | null;
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

export type GitPathChanges = {
  added: string[];
  deleted: string[];
  modified: string[];
};

export type GitChanges = {
  added: Array<{ path: string; content: string; encoding: 'utf-8' | 'base64' }>;
  deleted: string[];
  modified: Array<{
    path: string;
    content: string;
    encoding: 'utf-8' | 'base64';
  }>;
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
  id?: string | null;
  alias?: string | null;
  git?: GitInfo | null;
  isV2?: boolean;
  query?: Record<string, string> | URLSearchParams;
};

export type DevToolsTabPosition = {
  devToolIndex: number;
  tabPosition: number;
};

export type LiveMessage<data = unknown> = {
  event: LiveMessageEvent;
  data: data;
  _isOwnMessage: boolean;
};

export enum LiveMessageEvent {
  SAVE = 'save',
  JOIN = 'join',
  MODULE_STATE = 'module_state',
  USER_ENTERED = 'user:entered',
  USER_LEFT = 'user:left',
  USERS_CHANGED = 'users:changed',
  MODULE_SAVED = 'module:saved',
  MODULE_CREATED = 'module:created',
  MODULE_MASS_CREATED = 'module:mass-created',
  MODULE_UPDATED = 'module:updated',
  MODULE_DELETED = 'module:deleted',
  EXTERNAL_RESOURCES = 'sandbox:external-resources',
  DIRECTORY_CREATED = 'directory:created',
  DIRECTORY_UPDATED = 'directory:updated',
  DIRECTORY_DELETED = 'directory:deleted',
  USER_SELECTION = 'user:selection',
  USER_CURRENT_MODULE = 'user:current-module',
  USER_VIEW_RANGE = 'user:view-range',
  LIVE_MODE = 'live:mode',
  LIVE_CHAT_ENABLED = 'live:chat_enabled',
  LIVE_ADD_EDITOR = 'live:add-editor',
  LIVE_REMOVE_EDITOR = 'live:remove-editor',
  OPERATION = 'operation',
  CONNECTION_LOSS = 'connection-loss',
  DISCONNECT = 'disconnect',
  OWNER_LEFT = 'owner_left',
  CHAT = 'chat',
  NOTIFICATION = 'notification',
}

export enum StripeErrorCode {
  REQUIRES_ACTION = 'requires_action',
}

export enum PatronBadge {
  ONE = 'patron-1',
  TWO = 'patron-2',
  THREE = 'patron-3',
  FOURTH = 'patron-4',
}

export type LiveDisconnectReason = 'close' | 'inactivity';

export type PatronTier = 1 | 2 | 3 | 4;

export type SandboxFs = {
  [path: string]: Module | Directory;
};

export interface IModuleStateModule {
  synced?: boolean;
  revision?: number;
  code?: string;
  saved_code?: string | null;
}

export interface IModuleState {
  [moduleId: string]: IModuleStateModule;
}

export type SettingsSync = {
  id: string;
  insertedAt: string;
  name: string;
  settings: string;
  updatedAt: string;
  userId: string;
};
