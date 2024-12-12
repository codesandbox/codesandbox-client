export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  UUID4: any;
  DateTime: any;
  NaiveDateTime: any;
  Base64: any;
};

export type RootQueryType = {
  __typename?: 'RootQueryType';
  album: Maybe<Album>;
  albums: Array<Album>;
  /**
   * Get a single branch by its short ID.
   *
   * Returns a "not found" error if the branch does not exist or is inaccessible by the current user.
   * Anonymous users may use this endpoint for branches that exist on read-only projects (see
   * `mutation importReadOnlyProject`).
   *
   * Branches represent real or potential git branches on a particular team's project. Branch short
   * IDs are short alphanumeric strings that point to a particular repository + team + branch name.
   * Remember that a user may have access to the same branch on multiple teams' projects.
   *
   * To look up a branch by repository + team + branch name, see `query branchByName`.
   *
   * Example (for branch with short ID `abc123`):
   *
   * ```gql
   * query branchById(id: "abc123") {
   *   name
   * }
   * ```
   */
  branchById: Branch;
  /**
   * Get a single branch by its repository, team, and name.
   *
   * Returns a "not found" error if the branch does not exist or is inaccessible by the current user.
   * Anonymous users may use this endpoint for branches that exist on read-only projects (see
   * `mutation importReadOnlyProject`).
   *
   * Branches represent real or potential git branches on a particular team's project. Remember that
   * a user may have access to the same branch on multiple teams' projects.
   *
   * To look up a branch by its short ID, see `query branchById`.
   *
   * Example (for `codesandbox/test-repo` branch `test-branch`):
   *
   * ```gql
   * query branchByName(
   *   provider: GITHUB,
   *   owner: "codesandbox",
   *   name: "test-repo",
   *   branch: "test-branch",
   *   team: "987b6fcd-2a3b-41fe-b1e6-ac33565824b9"
   * )
   * ```
   */
  branchByName: Branch;
  curatedAlbums: Array<Album>;
  /**
   * Check for an active live session
   *
   * Accessible to members of the content's workspace and non-editor guests that have already
   * joined the session. Prospective guests should use the mutation `joinLiveSession` with the
   * session's ID instead.
   */
  getLiveSession: Maybe<LiveSession>;
  /** Get git repo and related V1 sandboxes */
  git: Maybe<Git>;
  /**
   * Get repositories owned by a GitHub organization.
   *
   * If either `page` or `perPage` are specified, then a single page of results will be returned.
   * If neither argument is given, then all results will be returned. Note that this still requires
   * paginated requests to the GitHub API, but the server will concatenate the results.
   */
  githubOrganizationRepos: Maybe<Array<GithubRepo>>;
  /** Get a repository as it appears on GitHub */
  githubRepo: Maybe<GithubRepo>;
  /** The various limits in place for free and paying users and teams */
  limits: Limits;
  /** Get current user */
  me: Maybe<CurrentUser>;
  /**
   * Get a single project by its repository and team.
   *
   * Projects are identified by repository-team pairs. For public repositories, there may also be a
   * single project that does not have an associated team. For a list of all projects for a given
   * repository, see `query projectsByRepository`.
   *
   * Example (for `https://github.com/codesandbox/test-repo.git`):
   *
   * ```gql
   * query project(
   *   git_provider: GITHUB,
   *   owner: "codesandbox",
   *   repo: "test-repo",
   *   team: "57ca3ef5-475b-47bf-9530-a686c527e174"
   * ) { id }
   * ```
   */
  project: Maybe<Project>;
  /**
   * Get all projects for the given repository accessible by the current user. Returns an empty list
   * if no such projects are available, or no version of this project has been imported yet.
   *
   * Projects are identified by repository-team pairs. For public repositories, there may also be a
   * single project that does not have an associated team. This query returns all of the projects
   * accessible by the current user (as many as `[# of user teams] + 1`). For information about
   * a project associated with a specific team, see `query project`.
   *
   * Example (for `https://github.com/codesandbox/test-repo.git`):
   *
   * ```gql
   * query projects(
   *   provider: GITHUB,
   *   owner: "codesandbox",
   *   name: "test-repo"
   * ) { id }
   * ```
   */
  projects: Array<Project>;
  /**
   * Get a list of teams that have interacted with a repository recently
   *
   * This endpoint is intended to be used when a user has access to a repository, but does not
   * belong to any teams where the repository has been imported. It returns a brief list of teams
   * (10) that have interacted with that repository recently, with the intention that the user may
   * wish to request an invitation to one of those teams.
   *
   * **Note**: The teams returned by this endpoint are likely to be relevant for **private**
   * repositories only, and unlikely to be relevant for public repositories.
   *
   * ```gql
   * query recentTeamsByRepository(
   *   provider: GITHUB,
   *   owner: "codesandbox",
   *   name: "test-repo"
   * ) { id }
   * ```
   */
  recentTeamsByRepository: Array<TeamPreview>;
  /**
   * Get a sandbox by its (short) ID
   *
   * Requires the current user have read authorization (or that the sandbox is public). Otherwise
   * returns an error (`"unauthorized"`).
   */
  sandbox: Maybe<Sandbox>;
  /**
   * Returns a sandbox's team ID if the current user is eligible to join that workspace
   *
   * This query is designed for use in 404 experience where the current user does not have access
   * to the resource but *might* have access if they accept an open invitation to its workspace.
   * Returns null if no such open invitation exists, or an error if no user is authenticated.
   *
   * For a list of all workspaces the user is eligible to join, see `query eligibleWorkspaces`.
   * The ID returned by this query can be used in `mutation joinEligibleWorkspace`.
   */
  sandboxEligibleWorkspace: Maybe<TeamPreview>;
  /** A team from an invite token */
  teamByToken: Maybe<TeamPreview>;
};

export type RootQueryTypeAlbumArgs = {
  albumId: Scalars['ID'];
};

export type RootQueryTypeAlbumsArgs = {
  username: Scalars['String'];
};

export type RootQueryTypeBranchByIdArgs = {
  id: Scalars['String'];
};

export type RootQueryTypeBranchByNameArgs = {
  branch: Scalars['String'];
  name: Scalars['String'];
  owner: Scalars['String'];
  provider: GitProvider;
  team: InputMaybe<Scalars['ID']>;
};

export type RootQueryTypeGetLiveSessionArgs = {
  vmId: Scalars['ID'];
};

export type RootQueryTypeGitArgs = {
  branch: Scalars['String'];
  path: Scalars['String'];
  repo: Scalars['String'];
  username: Scalars['String'];
};

export type RootQueryTypeGithubOrganizationReposArgs = {
  organization: Scalars['String'];
  page: InputMaybe<Scalars['Int']>;
  perPage: InputMaybe<Scalars['Int']>;
  sort: InputMaybe<UserRepoSort>;
};

export type RootQueryTypeGithubRepoArgs = {
  owner: Scalars['String'];
  repo: Scalars['String'];
};

export type RootQueryTypeProjectArgs = {
  gitProvider: InputMaybe<GitProvider>;
  owner: Scalars['String'];
  repo: Scalars['String'];
  team: InputMaybe<Scalars['ID']>;
};

export type RootQueryTypeProjectsArgs = {
  name: Scalars['String'];
  owner: Scalars['String'];
  provider: GitProvider;
};

export type RootQueryTypeRecentTeamsByRepositoryArgs = {
  name: Scalars['String'];
  owner: Scalars['String'];
  provider: GitProvider;
};

export type RootQueryTypeSandboxArgs = {
  sandboxId: Scalars['ID'];
};

export type RootQueryTypeSandboxEligibleWorkspaceArgs = {
  sandboxId: Scalars['ID'];
};

export type RootQueryTypeTeamByTokenArgs = {
  inviteToken: Scalars['String'];
};

export type Album = {
  __typename?: 'Album';
  id: Scalars['ID'];
  sandboxes: Array<Sandbox>;
  title: Maybe<Scalars['String']>;
};

/** A Sandbox */
export type Sandbox = {
  __typename?: 'Sandbox';
  alias: Maybe<Scalars['String']>;
  /** @deprecated No longer supported */
  alwaysOn: Maybe<Scalars['Boolean']>;
  author: Maybe<User>;
  authorId: Maybe<Scalars['UUID4']>;
  authorization: Authorization;
  /** If the sandbox has created a PR, this will refer to the git that you will merge into */
  baseGit: Maybe<Git>;
  collaborators: Array<Collaborator>;
  collection: Maybe<Collection>;
  comment: Maybe<Comment>;
  comments: Array<Comment>;
  /** If the sandbox is a template this will be set */
  customTemplate: Maybe<Template>;
  description: Maybe<Scalars['String']>;
  draft: Scalars['Boolean'];
  forkCount: Scalars['Int'];
  forkedTemplate: Maybe<Template>;
  /** If the sandbox has a v1 git repo tied to it this will be set */
  git: Maybe<Git>;
  id: Scalars['ID'];
  insertedAt: Scalars['String'];
  invitations: Array<Invitation>;
  isFrozen: Scalars['Boolean'];
  /** @deprecated No longer supported */
  isSse: Maybe<Scalars['Boolean']>;
  isV2: Scalars['Boolean'];
  /** Depending on the context, this may be the last access of the current user or the aggregate last access for all users */
  lastAccessedAt: Scalars['DateTime'];
  likeCount: Scalars['Int'];
  /** If the sandbox has been made into a git sandbox, then this will be set */
  originalGit: Maybe<Git>;
  permissions: Maybe<SandboxProtectionSettings>;
  privacy: Scalars['Int'];
  /** If a PR has been opened on the sandbox, this will be set to the PR number */
  prNumber: Maybe<Scalars['Int']>;
  removedAt: Maybe<Scalars['String']>;
  restricted: Scalars['Boolean'];
  screenshotOutdated: Scalars['Boolean'];
  screenshotUrl: Maybe<Scalars['String']>;
  settings: SandboxSettings;
  source: Source;
  team: Maybe<TeamPreview>;
  teamId: Maybe<Scalars['UUID4']>;
  title: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  viewCount: Scalars['Int'];
};

/** A Sandbox */
export type SandboxCommentArgs = {
  commentId: Scalars['UUID4'];
};

/** A CodeSandbox User */
export type User = {
  __typename?: 'User';
  avatarUrl: Scalars['String'];
  bio: Maybe<Scalars['String']>;
  id: Scalars['UUID4'];
  name: Maybe<Scalars['String']>;
  personalWorkspaceId: Scalars['UUID4'];
  socialLinks: Maybe<Array<Scalars['String']>>;
  username: Scalars['String'];
};

export enum Authorization {
  Comment = 'COMMENT',
  None = 'NONE',
  Owner = 'OWNER',
  Read = 'READ',
  WriteCode = 'WRITE_CODE',
  WriteProject = 'WRITE_PROJECT',
}

/** A v1 git object */
export type Git = {
  __typename?: 'Git';
  baseGitSandboxes: Array<Sandbox>;
  branch: Maybe<Scalars['String']>;
  commitSha: Maybe<Scalars['String']>;
  id: Maybe<Scalars['UUID4']>;
  originalGitSandboxes: Array<Sandbox>;
  path: Maybe<Scalars['String']>;
  repo: Maybe<Scalars['String']>;
  username: Maybe<Scalars['String']>;
};

/** A v1 git object */
export type GitBaseGitSandboxesArgs = {
  teamId: InputMaybe<Scalars['UUID4']>;
};

/** A v1 git object */
export type GitOriginalGitSandboxesArgs = {
  teamId: InputMaybe<Scalars['UUID4']>;
};

/** A collaborator on a sandbox */
export type Collaborator = {
  __typename?: 'Collaborator';
  authorization: Authorization;
  id: Scalars['UUID4'];
  lastSeenAt: Maybe<Scalars['DateTime']>;
  sandbox: Sandbox;
  user: User;
  warning: Maybe<Scalars['String']>;
};

export type Collection = {
  __typename?: 'Collection';
  id: Maybe<Scalars['UUID4']>;
  path: Scalars['String'];
  sandboxCount: Scalars['Int'];
  sandboxes: Array<Sandbox>;
  team: Maybe<Team>;
  teamId: Maybe<Scalars['UUID4']>;
  user: Maybe<User>;
};

export type Team = {
  __typename?: 'Team';
  avatarUrl: Maybe<Scalars['String']>;
  bookmarkedTemplates: Array<Template>;
  collections: Array<Collection>;
  creatorId: Maybe<Scalars['UUID4']>;
  description: Maybe<Scalars['String']>;
  /** Draft sandboxes - always returns the current user's drafts */
  drafts: Array<Sandbox>;
  /** Workspace-based feature flags and whether or not they are active for the current workspace */
  featureFlags: TeamFeatureFlags;
  /**
   * Whether the team has reached their limit for on-demand credit purchase
   *
   * This indicator is generally updated at most every 30 minutes, and therefore may be delayed
   * from the moment a team exceeds their usage. Clients are encouraged to warn users about usage
   * approaching their limit using information from the usage, limits, and subscription fields.
   */
  frozen: Scalars['Boolean'];
  id: Scalars['UUID4'];
  insertedAt: Scalars['String'];
  invitees: Array<User>;
  inviteToken: Scalars['String'];
  /** @deprecated There's no such thing as a pilot team anymore */
  joinedPilotAt: Maybe<Scalars['DateTime']>;
  /** @deprecated No more legacy teams */
  legacy: Scalars['Boolean'];
  limits: TeamLimits;
  members: Array<TeamMember>;
  /** Additional user-provided metadata about the workspace */
  metadata: TeamMetadata;
  name: Scalars['String'];
  privateRegistry: Maybe<PrivateRegistry>;
  /**
   * Projects assigned to the team
   *
   * By default, repository and permission data older than a certain TTL will be synced from the
   * GitHub API. Using `syncData: false`, clients can request a faster but possibly incorrect
   * response. The incorrect response will be "safe", defaulting to "no" or "read-only" access
   * when a definitive answer isn't available.
   *
   * Projects are returned in the order of the most recent recorded commit on the related
   * repository. Manual ordering by `lastAccessedAt` may be desired.
   */
  projects: Array<Project>;
  sandboxes: Array<Sandbox>;
  settings: Maybe<WorkspaceSandboxSettings>;
  shortid: Scalars['String'];
  subscription: Maybe<ProSubscription>;
  subscriptionSchedule: Maybe<SubscriptionSchedule>;
  templates: Array<Template>;
  /** @deprecated All teams are teams now */
  type: TeamType;
  usage: TeamUsage;
  userAuthorizations: Array<UserAuthorization>;
  users: Array<User>;
};

export type TeamDraftsArgs = {
  authorId: InputMaybe<Scalars['UUID4']>;
  limit: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<OrderBy>;
};

export type TeamProjectsArgs = {
  syncData?: InputMaybe<Scalars['Boolean']>;
};

export type TeamSandboxesArgs = {
  alwaysOn: InputMaybe<Scalars['Boolean']>;
  authorId: InputMaybe<Scalars['UUID4']>;
  hasOriginalGit: InputMaybe<Scalars['Boolean']>;
  limit: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<OrderBy>;
  showDeleted: InputMaybe<Scalars['Boolean']>;
};

export type TeamSubscriptionArgs = {
  includeCancelled?: InputMaybe<Scalars['Boolean']>;
};

/** A Template */
export type Template = {
  __typename?: 'Template';
  bookmarked: Maybe<Array<Maybe<Bookmarked>>>;
  color: Maybe<Scalars['String']>;
  /** @deprecated This field is deprecated and will always be null. Query sandbox > description instead */
  description: Maybe<Scalars['String']>;
  iconUrl: Maybe<Scalars['String']>;
  id: Maybe<Scalars['UUID4']>;
  insertedAt: Maybe<Scalars['String']>;
  official: Scalars['Boolean'];
  published: Maybe<Scalars['Boolean']>;
  sandbox: Maybe<Sandbox>;
  /** @deprecated This field is deprecated and will always be null. Query sandbox > title instead */
  title: Maybe<Scalars['String']>;
  updatedAt: Maybe<Scalars['String']>;
};

export type Bookmarked = {
  __typename?: 'Bookmarked';
  entity: Maybe<BookmarkEntity>;
  isBookmarked: Maybe<Scalars['Boolean']>;
};

/** A team or the current user */
export type BookmarkEntity = Team | User;

export type OrderBy = {
  direction: Direction;
  field: Scalars['String'];
};

export enum Direction {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type TeamFeatureFlags = {
  __typename?: 'TeamFeatureFlags';
  friendOfCsb: Scalars['Boolean'];
  ubbBeta: Scalars['Boolean'];
};

export type TeamLimits = {
  __typename?: 'TeamLimits';
  /** VM credits included with the team's subscription every month, including add-ons */
  includedCredits: Scalars['Int'];
  /**
   * Number of drafts each team member is allowed to have.
   * Currently this is 10 for free users, and 'unlimited' (aka 10_000) for PRO users.
   */
  includedDrafts: Scalars['Int'];
  /** Number of workspace members included with the team's subscription, including add-ons */
  includedMembers: Scalars['Int'];
  /** Number of included private browser sandboxes with the team's subscription */
  includedPrivateSandboxes: Scalars['Int'];
  /** Number of included public browser sandboxes with the team's subscription */
  includedPublicSandboxes: Scalars['Int'];
  /** DEPRECATED: Number of sandboxes included with the team's subscription */
  includedSandboxes: Scalars['Int'];
  /** Storage (in GB) included with the team's subscription, including add-ons */
  includedStorage: Scalars['Int'];
  /** The maximum VM tier this team can use */
  includedVmTier: Scalars['Int'];
  /** @deprecated Will be removed in a future release */
  maxEditors: Maybe<Scalars['Int']>;
  /** @deprecated Will be removed in a future release */
  maxPrivateProjects: Maybe<Scalars['Int']>;
  /** @deprecated Will be removed in a future release */
  maxPrivateSandboxes: Maybe<Scalars['Int']>;
  /** @deprecated Will be removed in a future release */
  maxPublicProjects: Maybe<Scalars['Int']>;
  /** @deprecated Will be removed in a future release */
  maxPublicSandboxes: Maybe<Scalars['Int']>;
  /**
   * Maximum number of credits that can be purchased on-demand in a month
   *
   * This value is set automatically based on the `onDemandSpendingLimit` set by the user using
   * `mutation setTeamLimits`.
   */
  onDemandCreditLimit: Maybe<Scalars['Int']>;
  /**
   * Maximum spending, in whole dollars, allowed for on-demand credits in a month
   *
   * This value is set by the user using `mutation setTeamLimits`.
   */
  onDemandSpendingLimit: Maybe<Scalars['Int']>;
};

export type TeamMember = {
  __typename?: 'TeamMember';
  avatarUrl: Scalars['String'];
  bio: Maybe<Scalars['String']>;
  githubUsername: Maybe<Scalars['String']>;
  id: Scalars['UUID4'];
  name: Maybe<Scalars['String']>;
  username: Scalars['String'];
};

/** Additional user-provided metadata about a workspace */
export type TeamMetadata = {
  __typename?: 'TeamMetadata';
  /** Use-cases for the workspace provided during creation */
  useCases: Array<Scalars['String']>;
};

/** A private package registry */
export type PrivateRegistry = {
  __typename?: 'PrivateRegistry';
  authType: Maybe<AuthType>;
  enabledScopes: Array<Scalars['String']>;
  id: Scalars['UUID4'];
  limitToScopes: Maybe<Scalars['Boolean']>;
  proxyEnabled: Maybe<Scalars['Boolean']>;
  registryAuthKey: Maybe<Scalars['String']>;
  registryType: RegistryType;
  registryUrl: Maybe<Scalars['String']>;
  sandpackTrustedDomains: Array<Scalars['String']>;
  teamId: Scalars['UUID4'];
};

export enum AuthType {
  Basic = 'BASIC',
  Bearer = 'BEARER',
}

export enum RegistryType {
  Custom = 'CUSTOM',
  Github = 'GITHUB',
  Npm = 'NPM',
}

/**
 * Repository imported to a CodeSandbox team.
 *
 * Projects represent a git repository that has been imported to CodeSandbox for collaboration in a
 * specific team. The assigned team is given by the `team` field. If no `team` is assigned, then the
 * project is a read-only placeholder for anonymous users.
 *
 * A project `id` is unique to the repository-team pair, and should be used any time it is known.
 * If the project is not known, then the repository `owner`/`name` pair, along with the team `id`,
 * is roughly equivalent.
 *
 * To import a project, see the `importProject` mutation.
 */
export type Project = {
  __typename?: 'Project';
  /** Whether the CodeSandbox GitHub App is installed */
  appInstalled: Scalars['Boolean'];
  /**
   * Combined permission of the current user on this project
   *
   * This includes permissions granted by the git provider, team membership, and any usage limits
   * faced by the team. This field may be requested even for anonymous users, but the value will
   * always be READ (or the project itself will fail to resolve).
   */
  authorization: ProjectAuthorization;
  /**
   * Get a CodeSandbox branch related to a particular Project by name
   *
   * Projects related to the same Repository may have different branches in CodeSandbox. Some
   * branches may have been created in CodeSandbox and not yet pushed to the Git provider, and some
   * may have been imported from the Git provider for some workspaces but not others.
   *
   * This field will look for a branch, by name, specifically related to the parent Project. If the
   * branch does not exist for the parent Project, it will return `null`.
   *
   * Contribution branches are not supported by this field.
   */
  branchByName: Maybe<Branch>;
  /** Number of branches imported to CodeSandbox for this project. It is asynchronously updated when a create or delete happens. */
  branchCount: Scalars['Int'];
  /** Repository branches that have been imported to (or created in) CodeSandbox */
  branches: Array<Branch>;
  /** Active users connected to a branch of this project */
  connections: Array<Connection>;
  /** Shortcut to retrieve the repository's default branch as it appears on CodeSandbox */
  defaultBranch: Branch;
  /** CodeSandbox ID for the project (specific to this repository-team pair) */
  id: Scalars['ID'];
  /** Timestamp of the last time the current user accessed one of this project's branches on CodeSandbox */
  lastAccessedAt: Maybe<Scalars['String']>;
  /** Information about the last commit made by CodeSandbox on any branch */
  lastCommit: Maybe<LastCommit>;
  /** Open pull requests from head branches in this repository */
  pullRequests: Array<PullRequest>;
  /** Git repository for the project, as it appears on the original git provider */
  repository: Repository;
  /** Compute resources for the project, based on settings and team subscription */
  resources: Resources;
  /** Settings for the project */
  settings: ProjectSettings;
  /**
   * Team to which this project is assigned
   *
   * If `null`, the project is read-only. Loading only the `id` of the team is optimized to avoid
   * unnecessary queries. Loading any field other than the `id` will incur the additional cost of
   * looking up the team.
   */
  team: Maybe<Team>;
};

/**
 * Repository imported to a CodeSandbox team.
 *
 * Projects represent a git repository that has been imported to CodeSandbox for collaboration in a
 * specific team. The assigned team is given by the `team` field. If no `team` is assigned, then the
 * project is a read-only placeholder for anonymous users.
 *
 * A project `id` is unique to the repository-team pair, and should be used any time it is known.
 * If the project is not known, then the repository `owner`/`name` pair, along with the team `id`,
 * is roughly equivalent.
 *
 * To import a project, see the `importProject` mutation.
 */
export type ProjectBranchByNameArgs = {
  name: Scalars['String'];
};

/** Combined permission for a project including git provider, team membership, and usage limits */
export enum ProjectAuthorization {
  Admin = 'ADMIN',
  None = 'NONE',
  Read = 'READ',
  Write = 'WRITE',
}

/**
 * Branch of a Repository imported to CodeSandbox.
 *
 * Branches often represent git branches available from the git provider, but they can also
 * represent the contributions of read-only users that have not yet forked and committed their work.
 * Branches on CodeSandbox do not persist to the git provider until a commit is made, and branches
 * on the git provider don't appear in CodeSandbox unless imported by an automated process (like the
 * GitHub App webhooks) or manually by a user.
 */
export type Branch = {
  __typename?: 'Branch';
  /**
   * Whether or not AI features should be enabled for this branch.
   *     This is the final calculated value based on the team subscription status, team settings, and project settings.
   */
  aiConsent: Scalars['Boolean'];
  /** Active users connected to this branch */
  connections: Array<Connection>;
  /** Whether this branch is a contribution branch made by a read-only user */
  contribution: Scalars['Boolean'];
  /**
   * Whether the current user is the owner of this contribution branch. Can be
   *     used to override project-level `READ` authorization. Always returns `false` if the
   *     current branch is not a contribution branch.
   */
  contributionOwner: Scalars['Boolean'];
  /** Alphanumeric short ID of the branch, for use with Pitcher */
  id: Scalars['String'];
  /** Timestamp of the last time the current user accessed this branch on CodeSandbox */
  lastAccessedAt: Maybe<Scalars['String']>;
  /** Information about the last commit made by CodeSandbox on this branch */
  lastCommit: Maybe<LastCommit>;
  /** Branch name as it appears in git */
  name: Scalars['String'];
  /** Branch owner, in the case of a contribution branch by a read-only user */
  owner: Maybe<User>;
  /** Parent project of this branch */
  project: Project;
  /** Open pull requests from this head branch */
  pullRequests: Array<PullRequest>;
  settings: BranchSettings;
  /** The name of the branch the current branch was created from. Only available if this branch was created via CodeSandbox. */
  sourceBranch: Maybe<Scalars['String']>;
  /** Information about the underlying git status of this branch */
  status: Maybe<Status>;
  /** Whether or not this branch exists on GitHub. Deduced from local information, so not guaranteed 100% accurate */
  upstream: Scalars['Boolean'];
};

/** Information about an active user connection to a project branch */
export type Connection = {
  __typename?: 'Connection';
  appId: Scalars['String'];
  clientId: Scalars['String'];
  color: Scalars['String'];
  timestamp: Scalars['String'];
  user: Maybe<User>;
};

/** Information about the last commit made by CodeSandbox for a project or branch */
export type LastCommit = {
  __typename?: 'LastCommit';
  color: Scalars['String'];
  message: Maybe<Scalars['String']>;
  sha: Scalars['String'];
  timestamp: Scalars['String'];
  user: Maybe<User>;
};

/** Pull Request as it appears on GitHub */
export type PullRequest = {
  __typename?: 'PullRequest';
  /** Number of code additions in this PR. Only available for GHA repositories. */
  additions: Maybe<Scalars['Int']>;
  /** Destination branch of this pull request. */
  baseBranch: Scalars['String'];
  /** Destination repository of the pull request (may not be the same as the HEAD) */
  baseRepository: Repository;
  /** Body (description) of the pull request */
  body: Maybe<Scalars['String']>;
  /** Number of changed files in this PR. Only available for GHA repositories. */
  changedFiles: Maybe<Scalars['Int']>;
  /** Comments that are not part of a PR review */
  comments: Array<GitHubPullRequestComment>;
  /** Number of comments on this PR. Only available for GHA repositories. */
  commentsCount: Maybe<Scalars['Int']>;
  /** Number of commits on this PR. Only available for GHA repositories. */
  commitsCount: Maybe<Scalars['Int']>;
  /** If available, the CodeSandbox user who opened the PR */
  creator: Maybe<User>;
  /** GitHub username of the person who opened the PR */
  creatorUsername: Scalars['String'];
  /** Number of code deletions in this PR. Only available for GHA repositories. */
  deletions: Maybe<Scalars['Int']>;
  /** Whether the PR is marked as a draft (instead of ready for review) */
  draft: Scalars['Boolean'];
  /** The name of the HEAD branch of this PR. This is the branch containing the changes */
  headBranch: Scalars['String'];
  /** URL to view the PR on GitHub */
  htmlUrl: Scalars['String'];
  /** Whether the PR can be merged in terms of Git conflicts. See also `mergeable_state`. */
  mergeable: Maybe<Scalars['Boolean']>;
  /** Whether the PR is allowed to be merged on GitHub */
  mergeableStatus: Maybe<Scalars['String']>;
  /** PR number as it appears on GitHub */
  number: Scalars['Int'];
  /** When a PR was closed, either due to closing or merging */
  prClosedAt: Maybe<Scalars['DateTime']>;
  /** When a PR was originally opened */
  prCreatedAt: Maybe<Scalars['DateTime']>;
  /** When a PR was merged */
  prMergedAt: Maybe<Scalars['DateTime']>;
  /** When information about a PR was last changed */
  prUpdatedAt: Scalars['DateTime'];
  /** Information about users who have been requested to review this PR. */
  requestedReviewers: Array<GithubRequestedReviewer>;
  /** Information about teams who have been requested to review this PR. */
  requestedTeams: Array<GithubRequestedTeam>;
  /** Number of review comments on this PR. Only available for GHA repositories. */
  reviewCommentsCount: Maybe<Scalars['Int']>;
  /** Information about reviews that have been submitted for this PR. */
  reviews: Array<PullRequestReview>;
  /** Current state of the pull request (ex. `open` or `closed`) */
  state: Scalars['String'];
  /** Title of the PR as it appears on GitHub */
  title: Scalars['String'];
};

/** Repository as seen on one of our git providers */
export type Repository = GitHubRepository;

/**
 * Repository as it appears on GitHub
 *
 * Repositories may be imported to CodeSandbox multiple times (for multiple teams). When possible,
 * data in this object will match what is currently available on GitHub. Note that some data may
 * be out of date.
 *
 * Over time, multiple distinct repositories (with different IDs) may have the same owner and name.
 * CodeSandbox will always communicate information about the most recent repository it knows about.
 */
export type GitHubRepository = {
  __typename?: 'GitHubRepository';
  /** Whether the repository can be forked; may be disabled in the GitHub repository settings */
  allowForking: Scalars['Boolean'];
  /** Whether the repository is archived (and therefore read-only) */
  archived: Scalars['Boolean'];
  /** Original creation date of the repository */
  createdAt: Scalars['DateTime'];
  /** Default branch, for example `main` */
  defaultBranch: Scalars['String'];
  /** Optional description of the repository */
  description: Maybe<Scalars['String']>;
  /** Whether the repository is a fork of another repository */
  fork: Scalars['Boolean'];
  /** Integer ID assigned by GitHub */
  id: Scalars['Int'];
  /** Whether the repository is configured as a template repository */
  isTemplate: Scalars['Boolean'];
  /** Name of the repository, not including the owner */
  name: Scalars['String'];
  /** Login name of the owning user or organization */
  owner: Scalars['String'];
  /** Direct ascendant repository, if this repository is a fork */
  parent: Maybe<GitHubRepository>;
  /** Current user's permission to the repository; `none` if unavailable */
  permission: GithubPermission;
  /** Whether the repository is private to a user or organization */
  private: Scalars['Boolean'];
  /** Time of the most recent push to any branch on the repository */
  pushedAt: Scalars['DateTime'];
  /** Original ascendant repository, if this repository is a fork; may be the same as the parent */
  source: Maybe<GitHubRepository>;
  /** Time of the most recent change to the repository's metadata */
  updatedAt: Scalars['DateTime'];
};

/** Current user's permission to the parent resource */
export enum GithubPermission {
  Admin = 'ADMIN',
  None = 'NONE',
  Read = 'READ',
  Write = 'WRITE',
}

/** Comment on a GitHub pull request that is not part of a review */
export type GitHubPullRequestComment = {
  __typename?: 'GitHubPullRequestComment';
  /** Relationship between the comment author and the repository */
  authorAssociation: GitHubAuthorAssociation;
  /** Raw (markdown and/or HTML) body of the comment */
  body: Scalars['String'];
  /** Original creation date of the comment */
  createdAt: Scalars['DateTime'];
  /** Link to view the comment on GitHub */
  htmlUrl: Scalars['String'];
  /** GitHub ID */
  id: Scalars['Int'];
  /** ID of the parent pull request */
  issueId: Scalars['Int'];
  /** Last edit or reaction date of the comment */
  updatedAt: Scalars['DateTime'];
  /** If available, the CodeSandbox user who created the comment */
  user: Maybe<User>;
  /** GitHub username of the user who created the comment */
  username: Scalars['String'];
};

/** Relationship between a user and repository */
export enum GitHubAuthorAssociation {
  Collaborator = 'COLLABORATOR',
  Contributor = 'CONTRIBUTOR',
  FirstTimeContributor = 'FIRST_TIME_CONTRIBUTOR',
  FirstTimer = 'FIRST_TIMER',
  Mannequin = 'MANNEQUIN',
  Member = 'MEMBER',
  None = 'NONE',
  Owner = 'OWNER',
}

/**
 * Information about a GitHub user who has been requested to review
 * a pull request and its associated CSB user if available
 */
export type GithubRequestedReviewer = {
  __typename?: 'GithubRequestedReviewer';
  /** Timestamp that the user was last requested to review this PR */
  requestedAt: Maybe<Scalars['DateTime']>;
  /** CodeSandbox user associated with this GitHub account, if available */
  user: Maybe<User>;
  /** GitHub username */
  username: Scalars['String'];
};

/** Information about a GitHub organization team. Currently very limited, but hopefully we can include member information in the future */
export type GithubRequestedTeam = {
  __typename?: 'GithubRequestedTeam';
  name: Scalars['String'];
  /** Timestamp that the team was last requested to review this PR */
  requestedAt: Maybe<Scalars['DateTime']>;
};

/** Pull Request review */
export type PullRequestReview = {
  __typename?: 'PullRequestReview';
  body: Maybe<Scalars['String']>;
  /**
   * Comments on the PR review
   *
   * Comments are returned in the order in which they were created. However, clients may wish to
   * observe the `is_reply_to_id` field to ensure threaded replies appear in order.
   */
  comments: Array<GitHubPullRequestReviewComment>;
  id: Scalars['Int'];
  state: PullRequestReviewState;
  submittedAt: Maybe<Scalars['DateTime']>;
  /** Timestamp of the last time the review was persisted to the DB. Null means it has not been yet persisted */
  syncedAt: Maybe<Scalars['DateTime']>;
  /** If available, the CodeSandbox user who submitted the review */
  user: Maybe<User>;
  /** GitHub username of the user who submitted the review */
  username: Scalars['String'];
};

/** Comment on a GitHub pull request review */
export type GitHubPullRequestReviewComment = {
  __typename?: 'GitHubPullRequestReviewComment';
  /** Relationship between the comment author and the repository */
  authorAssociation: GitHubAuthorAssociation;
  /** Raw (markdown and/or HTML) body of the comment */
  body: Scalars['String'];
  /** SHA of the commit to which the comment applies */
  commitId: Scalars['String'];
  /** Original creation date of the comment */
  createdAt: Scalars['DateTime'];
  /** Diff of the line that the comment refers to */
  diffHunk: Scalars['String'];
  /** Link to view the comment on GitHub */
  htmlUrl: Scalars['String'];
  /** GitHub ID */
  id: Scalars['Int'];
  /** Parent comment ID (in the context of a thread) */
  inReplyToId: Maybe<Scalars['Int']>;
  /** Line of the blob to which the comment applies. Last line of the range for a multi-line comment. */
  line: Maybe<Scalars['Int']>;
  /** SHA of the original commit to which the comment applies */
  originalCommitId: Scalars['String'];
  /** Line of the blob to which the comment applies. Last line of the range for a multi-line comment */
  originalLine: Maybe<Scalars['Int']>;
  /** First line of the range for a multi-line comment */
  originalStartLine: Maybe<Scalars['Int']>;
  /** Relative path of the file to which the comment applies */
  path: Scalars['String'];
  /** ID of the parent pull request review */
  pullRequestReviewId: Maybe<Scalars['Int']>;
  /** Side of the diff to which the comment applies. Side of the last line of the range for a multi-line comment */
  side: Maybe<GitHubPullRequestReviewCommentSide>;
  /** First line of the range for a multi-line comment */
  startLine: Maybe<Scalars['Int']>;
  /** Side of the first line of the range for a multi-line comment */
  startSide: Maybe<GitHubPullRequestReviewCommentSide>;
  /** Level at which the comment is targeted, can be a diff line or a file */
  subjectType: Maybe<GitHubPullRequestReviewCommentSubjectType>;
  /** Last edit or reaction date of the comment */
  updatedAt: Scalars['DateTime'];
  /** If available, the CodeSandbox user who created the comment */
  user: Maybe<User>;
  /** GitHub username of the user who created the comment */
  username: Scalars['String'];
};

/** Which side of a side-by-side diff a PR review comment pertains to */
export enum GitHubPullRequestReviewCommentSide {
  Left = 'LEFT',
  Right = 'RIGHT',
}

/** Whether a review comment pertains to an entire file or specific line(s) */
export enum GitHubPullRequestReviewCommentSubjectType {
  File = 'FILE',
  Line = 'LINE',
}

/** Current state of a GitHub pull request review */
export enum PullRequestReviewState {
  Approved = 'APPROVED',
  ChangesRequested = 'CHANGES_REQUESTED',
  Commented = 'COMMENTED',
  Dismissed = 'DISMISSED',
}

/** Settings for this branch. Stored with the branch so does not incur an extra db query */
export type BranchSettings = {
  __typename?: 'BranchSettings';
  protected: Scalars['Boolean'];
};

/** Information about the underlying git status of a branch */
export type Status = {
  __typename?: 'Status';
  hasChanges: Scalars['Boolean'];
  hasConflicts: Scalars['Boolean'];
  remote: StatusCommitCounts;
  target: StatusCommitCounts;
};

/** Counts of how many commits ahead and behind a branch is */
export type StatusCommitCounts = {
  __typename?: 'StatusCommitCounts';
  ahead: Scalars['Int'];
  behind: Scalars['Int'];
};

/**
 * Available computing resources for the project
 *
 * These resources may be custom for a project, or they may be determined by the team's subscription.
 */
export type Resources = {
  __typename?: 'Resources';
  /** CPU core count */
  cpu: Scalars['Int'];
  /** RAM in Gi */
  memory: Scalars['Int'];
  /** Disk space in Gi */
  storage: Scalars['Int'];
};

/** User-editable settings for a project */
export type ProjectSettings = {
  __typename?: 'ProjectSettings';
  /** Whether AI features are explicitly enabled or disabled for this project. If `null`, the team-wide setting applies. */
  aiConsent: Maybe<Scalars['Boolean']>;
};

export type WorkspaceSandboxSettings = {
  __typename?: 'WorkspaceSandboxSettings';
  aiConsent: TeamAiConsent;
  defaultAuthorization: TeamMemberAuthorization;
  minimumPrivacy: Scalars['Int'];
  preventSandboxExport: Scalars['Boolean'];
  preventSandboxLeaving: Scalars['Boolean'];
};

export type TeamAiConsent = {
  __typename?: 'TeamAiConsent';
  privateRepositories: Scalars['Boolean'];
  privateSandboxes: Scalars['Boolean'];
  publicRepositories: Scalars['Boolean'];
  publicSandboxes: Scalars['Boolean'];
};

export enum TeamMemberAuthorization {
  /** Permission to add/remove users and change permissions (in addition to write and read). */
  Admin = 'ADMIN',
  /** Permission view and comment on team sandboxes. */
  Read = 'READ',
  /** Permission create and edit team sandboxes (in addition to read). */
  Write = 'WRITE',
}

export type ProSubscription = {
  __typename?: 'ProSubscription';
  active: Scalars['Boolean'];
  billingInterval: Maybe<SubscriptionInterval>;
  cancelAt: Maybe<Scalars['DateTime']>;
  cancelAtPeriodEnd: Scalars['Boolean'];
  currency: Maybe<Scalars['String']>;
  id: Maybe<Scalars['UUID4']>;
  nextBillDate: Maybe<Scalars['DateTime']>;
  origin: Maybe<SubscriptionOrigin>;
  /** Whether or not this subscription has a payment method attached to it. It will almost always be true, except when a team started a trial without a credit card and has not yet added one. */
  paymentMethodAttached: Scalars['Boolean'];
  paymentProvider: Maybe<SubscriptionPaymentProvider>;
  quantity: Maybe<Scalars['Int']>;
  status: SubscriptionStatus;
  trialEnd: Maybe<Scalars['DateTime']>;
  trialStart: Maybe<Scalars['DateTime']>;
  type: SubscriptionType;
  /** Per-seat price for the billing interval as an integer of the smallest denomination of the local currency. */
  unitPrice: Maybe<Scalars['Int']>;
  updateBillingUrl: Maybe<Scalars['String']>;
};

export enum SubscriptionInterval {
  Monthly = 'MONTHLY',
  Yearly = 'YEARLY',
}

export enum SubscriptionOrigin {
  Legacy = 'LEGACY',
  Patron = 'PATRON',
  Pilot = 'PILOT',
}

export enum SubscriptionPaymentProvider {
  Stripe = 'STRIPE',
}

export enum SubscriptionStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Incomplete = 'INCOMPLETE',
  IncompleteExpired = 'INCOMPLETE_EXPIRED',
  Paused = 'PAUSED',
  Trialing = 'TRIALING',
  Unknown = 'UNKNOWN',
  Unpaid = 'UNPAID',
}

export enum SubscriptionType {
  PersonalPro = 'PERSONAL_PRO',
  TeamPro = 'TEAM_PRO',
}

export type SubscriptionSchedule = {
  __typename?: 'SubscriptionSchedule';
  billingInterval: Maybe<SubscriptionInterval>;
  current: Maybe<SubscriptionSchedulePhase>;
  upcoming: Maybe<SubscriptionSchedulePhase>;
};

export type SubscriptionSchedulePhase = {
  __typename?: 'SubscriptionSchedulePhase';
  endDate: Maybe<Scalars['String']>;
  items: Array<SubscriptionItem>;
  startDate: Maybe<Scalars['String']>;
};

export type SubscriptionItem = {
  __typename?: 'SubscriptionItem';
  name: Scalars['String'];
  /** Quantity is null for metered items, such as the on-demand credit usage. */
  quantity: Maybe<Scalars['Int']>;
  unitAmount: Maybe<Scalars['Int']>;
  unitAmountDecimal: Maybe<Scalars['String']>;
};

export enum TeamType {
  Personal = 'PERSONAL',
  Team = 'TEAM',
}

export type TeamUsage = {
  __typename?: 'TeamUsage';
  credits: Scalars['Int'];
  editorsQuantity: Scalars['Int'];
  privateProjectsQuantity: Scalars['Int'];
  privateSandboxesQuantity: Scalars['Int'];
  publicProjectsQuantity: Scalars['Int'];
  publicSandboxesQuantity: Scalars['Int'];
  restrictedSandboxes: Scalars['Int'];
  sandboxes: Scalars['Int'];
  unrestrictedSandboxes: Scalars['Int'];
};

export type UserAuthorization = {
  __typename?: 'UserAuthorization';
  authorization: TeamMemberAuthorization;
  drafts: Scalars['Int'];
  teamManager: Scalars['Boolean'];
  userId: Scalars['UUID4'];
};

/** A comment on a sandbox. A comment can also have replies and references. */
export type Comment = {
  __typename?: 'Comment';
  anchorReference: Maybe<Reference>;
  comments: Array<Comment>;
  content: Maybe<Scalars['String']>;
  id: Scalars['UUID4'];
  insertedAt: Scalars['NaiveDateTime'];
  isRead: Scalars['Boolean'];
  isResolved: Scalars['Boolean'];
  parentComment: Maybe<Comment>;
  references: Array<Reference>;
  replyCount: Scalars['Int'];
  sandbox: Sandbox;
  updatedAt: Scalars['NaiveDateTime'];
  user: User;
};

export type Reference = {
  __typename?: 'Reference';
  id: Scalars['UUID4'];
  metadata: ReferenceMetadata;
  resource: Scalars['String'];
  type: Scalars['String'];
};

/** The metadata of a reference */
export type ReferenceMetadata =
  | CodeReferenceMetadata
  | ImageReferenceMetadata
  | PreviewReferenceMetadata
  | UserReferenceMetadata;

export type CodeReferenceMetadata = {
  __typename?: 'CodeReferenceMetadata';
  anchor: Scalars['Int'];
  code: Scalars['String'];
  head: Scalars['Int'];
  path: Scalars['String'];
  sandboxId: Scalars['String'];
};

export type ImageReferenceMetadata = {
  __typename?: 'ImageReferenceMetadata';
  fileName: Scalars['String'];
  resolution: Array<Scalars['Int']>;
  uploadId: Scalars['UUID4'];
  url: Scalars['String'];
};

export type PreviewReferenceMetadata = {
  __typename?: 'PreviewReferenceMetadata';
  height: Scalars['Int'];
  previewPath: Scalars['String'];
  screenshotUrl: Maybe<Scalars['String']>;
  userAgent: Scalars['String'];
  width: Scalars['Int'];
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type UserReferenceMetadata = {
  __typename?: 'UserReferenceMetadata';
  userId: Scalars['String'];
  username: Scalars['String'];
};

/** An invitation to a sandbox */
export type Invitation = {
  __typename?: 'Invitation';
  authorization: Authorization;
  email: Maybe<Scalars['String']>;
  id: Maybe<Scalars['ID']>;
  sandbox: Sandbox;
  token: Scalars['String'];
};

export type SandboxProtectionSettings = {
  __typename?: 'SandboxProtectionSettings';
  preventSandboxExport: Scalars['Boolean'];
  preventSandboxLeaving: Scalars['Boolean'];
};

/** User-editable settings for a sandbox */
export type SandboxSettings = {
  __typename?: 'SandboxSettings';
  /** Whether AI features are explicitly enabled or disabled for this sandbox. If `null`, the team-wide setting applies. */
  aiConsent: Maybe<Scalars['Boolean']>;
};

export type Source = {
  __typename?: 'Source';
  id: Maybe<Scalars['UUID4']>;
  template: Maybe<Scalars['String']>;
};

export type TeamPreview = {
  __typename?: 'TeamPreview';
  avatarUrl: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  id: Scalars['UUID4'];
  name: Scalars['String'];
  shortid: Scalars['String'];
};

export enum GitProvider {
  Github = 'GITHUB',
}

/**
 * Live session started by an editor of a cloud sandbox for the benefit of guest users
 *
 * In a live session, there are editors (people who naturally have write access to the content)
 * and guests (a superset that includes editors and other individuals who join the live session).
 * Editors always have write permission, while non-editor guests have permissions determined by
 * the default level-of-access or an individual override for that particular user. See mutations
 * `setLiveSessionDefaultPermission` and `setLiveSessionGuestPermission` for more information.
 */
export type LiveSession = {
  __typename?: 'LiveSession';
  /**
   * Default level of access for non-editor guests
   *
   * Editors of the cloud sandbox can change this using the `setLiveSessionDefaultPermission`
   * mutation.
   */
  defaultPermission: LiveSessionPermission;
  /**
   * Guests of a live session
   *
   * This list includes all non-editor guests, regardless of their level of access. Users who have
   * natural write access to the content will not appear here.
   */
  guests: Array<LiveSessionGuest>;
  /** User that started the live session */
  host: Maybe<LiveSessionHost>;
  /** Session identifier, used for client-side caching */
  id: Scalars['ID'];
  /** Timestamp of the time when the live session opened (ISO 8601) */
  startedAt: Scalars['String'];
  /**
   * Timestamp of the time when the live session ended (ISO 8601)
   *
   * In practice, this field will only be visible in response to a `stopLiveSession` mutation or
   * as the final message of a `liveSessionEvents` subscription.
   */
  stoppedAt: Maybe<Scalars['String']>;
  /** ID of the related sandbox VM */
  vmId: Scalars['ID'];
};

/** Level of access for a live session */
export enum LiveSessionPermission {
  Read = 'READ',
  Write = 'WRITE',
}

/**
 * Guest of a live session
 *
 * This record represents a non-editor guest of a live session.
 */
export type LiveSessionGuest = {
  __typename?: 'LiveSessionGuest';
  /** URL of the user's avatar image */
  avatarUrl: Scalars['String'];
  /** Level of access for the guest */
  permission: LiveSessionPermission;
  /** CodeSandbox user ID */
  userId: Scalars['ID'];
  /** CodeSandbox username */
  username: Scalars['String'];
};

/**
 * Hose of a live session
 *
 * This user initially started the live session.
 */
export type LiveSessionHost = {
  __typename?: 'LiveSessionHost';
  /** URL of the user's avatar image */
  avatarUrl: Scalars['String'];
  /** CodeSandbox user ID */
  userId: Scalars['ID'];
  /** CodeSandbox username */
  username: Scalars['String'];
};

/** Sorting key for repositories */
export enum UserRepoSort {
  Created = 'CREATED',
  FullName = 'FULL_NAME',
  Pushed = 'PUSHED',
  Updated = 'UPDATED',
}

/** Details about a repository as it appears on GitHub (Open API `repository`) */
export type GithubRepo = {
  __typename?: 'GithubRepo';
  /** Whether the GitHub App is installed for the repository */
  appInstalled: Scalars['Boolean'];
  /** Current users's access to the GitHub repo */
  authorization: GithubRepoAuthorization;
  /** Full repository name, e.g. owner/name */
  fullName: Scalars['String'];
  /** Integer ID from GitHub */
  id: Scalars['ID'];
  /** Short repository name */
  name: Scalars['String'];
  /** Owning user or organization */
  owner: GithubOrganization;
  /** Whether this repository is marked as private */
  private: Scalars['Boolean'];
  /** ISO 8601 datetime */
  pushedAt: Maybe<Scalars['String']>;
  /** ISO 8601 datetime */
  updatedAt: Scalars['String'];
};

export enum GithubRepoAuthorization {
  Read = 'READ',
  Write = 'WRITE',
}

/**
 * Organization as it appears on GitHub (intersection of Open API `simple-user` and
 * `organization-simple`)
 */
export type GithubOrganization = {
  __typename?: 'GithubOrganization';
  /** URL for organization image */
  avatarUrl: Scalars['String'];
  /** Optional organization description */
  description: Maybe<Scalars['String']>;
  /** Integer ID */
  id: Scalars['ID'];
  /** Organization name */
  login: Scalars['String'];
};

export type Limits = {
  __typename?: 'Limits';
  personalFree: TeamLimits;
  personalPro: TeamLimits;
  teamFree: TeamLimits;
  teamPro: TeamLimits;
};

export type CurrentUser = {
  __typename?: 'CurrentUser';
  bookmarkedTemplates: Array<Template>;
  collaboratorSandboxes: Array<Sandbox>;
  collection: Maybe<Collection>;
  collections: Array<Collection>;
  deletionRequested: Scalars['Boolean'];
  /**
   * Whether this user should be offered a trial
   *
   * Returns false if they have created any teams that have used a trial in the last 6 months.
   */
  eligibleForTrial: Scalars['Boolean'];
  /**
   * List workspaces a user is eligible to join
   *
   * This endpoint looks at the user's verified email address domains to find workspaces that allow
   * automatically joining.
   *
   * Note that this endpoint is _expensive_ to calculate, and should only be called when necessary.
   */
  eligibleWorkspaces: Array<TeamPreview>;
  email: Scalars['String'];
  /** User-based feature flags and whether or not they are active for the current user */
  featureFlags: UserFeatureFlags;
  /** Get all of the current user's GitHub organizations */
  githubOrganizations: Maybe<Array<GithubOrganization>>;
  /** GitHub profile information for the current user */
  githubProfile: Maybe<GithubProfile>;
  /**
   * Get GitHub repositories owned by the current user.
   *
   * If either `page` or `perPage` are specified, then a single page of results will be returned.
   * If neither argument is given, then all results will be returned. Note that this still requires
   * paginated requests to the GitHub API, but the server will concatenate the results.
   *
   * Defaults to sorting by repository name (`sort` value `FULL_NAME`). In this case, repositories
   * are returned in ascending order. If any other value is given, repositories are returned in
   * descending order (ex. most recently pushed first).
   */
  githubRepos: Array<GithubRepo>;
  id: Scalars['UUID4'];
  likedSandboxes: Array<Sandbox>;
  name: Maybe<Scalars['String']>;
  notificationPreferences: Maybe<NotificationPreferences>;
  notifications: Array<Notification>;
  personalWorkspaceId: Scalars['UUID4'];
  primaryWorkspaceId: Maybe<Scalars['UUID4']>;
  provider: ProviderName;
  recentBranches: Array<Branch>;
  recentlyAccessedSandboxes: Array<Sandbox>;
  recentlyUsedTemplates: Array<Template>;
  recentProjects: Array<Project>;
  sandboxes: Array<Sandbox>;
  team: Maybe<Team>;
  teams: Array<Team>;
  templates: Array<Template>;
  username: Scalars['String'];
  workspaces: Array<Team>;
};

export type CurrentUserCollectionArgs = {
  path: Scalars['String'];
  teamId: InputMaybe<Scalars['ID']>;
};

export type CurrentUserCollectionsArgs = {
  teamId: InputMaybe<Scalars['ID']>;
};

export type CurrentUserGithubReposArgs = {
  affiliation?: InputMaybe<Array<UserRepoAffiliation>>;
  page: InputMaybe<Scalars['Int']>;
  perPage: InputMaybe<Scalars['Int']>;
  sort: InputMaybe<UserRepoSort>;
};

export type CurrentUserNotificationsArgs = {
  limit: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<OrderBy>;
  type: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CurrentUserRecentBranchesArgs = {
  contribution: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  teamId: InputMaybe<Scalars['UUID4']>;
};

export type CurrentUserRecentlyAccessedSandboxesArgs = {
  limit: InputMaybe<Scalars['Int']>;
  teamId: InputMaybe<Scalars['UUID4']>;
};

export type CurrentUserRecentlyUsedTemplatesArgs = {
  teamId: InputMaybe<Scalars['UUID4']>;
};

export type CurrentUserRecentProjectsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};

export type CurrentUserSandboxesArgs = {
  hasOriginalGit: InputMaybe<Scalars['Boolean']>;
  limit: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<OrderBy>;
  showDeleted: InputMaybe<Scalars['Boolean']>;
};

export type CurrentUserTeamArgs = {
  id: InputMaybe<Scalars['UUID4']>;
};

export type CurrentUserTemplatesArgs = {
  showAll: InputMaybe<Scalars['Boolean']>;
  teamId: InputMaybe<Scalars['UUID4']>;
};

export type UserFeatureFlags = {
  __typename?: 'UserFeatureFlags';
  ubbBeta: Scalars['Boolean'];
};

/**
 * User profile for an authenticated user.
 *
 * This field can be used to determine if a user has explicitly connected their GH account, since it
 * will be null unless we have a GitHub token. Just having created an account with GitHub is not
 * enough to populate this field.
 */
export type GithubProfile = {
  __typename?: 'GithubProfile';
  /** URL for user profile image */
  avatarUrl: Scalars['String'];
  /** Integer ID */
  id: Scalars['ID'];
  /** GitHub username */
  login: Scalars['String'];
  /** Real name */
  name: Maybe<Scalars['String']>;
  /** List of OAuth scopes the user has granted */
  scopes: Array<Scalars['String']>;
};

/** The relationship between a user and a repository they have access to */
export enum UserRepoAffiliation {
  Collaborator = 'COLLABORATOR',
  OrganizationMember = 'ORGANIZATION_MEMBER',
  Owner = 'OWNER',
}

export type NotificationPreferences = {
  __typename?: 'NotificationPreferences';
  emailCommentMention: Scalars['Boolean'];
  emailCommentReply: Scalars['Boolean'];
  /**
   * Whether or not a user wants to receive marketing emails.
   * Since we do not receive webhooks from the marketing email service, it is possible for this to show
   * `true` when in reality a user has already unsubscribed via the link in an email.
   * This is inevitable, but does not affect whether or not they get emails.
   */
  emailMarketing: Scalars['Boolean'];
  emailNewComment: Scalars['Boolean'];
  emailSandboxInvite: Scalars['Boolean'];
  emailTeamInvite: Scalars['Boolean'];
  emailTeamRequest: Scalars['Boolean'];
  /**
   * Whether or not a user wants an in-browser notification if someone submits a review on their PR.
   *
   * This will only be sent when a repository has the GitHub App installed and the PR owner is a
   * member of a CodeSandbox team that has the project imported.
   */
  inAppPrReviewReceived: Scalars['Boolean'];
  /**
   * Whether or not a user wants an in-browser notification if someone requests their review on a PR.
   *
   * This will only be sent when a repository has the GitHub App installed and the requested reviewer is a
   * member of a CodeSandbox team that has the project imported.
   */
  inAppPrReviewRequest: Scalars['Boolean'];
};

export type Notification = {
  __typename?: 'Notification';
  archived: Scalars['Boolean'];
  data: Scalars['String'];
  id: Scalars['UUID4'];
  insertedAt: Scalars['NaiveDateTime'];
  read: Scalars['Boolean'];
  type: Scalars['String'];
};

/** The oAuth provider used to create the account */
export enum ProviderName {
  Apple = 'APPLE',
  Github = 'GITHUB',
  Google = 'GOOGLE',
}

export type RootMutationType = {
  __typename?: 'RootMutationType';
  /** Accept an invitation to a team */
  acceptTeamInvitation: Team;
  /** Add a collaborator */
  addCollaborator: Collaborator;
  /** Add sandboxes to an album (idempotent) */
  addSandboxesToAlbum: Maybe<Album>;
  /** Add sandboxes to a collection */
  addToCollection: Collection;
  /** Add sandboxes to a collection and/or team */
  addToCollectionOrTeam: Array<Maybe<Sandbox>>;
  /** Archive all notifications */
  archiveAllNotifications: User;
  /** Archive one notification */
  archiveNotification: Notification;
  /** bookmark a template */
  bookmarkTemplate: Maybe<Template>;
  /** Cancel deletion of current user */
  cancelDeleteCurrentUser: Scalars['String'];
  /** Change authorization of a collaborator */
  changeCollaboratorAuthorization: Collaborator;
  changeSandboxInvitationAuthorization: Invitation;
  /** Set team member authorization levels */
  changeTeamMemberAuthorizations: Team;
  /** Clear notification unread count */
  clearNotificationCount: User;
  /**
   * Convert an existing subscription to usage-based billing
   *
   * This mutation requires the caller to be an admin of the team. Otherwise, an error will be
   * returned `"Not an admin"`. This return value will always be `true`. Clients should observe
   * the `teamEvents` subscription for updates to the workspace subscription.
   */
  convertToUsageBilling: Scalars['Boolean'];
  createAlbum: Album;
  /**
   * Create or import a branch to a team-associated project
   *
   * This endpoint allows users to create a new branch on CodeSandbox. The branch may already exist
   * in the git provider, or not. Depending on the user's level of access to the repository, the
   * branch could be a _contribution branch_, which will automatically fork a new repository and
   * project on the first commit.
   *
   * A team ID is required for this mutation. To import an existing branch into a read-only project
   * that is not team-associated, see `mutation importReadOnlyBranch`.
   *
   * Example (for `codesandbox/test-repo` branch `test-branch`):
   *
   * ```gql
   * mutation createBranch(
   *   provider: GITHUB,
   *   owner: "codesandbox",
   *   name: "test-repo",
   *   team: "ebfeb17e-3301-4069-a476-447b2fcb525c",
   *   branch: "test-branch"
   * ) { id }
   * ```
   */
  createBranch: Branch;
  createCodeComment: Comment;
  /** Create a collection */
  createCollection: Collection;
  createComment: Comment;
  /**
   * Create a contribution branch on a non-team-assinged project.
   *
   * This endpoint allows users to create a contribution branch on a read-only project. This branch will only be created on CodeSandbox and the branch will be a _contribution branch_, which will automatically fork a new repository andproject on the first commit.
   *
   * A team ID is not accepted for this mutation. To create a branch on a team-assigned project, see `mutation createBranch`.
   *
   * Example (for `codesandbox/test-repo` branch `test-branch`):
   *
   * ```gql
   * mutation createContributionBranch(
   *   provider: GITHUB,
   *   owner: "codesandbox",
   *   name: "test-repo",
   * ) { id }
   * ```
   */
  createContributionBranch: Branch;
  /**
   * Create a review on a pull request on GitHub.
   *
   * Requires a signed-in user who has granted additional GitHub permissions. Returns the updated
   * pull request review. Clients should be prepared to receive the same or additional information
   * from the `BranchEvents` or `ProjectEvents` subscription with a `PullRequestReviewEvent` once
   * the GitHub webhook is processed.
   */
  createGithubPullRequestReview: PullRequestReview;
  /** Create or Update a private registry */
  createOrUpdatePrivateNpmRegistry: PrivateRegistry;
  createPreviewComment: Comment;
  createSandboxInvitation: Invitation;
  /** Create a team */
  createTeam: Team;
  deleteAlbum: Scalars['String'];
  /**
   * Remove a branch from CodeSandbox
   *
   * Does not affect other copies of the same branch related to projects in other teams, and does
   * not affect the branch in the git provider. The branch VM will be archived, possibly losing
   * uncommitted work-in-progress.
   *
   * Returns the scalar `true` on success, and errors otherwise.
   *
   * Example (for branch with short ID `abc123`)
   *
   * ```gql
   * mutation deleteBranch(id: "abc123")
   * ```
   */
  deleteBranch: Scalars['Boolean'];
  /** Delete a collection and all subfolders */
  deleteCollection: Array<Collection>;
  /** Soft delete a comment. Note: all child comments will also be deleted. */
  deleteComment: Comment;
  /**
   * Request deletion of current user
   *
   * This mutation does not immediately delete the current user, but instead schedules the deletion
   * for some time in the next 24 hours. Users have an opportunity to cancel the deletion request
   * using `mutation cancelDeleteCurrentUser`.
   *
   * There are three situations in which this mutation will fail:
   *
   * 1. If no user is currently authenticated
   * 2. If the user is the only admin to a team that has other members
   * 3. If the user is an admin of a team with an active subscription or trial
   *
   * The third situation can be ignored by passing `true` to the argument `confirm`. It is intended
   * that users may try to delete once, read the error message, and then check a box to confirm
   * their choice and submit again.
   *
   * **Note**: If not supplied, `confirm` is automatically `true` for backwards compatibility.
   *
   * ## Examples
   *
   * For a first attempt at deletion, use `confirm: false`.
   *
   * ```gql
   * deleteCurrentUser(confirm: false)
   * ```
   *
   * This will return successful if the user does not meet any of the failure criteria listed
   * above. Otherwise, one of the following errors will be returned:
   *
   * * `Please log in`
   * * `You are the only admin of a team. Please designate another admin or delete the following teams: ...`
   * * `You have active subscription(s) on the following teams: ... Are you sure you want to remove your account?`
   *
   * For the last error, if the user confirms their desire to delete the account, use
   * `confirm: true` to bypass the final check. In this case, only these two errors will occur:
   *
   * * `Please log in`
   * * `You are the only admin of a team. Please designate another admin or delete the following teams: ...`
   */
  deleteCurrentUser: Scalars['String'];
  /**
   * Delete a comment from a pull request review
   *
   * Requires a signed-in user who has granted additional GitHub permissions. This endpoint returns
   * a simple message, since the original comment was deleted. Clients can expect an event on the
   * `BranchEvents` and `ProjectEvents` subscriptions with the full body of the removed comment.
   */
  deleteGithubPullRequestReviewComment: Scalars['String'];
  /** Delete a private registry */
  deletePrivateNpmRegistry: Maybe<PrivateRegistry>;
  /**
   * Remove a project from CodeSandbox
   *
   * Does not affect other copies of the project related to the same repository in other teams, and
   * does not affect the repository in the git provider. Branches related to the project will be
   * removed, potentially losing uncommitted work-in-progress.
   *
   * Returns the scalar `true` on success, and errors otherwise.
   *
   * Example (for `https://github.com/codesandbox/test-repo.git`)
   *
   * ```gql
   * mutation deleteProject(
   *   provider: GITHUB,
   *   owner: "codesandbox",
   *   name: "test-repo",
   *   team: "0fd70d0b-7642-4426-a8b3-38ee18c7c9cc"
   * )
   * ```
   */
  deleteProject: Scalars['Boolean'];
  /**
   * Remove a project from CodeSandbox using its CodeSandbox ID
   *
   * Unlike `mutation deleteProject`, this mutation supports deleting projects related to a
   * repository that has been deleted and recreated with the same name. Otherwise, a matching
   * project related to the latest known instance of a repository will be deleted.
   *
   * The target project must be team-assigned, and the user must have write access on that team.
   *
   * Does not affect other copies of the project related to the same repository in other teams, and
   * does not affect the repository in the git provider. Branches related to the project will be
   * removed, potentially losing uncommitted work-in-progress.
   *
   * Returns the scalar `true` on success, and errors otherwise.
   *
   * Example:
   *
   * ```gql
   * mutation deleteProject(id: "9ff91681-5ae9-452c-abaa-f9bf7033d82c")
   * ```
   */
  deleteProjectById: Scalars['Boolean'];
  /** Delete sandboxes */
  deleteSandboxes: Array<Sandbox>;
  deleteWorkspace: Scalars['String'];
  /**
   * Dismiss a submitted pull request review
   *
   * Requires a signed-in user who has granted additional GitHub permissions. Returns the updated
   * pull request review. Clients should be prepared to receive the same or additional information
   * from the `BranchEvents` or `ProjectEvents` subscription with a `PullRequestReviewEvent` once
   * the GitHub webhook is processed.
   *
   * **Note**: To dismiss a pull request review on a protected branch, the user must be a
   * repository administrator or be included in the list of people or teams who can dismiss pull
   * request reviews.
   */
  dismissGithubPullRequestReview: PullRequestReview;
  /**
   * Import an existing branch from a repository
   *
   * This endpoint allows users to import an existing branch from the git provider to CodeSandbox.
   * To create a new branch on CodeSandbox that may not exist on the git provider, see `mutation
   * createBranch`.
   *
   * A team ID is required for this mutation. To import an existing branch into a read-only project
   * that is not team-associated, see `mutation importReadOnlyBranch`.
   *
   * Example (for `codesandbox/test-repo` branch `test-branch`):
   *
   * ```gql
   * mutation importBranch(
   *   provider: GITHUB,
   *   owner: "codesandbox",
   *   name: "test-repo",
   *   branch: "test-branch",
   *   team: "3e0a6cf9-af9c-4a7f-b4fb-1b2040e24a86"
   * ) { id }
   * ```
   */
  importBranch: Branch;
  /**
   * Import a repository to a specific team
   *
   * This endpoint should be called when a signed-in user **explicitly** wants to import a
   * Repository. It will have immediate effect on the team's usage limits. For implicit loading of a
   * project, see the `project` top-level query. For importing a read-only project for a public
   * repository, see the `importReadOnlyProject` mutation.
   *
   * Example (for `https://github.com/codesandbox/test-repo.git`)
   *
   * ```gql
   * mutation importProject(
   *   provider: GITHUB,
   *   owner: "codesandbox",
   *   name: "test-repo",
   *   team: "0fd70d0b-7642-4426-a8b3-38ee18c7c9cc"
   * ) { id }
   * ```
   */
  importProject: Project;
  /**
   * Import an existing branch from a public repository
   *
   * Anonymous users and users without git credentials may only view branches that exist in the git
   * provider. This endpoint allows users to import such a branch to the read-only copy of a project.
   * See `mutation createBranch` for creating a new branch on a user-writable project.
   *
   * Example (for `codesandbox/test-repo` branch `test-branch`):
   *
   * ```gql
   * mutation importReadOnlyBranch(
   *   provider: GITHUB,
   *   owner: "codesandbox",
   *   name: "test-repo",
   *   branch: "test-branch"
   * ) { id }
   * ```
   */
  importReadOnlyBranch: Branch;
  /**
   * Import a public repository as a read-only project
   *
   * This endpoint should be called when a user **explicitly** wants to import a Repository. The
   * repository must be public. For importing private repositories, or importing a repository to
   * a specific team for editing, see the `importProject` mutation.
   *
   * Example (for `https://github.com/codesandbox/test-repo.git`)
   *
   * ```gql
   * mutation importReadOnlyProject(
   *   provider: GITHUB,
   *   owner: "codesandbox",
   *   name: "test-repo"
   * ) { id }
   * ```
   */
  importReadOnlyProject: Project;
  /** Increments the sandbox version and marks its screenshot as outdated. Requires `write_code` permission or above. */
  incrementSandboxVersion: Scalars['String'];
  /** Invite someone to a team */
  inviteToTeam: Team;
  /** Invite someone to a team via email */
  inviteToTeamViaEmail: Scalars['String'];
  /**
   * Join a workspace the user is eligible to join based on email domain
   *
   * A list of eligible workspaces (and their IDs) is available from the `me > eligibleWorkspaces`
   * query. This endpoint requires an authenticated user and an eligible workspace ID. Otherwise,
   * one of the following errors will be returned:
   *
   * * `Please log in`
   * * `Workspace not found`
   *
   * The latter error represents both invalid IDs and ineligible workspaces.
   */
  joinEligibleWorkspace: Team;
  /**
   * Join an existing live session
   *
   * Accessible to non-editor guests for content that has an existing live session. For editors,
   * this mutation is a no-op. Returns an error if no live session exists.
   */
  joinLiveSession: LiveSession;
  /**
   * Join the usage-based billing beta on-demand
   *
   * This mutation requires the caller to be an admin of the team. Otherwise, an error will be
   * returned `"Not an admin"`. The return value will always be `true`.
   */
  joinUsageBillingBeta: Scalars['Boolean'];
  /** Leave a team */
  leaveTeam: Scalars['String'];
  /** Make templates from sandboxes */
  makeSandboxesTemplates: Array<Template>;
  /** Mark all notifications as read */
  markAllNotificationsAsRead: User;
  /** Mark one notification as read */
  markNotificationAsRead: Notification;
  /**
   * Merge a pull request if merging is possible
   *
   * Pull requests have `mergeable` and `mergeableState` fields that indicate whether they can be
   * merged (due to git conflicts and other merge requirements). However, these fields may not be
   * up-to-date. Before attempting to merge, this mutation will check the latest status and return
   * an error if merging is not possible. Furthermore, it will publish an event for the related
   * repository and branch with the updated status.
   *
   * On success, the project and branch subscriptions will receive the updated pull request as soon
   * as the resulting webhook is received.
   */
  mergeGithubPullRequest: Scalars['String'];
  permanentlyDeleteSandboxes: Array<Sandbox>;
  /**
   * See proposed invoice for converting from seat-based to usage-based billing
   *
   * This mutation requires the caller to be an admin of the team. Otherwise, an error will be
   * returned `"Not an admin"`. Why a mutation? This operation requires communicating information
   * with Stripe in a way that is more appropriate for a mutation than a query.
   */
  previewConvertToUsageBilling: InvoicePreview;
  /** @deprecated Subscription management no longer supported via GraphQL */
  previewUpdateSubscriptionBillingInterval: BillingPreview;
  previewUpdateUsageSubscriptionPlan: InvoicePreview;
  reactivateSubscription: ProSubscription;
  redeemSandboxInvitation: Invitation;
  /** Redeem an invite token from a team */
  redeemTeamInviteToken: Team;
  /** Reject an invitation to a team */
  rejectTeamInvitation: Scalars['String'];
  /** Remove a collaborator */
  removeCollaborator: Collaborator;
  /** Remove someone from a team */
  removeFromTeam: Team;
  /**
   * Remove one or more GH users from the list of requested reviewers for this pull request.
   * Returns the list of users that are still requested to review.
   */
  removeRequestedGithubPullRequestReviewers: Array<GithubRequestedReviewer>;
  /** Remove sandboxes from album (idempotent) */
  removeSandboxesFromAlbum: Maybe<Album>;
  /** Rename a collection and all subfolders */
  renameCollection: Array<Collection>;
  renameSandbox: Sandbox;
  /**
   * Reply to a pull request review on GitHub
   *
   * Requires a signed-in user who has granted additional GitHub permissions. This mutation returns
   * only "OK" or an error message. To receive the created review data, the GitHub app needs to be
   * installed in the repository, and clients need to subscribe to `BranchEvents` or
   * `ProjectEvents` which will receive a `PullRequestReviewCommentEvent` once the webhook from
   * GitHub gets processed.
   */
  replyToGithubPullRequestReview: GitHubPullRequestReviewComment;
  /**
   * Request one or more GH users to review a pull request
   * Returns complete list of users  requested to review.
   */
  requestGithubPullRequestReviewers: Array<GithubRequestedReviewer>;
  /**
   * Request access to a team by ID
   *
   * This will notify admins of the team that the current user would like to join the team. It is
   * up to the team admins to complete the process. A simple message for the user is returned.
   *
   * ```gql
   * mutation requestTeamInvitation(teamId: "61cbc936-470c-48f9-9520-2b862493e0d8")
   * ```
   */
  requestTeamInvitation: Scalars['String'];
  resolveComment: Comment;
  revokeSandboxInvitation: Invitation;
  /** Revoke an invitation to a team */
  revokeTeamInvitation: Team;
  setBranchProtection: Branch;
  /** Set the default authorization for any new members joining this workspace */
  setDefaultTeamMemberAuthorization: WorkspaceSandboxSettings;
  /**
   * Set the default level of access for guests in a live session
   *
   * Accessible to editors of the underlying content.
   *
   * With a default permission of `READ`, guests join with the ability to read the code and watch
   * changes taking place without making changes of their own, like a classroom mode. With `WRITE`,
   * all new guests will be able to make changes immediately.
   *
   * Individual guest permissions can be overridden using the `setLiveSessionGuestPermission`
   * mutation. Changing the default permission does not reset any individual guest permissions
   * set using the `setLiveSessionGuestPermission` mutation. It also does not affect editors (those
   * who naturally have access to the content).
   */
  setLiveSessionDefaultPermission: LiveSession;
  /**
   * Set the level of access for a specific guest in a live session
   *
   * Accessible to editors of the underlying content.
   *
   * If an individual guest should have a level of access different than the default permission
   * set using the `setLiveSessionDefaultPermission` mutation, this mutation allows targeted
   * access. It has no effect on editors (those who naturally have access to the content).
   */
  setLiveSessionGuestPermission: LiveSession;
  setPreventSandboxesExport: Array<Sandbox>;
  setPreventSandboxesLeavingWorkspace: Array<Sandbox>;
  /** Change the primary workspace for the current user */
  setPrimaryWorkspace: Scalars['String'];
  setSandboxesFrozen: Array<Sandbox>;
  setSandboxesPrivacy: Array<Sandbox>;
  /** Configure consent for AI features in this team. Can be overridden for specific repositories or sandboxes. */
  setTeamAiConsent: TeamAiConsent;
  /** Set the description of the team */
  setTeamDescription: Team;
  /** Set user-editable limits for the workspace */
  setTeamLimits: Scalars['String'];
  /** Set user-provided metadata about the workspace */
  setTeamMetadata: Team;
  /** Set minimum privacy level for workspace */
  setTeamMinimumPrivacy: WorkspaceSandboxSettings;
  /** Set the name of the team */
  setTeamName: Team;
  setWorkspaceSandboxSettings: WorkspaceSandboxSettings;
  softCancelSubscription: ProSubscription;
  /**
   * Begin a new live session for a running VM
   *
   * Accessible to editors of the underlying content as long as live sessions are allowed by the
   * content and its workspace.
   *
   * The live session will be automatically stopped a few minutes after the VM session ends, or
   * immediately after calling the `stopLiveSession` mutation.
   */
  startLiveSession: LiveSession;
  /**
   * Immediately close a live session
   *
   * Accessible to editors of the underlying content.
   */
  stopLiveSession: LiveSession;
  /** Unbookmark a template */
  unbookmarkTemplate: Maybe<Template>;
  /** Convert templates back to sandboxes */
  unmakeSandboxesTemplates: Array<Template>;
  unresolveComment: Comment;
  updateAlbum: Album;
  updateComment: Comment;
  /** Change details of current user */
  updateCurrentUser: User;
  /** Edit the body of a pull request review. */
  updateGithubPullRequestReview: PullRequestReview;
  /**
   * Update a comment from a pull request review
   *
   * Requires a signed-in user who has granted additional GitHub permissions. This endpoint returns
   * the updated review comment. Clients can expect an event on the
   * `BranchEvents` and `ProjectEvents` subscriptions with the full body of the edited comment.
   */
  updateGithubPullRequestReviewComment: GitHubPullRequestReviewComment;
  /** Set a user's notification preferences */
  updateNotificationPreferences: NotificationPreferences;
  /** Update notification read status */
  updateNotificationReadStatus: Notification;
  /**
   * Update the settings for a project. All settings are nullable.
   * Not passing a specific argument will leave it unchanged, explicitly passing `null` will revert it to the default.
   */
  updateProjectSettings: ProjectSettings;
  /**
   * Update the VM tier of a project. All branches will start using this new VM tier as soon as the user connects
   * to the branch (also for running branches). To optimistically update a branch without reload/reconnect,
   * you can pass a branch ID as well that we'll update immediately.
   */
  updateProjectVmTier: Resources;
  /**
   * Update the settings for a sandbox. All settings are nullable.
   * Not passing a specific argument will leave it unchanged, explicitly passing `null` will revert it to the default.
   */
  updateSandboxSettings: SandboxSettings;
  /**
   * update subscription details (not billing details)
   * @deprecated Subscription management no longer supported via GraphQL
   */
  updateSubscription: ProSubscription;
  /** @deprecated Subscription management no longer supported via GraphQL */
  updateSubscriptionBillingInterval: ProSubscription;
  /**
   * Update addons for usage-based billing subscription.
   *
   * This mutation requires the caller to be an admin of the team. Otherwise, an error will be
   * returned `"Not an admin"`. This return value will always be `true`. Clients should observe
   * the `teamEvents` subscription for updates to the workspace subscription.
   *
   * After the upcoming pricing change anything other than an empty list to cancel all add-ons
   * will return an error.
   */
  updateUsageSubscription: Scalars['Boolean'];
  updateUsageSubscriptionPlan: Scalars['Boolean'];
};

export type RootMutationTypeAcceptTeamInvitationArgs = {
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeAddCollaboratorArgs = {
  authorization: Authorization;
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
};

export type RootMutationTypeAddSandboxesToAlbumArgs = {
  albumId: Scalars['ID'];
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeAddToCollectionArgs = {
  collectionPath: Scalars['String'];
  privacy: InputMaybe<Scalars['Int']>;
  sandboxIds: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  teamId: InputMaybe<Scalars['UUID4']>;
};

export type RootMutationTypeAddToCollectionOrTeamArgs = {
  collectionPath: InputMaybe<Scalars['String']>;
  privacy: InputMaybe<Scalars['Int']>;
  sandboxIds: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  teamId: InputMaybe<Scalars['UUID4']>;
};

export type RootMutationTypeArchiveNotificationArgs = {
  notificationId: Scalars['UUID4'];
};

export type RootMutationTypeBookmarkTemplateArgs = {
  teamId: InputMaybe<Scalars['UUID4']>;
  templateId: Scalars['UUID4'];
};

export type RootMutationTypeChangeCollaboratorAuthorizationArgs = {
  authorization: Authorization;
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
};

export type RootMutationTypeChangeSandboxInvitationAuthorizationArgs = {
  authorization: Authorization;
  invitationId: Scalars['UUID4'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeChangeTeamMemberAuthorizationsArgs = {
  memberAuthorizations: InputMaybe<Array<MemberAuthorization>>;
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeConvertToUsageBillingArgs = {
  addons: Array<Scalars['String']>;
  billingInterval: InputMaybe<SubscriptionInterval>;
  plan: Scalars['String'];
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeCreateAlbumArgs = {
  description: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type RootMutationTypeCreateBranchArgs = {
  branch: InputMaybe<Scalars['String']>;
  from: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  owner: Scalars['String'];
  provider: GitProvider;
  team: Scalars['ID'];
};

export type RootMutationTypeCreateCodeCommentArgs = {
  anchorReference: CodeReference;
  codeReferences: InputMaybe<Array<CodeReference>>;
  content: Scalars['String'];
  id: InputMaybe<Scalars['ID']>;
  imageReferences: InputMaybe<Array<ImageReference>>;
  parentCommentId: InputMaybe<Scalars['ID']>;
  sandboxId: Scalars['ID'];
  userReferences: InputMaybe<Array<UserReference>>;
};

export type RootMutationTypeCreateCollectionArgs = {
  path: Scalars['String'];
  teamId: InputMaybe<Scalars['UUID4']>;
};

export type RootMutationTypeCreateCommentArgs = {
  codeReferences: InputMaybe<Array<CodeReference>>;
  content: Scalars['String'];
  id: InputMaybe<Scalars['ID']>;
  imageReferences: InputMaybe<Array<ImageReference>>;
  parentCommentId: InputMaybe<Scalars['ID']>;
  sandboxId: Scalars['ID'];
  userReferences: InputMaybe<Array<UserReference>>;
};

export type RootMutationTypeCreateContributionBranchArgs = {
  from: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  owner: Scalars['String'];
  provider: GitProvider;
};

export type RootMutationTypeCreateGithubPullRequestReviewArgs = {
  body: InputMaybe<Scalars['String']>;
  comments: InputMaybe<Array<GithubPullRequestReviewCommentInput>>;
  commitId: InputMaybe<Scalars['String']>;
  event: GitHubPullRequestReviewAction;
  name: Scalars['String'];
  owner: Scalars['String'];
  pullRequestNumber: Scalars['Int'];
};

export type RootMutationTypeCreateOrUpdatePrivateNpmRegistryArgs = {
  authType: InputMaybe<AuthType>;
  enabledScopes: Array<Scalars['String']>;
  limitToScopes: Scalars['Boolean'];
  proxyEnabled: Scalars['Boolean'];
  registryAuthKey: InputMaybe<Scalars['String']>;
  registryType: RegistryType;
  registryUrl: InputMaybe<Scalars['String']>;
  sandpackTrustedDomains: InputMaybe<Array<Scalars['String']>>;
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeCreatePreviewCommentArgs = {
  anchorReference: PreviewReference;
  codeReferences: InputMaybe<Array<CodeReference>>;
  content: Scalars['String'];
  id: InputMaybe<Scalars['ID']>;
  imageReferences: InputMaybe<Array<ImageReference>>;
  parentCommentId: InputMaybe<Scalars['ID']>;
  sandboxId: Scalars['ID'];
  userReferences: InputMaybe<Array<UserReference>>;
};

export type RootMutationTypeCreateSandboxInvitationArgs = {
  authorization: Authorization;
  email: Scalars['String'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeCreateTeamArgs = {
  name: Scalars['String'];
  pilot: InputMaybe<Scalars['Boolean']>;
};

export type RootMutationTypeDeleteAlbumArgs = {
  id: Scalars['ID'];
};

export type RootMutationTypeDeleteBranchArgs = {
  id: Scalars['String'];
};

export type RootMutationTypeDeleteCollectionArgs = {
  path: Scalars['String'];
  teamId: InputMaybe<Scalars['UUID4']>;
};

export type RootMutationTypeDeleteCommentArgs = {
  commentId: Scalars['UUID4'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeDeleteCurrentUserArgs = {
  confirm?: InputMaybe<Scalars['Boolean']>;
};

export type RootMutationTypeDeleteGithubPullRequestReviewCommentArgs = {
  commentId: Scalars['Int'];
  name: Scalars['String'];
  owner: Scalars['String'];
};

export type RootMutationTypeDeletePrivateNpmRegistryArgs = {
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeDeleteProjectArgs = {
  name: Scalars['String'];
  owner: Scalars['String'];
  provider: GitProvider;
  team: Scalars['ID'];
};

export type RootMutationTypeDeleteProjectByIdArgs = {
  id: Scalars['ID'];
};

export type RootMutationTypeDeleteSandboxesArgs = {
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeDeleteWorkspaceArgs = {
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeDismissGithubPullRequestReviewArgs = {
  message: Scalars['String'];
  name: Scalars['String'];
  owner: Scalars['String'];
  pullRequestNumber: Scalars['Int'];
  pullRequestReviewId: Scalars['Int'];
};

export type RootMutationTypeImportBranchArgs = {
  branch: Scalars['String'];
  name: Scalars['String'];
  owner: Scalars['String'];
  provider: GitProvider;
  team: Scalars['ID'];
};

export type RootMutationTypeImportProjectArgs = {
  name: Scalars['String'];
  owner: Scalars['String'];
  provider: GitProvider;
  team: Scalars['ID'];
};

export type RootMutationTypeImportReadOnlyBranchArgs = {
  branch: Scalars['String'];
  name: Scalars['String'];
  owner: Scalars['String'];
  provider: GitProvider;
};

export type RootMutationTypeImportReadOnlyProjectArgs = {
  name: Scalars['String'];
  owner: Scalars['String'];
  provider: GitProvider;
};

export type RootMutationTypeIncrementSandboxVersionArgs = {
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeInviteToTeamArgs = {
  authorization: InputMaybe<TeamMemberAuthorization>;
  teamId: Scalars['UUID4'];
  username: Scalars['String'];
};

export type RootMutationTypeInviteToTeamViaEmailArgs = {
  authorization: InputMaybe<TeamMemberAuthorization>;
  email: Scalars['String'];
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeJoinEligibleWorkspaceArgs = {
  workspaceId: Scalars['ID'];
};

export type RootMutationTypeJoinLiveSessionArgs = {
  id: Scalars['ID'];
};

export type RootMutationTypeJoinUsageBillingBetaArgs = {
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeLeaveTeamArgs = {
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeMakeSandboxesTemplatesArgs = {
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeMarkNotificationAsReadArgs = {
  notificationId: Scalars['UUID4'];
};

export type RootMutationTypeMergeGithubPullRequestArgs = {
  mergeMethod: InputMaybe<GitHubPullRequestMergeMethod>;
  name: Scalars['String'];
  owner: Scalars['String'];
  pullRequestNumber: Scalars['Int'];
};

export type RootMutationTypePermanentlyDeleteSandboxesArgs = {
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypePreviewConvertToUsageBillingArgs = {
  addons: Array<Scalars['String']>;
  billingInterval: InputMaybe<SubscriptionInterval>;
  plan: Scalars['String'];
  teamId: Scalars['UUID4'];
};

export type RootMutationTypePreviewUpdateSubscriptionBillingIntervalArgs = {
  billingInterval: SubscriptionInterval;
  subscriptionId: Scalars['UUID4'];
  teamId: Scalars['UUID4'];
};

export type RootMutationTypePreviewUpdateUsageSubscriptionPlanArgs = {
  billingInterval: InputMaybe<SubscriptionInterval>;
  plan: InputMaybe<Scalars['String']>;
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeReactivateSubscriptionArgs = {
  subscriptionId: Scalars['UUID4'];
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeRedeemSandboxInvitationArgs = {
  invitationToken: Scalars['String'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeRedeemTeamInviteTokenArgs = {
  inviteToken: Scalars['String'];
};

export type RootMutationTypeRejectTeamInvitationArgs = {
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeRemoveCollaboratorArgs = {
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
};

export type RootMutationTypeRemoveFromTeamArgs = {
  teamId: Scalars['UUID4'];
  userId: Scalars['UUID4'];
};

export type RootMutationTypeRemoveRequestedGithubPullRequestReviewersArgs = {
  name: Scalars['String'];
  owner: Scalars['String'];
  pullRequestNumber: Scalars['Int'];
  reviewers: Array<Scalars['String']>;
};

export type RootMutationTypeRemoveSandboxesFromAlbumArgs = {
  albumId: Scalars['ID'];
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeRenameCollectionArgs = {
  newPath: Scalars['String'];
  newTeamId: InputMaybe<Scalars['UUID4']>;
  path: Scalars['String'];
  teamId: InputMaybe<Scalars['UUID4']>;
};

export type RootMutationTypeRenameSandboxArgs = {
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type RootMutationTypeReplyToGithubPullRequestReviewArgs = {
  body: Scalars['String'];
  commentId: Scalars['Int'];
  name: Scalars['String'];
  owner: Scalars['String'];
  pullRequestNumber: Scalars['Int'];
};

export type RootMutationTypeRequestGithubPullRequestReviewersArgs = {
  name: Scalars['String'];
  owner: Scalars['String'];
  pullRequestNumber: Scalars['Int'];
  reviewers: Array<Scalars['String']>;
};

export type RootMutationTypeRequestTeamInvitationArgs = {
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeResolveCommentArgs = {
  commentId: Scalars['UUID4'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeRevokeSandboxInvitationArgs = {
  invitationId: Scalars['UUID4'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeRevokeTeamInvitationArgs = {
  teamId: Scalars['UUID4'];
  userId: Scalars['UUID4'];
};

export type RootMutationTypeSetBranchProtectionArgs = {
  branchId: Scalars['String'];
  protected: Scalars['Boolean'];
};

export type RootMutationTypeSetDefaultTeamMemberAuthorizationArgs = {
  defaultAuthorization: TeamMemberAuthorization;
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeSetLiveSessionDefaultPermissionArgs = {
  permission: LiveSessionPermission;
  vmId: Scalars['ID'];
};

export type RootMutationTypeSetLiveSessionGuestPermissionArgs = {
  permission: LiveSessionPermission;
  userId: Scalars['ID'];
  vmId: Scalars['ID'];
};

export type RootMutationTypeSetPreventSandboxesExportArgs = {
  preventSandboxExport: Scalars['Boolean'];
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeSetPreventSandboxesLeavingWorkspaceArgs = {
  preventSandboxLeaving: Scalars['Boolean'];
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeSetPrimaryWorkspaceArgs = {
  primaryWorkspaceId: Scalars['UUID4'];
};

export type RootMutationTypeSetSandboxesFrozenArgs = {
  isFrozen: Scalars['Boolean'];
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeSetSandboxesPrivacyArgs = {
  privacy: InputMaybe<Scalars['Int']>;
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeSetTeamAiConsentArgs = {
  privateRepositories: Scalars['Boolean'];
  privateSandboxes: Scalars['Boolean'];
  publicRepositories: Scalars['Boolean'];
  publicSandboxes: Scalars['Boolean'];
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeSetTeamDescriptionArgs = {
  description: Scalars['String'];
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeSetTeamLimitsArgs = {
  onDemandSpendingLimit: InputMaybe<Scalars['Int']>;
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeSetTeamMetadataArgs = {
  metadata: TeamMetadataInput;
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeSetTeamMinimumPrivacyArgs = {
  minimumPrivacy: Scalars['Int'];
  teamId: Scalars['UUID4'];
  updateDrafts: Scalars['Boolean'];
};

export type RootMutationTypeSetTeamNameArgs = {
  name: Scalars['String'];
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeSetWorkspaceSandboxSettingsArgs = {
  preventSandboxExport: Scalars['Boolean'];
  preventSandboxLeaving: Scalars['Boolean'];
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeSoftCancelSubscriptionArgs = {
  subscriptionId: Scalars['UUID4'];
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeStartLiveSessionArgs = {
  defaultPermission: LiveSessionPermission;
  vmId: Scalars['ID'];
};

export type RootMutationTypeStopLiveSessionArgs = {
  vmId: Scalars['ID'];
};

export type RootMutationTypeUnbookmarkTemplateArgs = {
  teamId: InputMaybe<Scalars['UUID4']>;
  templateId: Scalars['UUID4'];
};

export type RootMutationTypeUnmakeSandboxesTemplatesArgs = {
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeUnresolveCommentArgs = {
  commentId: Scalars['UUID4'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeUpdateAlbumArgs = {
  description: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  title: InputMaybe<Scalars['String']>;
};

export type RootMutationTypeUpdateCommentArgs = {
  codeReferences: InputMaybe<Array<CodeReference>>;
  commentId: Scalars['UUID4'];
  content: InputMaybe<Scalars['String']>;
  imageReferences: InputMaybe<Array<ImageReference>>;
  sandboxId: Scalars['ID'];
  userReferences: InputMaybe<Array<UserReference>>;
};

export type RootMutationTypeUpdateCurrentUserArgs = {
  bio: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
  socialLinks: InputMaybe<Array<Scalars['String']>>;
  username: Scalars['String'];
};

export type RootMutationTypeUpdateGithubPullRequestReviewArgs = {
  body: Scalars['String'];
  name: Scalars['String'];
  owner: Scalars['String'];
  pullRequestNumber: Scalars['Int'];
  pullRequestReviewId: Scalars['Int'];
};

export type RootMutationTypeUpdateGithubPullRequestReviewCommentArgs = {
  body: Scalars['String'];
  commentId: Scalars['Int'];
  name: Scalars['String'];
  owner: Scalars['String'];
};

export type RootMutationTypeUpdateNotificationPreferencesArgs = {
  emailCommentMention: InputMaybe<Scalars['Boolean']>;
  emailCommentReply: InputMaybe<Scalars['Boolean']>;
  emailMarketing: InputMaybe<Scalars['Boolean']>;
  emailNewComment: InputMaybe<Scalars['Boolean']>;
  emailSandboxInvite: InputMaybe<Scalars['Boolean']>;
  emailTeamInvite: InputMaybe<Scalars['Boolean']>;
  emailTeamRequest: InputMaybe<Scalars['Boolean']>;
  inAppPrReviewReceived: InputMaybe<Scalars['Boolean']>;
  inAppPrReviewRequest: InputMaybe<Scalars['Boolean']>;
};

export type RootMutationTypeUpdateNotificationReadStatusArgs = {
  notificationId: Scalars['UUID4'];
  read: Scalars['Boolean'];
};

export type RootMutationTypeUpdateProjectSettingsArgs = {
  aiConsent: InputMaybe<Scalars['Boolean']>;
  projectId: Scalars['UUID4'];
};

export type RootMutationTypeUpdateProjectVmTierArgs = {
  branchId: InputMaybe<Scalars['String']>;
  projectId: Scalars['UUID4'];
  vmTier: Scalars['Int'];
};

export type RootMutationTypeUpdateSandboxSettingsArgs = {
  aiConsent: InputMaybe<Scalars['Boolean']>;
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeUpdateSubscriptionArgs = {
  quantity: InputMaybe<Scalars['Int']>;
  subscriptionId: Scalars['UUID4'];
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeUpdateSubscriptionBillingIntervalArgs = {
  billingInterval: SubscriptionInterval;
  subscriptionId: Scalars['UUID4'];
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeUpdateUsageSubscriptionArgs = {
  addons: Array<Scalars['String']>;
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeUpdateUsageSubscriptionPlanArgs = {
  billingInterval: InputMaybe<SubscriptionInterval>;
  plan: InputMaybe<Scalars['String']>;
  teamId: Scalars['UUID4'];
};

export type MemberAuthorization = {
  authorization: TeamMemberAuthorization;
  teamManager: InputMaybe<Scalars['Boolean']>;
  userId: Scalars['UUID4'];
};

export type CodeReference = {
  anchor: Scalars['Int'];
  code: Scalars['String'];
  head: Scalars['Int'];
  lastUpdatedAt: Scalars['String'];
  path: Scalars['String'];
};

export type ImageReference = {
  fileName: Scalars['String'];
  resolution: Array<Scalars['Int']>;
  src: InputMaybe<Scalars['Base64']>;
  url: InputMaybe<Scalars['String']>;
};

export type UserReference = {
  userId: Scalars['String'];
  username: Scalars['String'];
};

export type GithubPullRequestReviewCommentInput = {
  /** Body text of the review comment */
  body: Scalars['String'];
  /** Line number of the file to comment on. Note: This line must be part of the diff */
  line: Scalars['Int'];
  /** Relative path to the file being commented on */
  path: Scalars['String'];
  /** Which side of the diff to comment on. */
  side: GitHubPullRequestReviewCommentSide;
  /** Start line of multi-line comment. Only needed for multi-line comments. */
  startLine: InputMaybe<Scalars['Int']>;
  /** Start side of multi-line comment. Only needed for multi-line comments. */
  startSide: InputMaybe<GitHubPullRequestReviewCommentSide>;
};

/** The action to take with a pull request review */
export enum GitHubPullRequestReviewAction {
  Approve = 'APPROVE',
  Comment = 'COMMENT',
  RequestChanges = 'REQUEST_CHANGES',
}

export type PreviewReference = {
  height: Scalars['Int'];
  previewPath: Scalars['String'];
  screenshotSrc: InputMaybe<Scalars['Base64']>;
  userAgent: Scalars['String'];
  width: Scalars['Int'];
  x: Scalars['Int'];
  y: Scalars['Int'];
};

/** Ways to merge a pull request */
export enum GitHubPullRequestMergeMethod {
  Merge = 'MERGE',
  Rebase = 'REBASE',
  Squash = 'SQUASH',
}

export type InvoicePreview = {
  __typename?: 'InvoicePreview';
  total: Scalars['Int'];
  totalExcludingTax: Maybe<Scalars['Int']>;
  updateMoment: Maybe<SubscriptionUpdateMoment>;
};

export enum SubscriptionUpdateMoment {
  Immediately = 'IMMEDIATELY',
  NextBillDate = 'NEXT_BILL_DATE',
}

/** DEPRECATED: Conversion to usage-based billing uses InvoicePreview instead */
export type BillingPreview = {
  __typename?: 'BillingPreview';
  immediatePayment: Maybe<BillingDetails>;
  nextPayment: Maybe<BillingDetails>;
};

export type BillingDetails = {
  __typename?: 'BillingDetails';
  amount: Scalars['Int'];
  currency: Scalars['String'];
  date: Scalars['String'];
};

/** Additional user-provided metadata about a workspace */
export type TeamMetadataInput = {
  /** Use-cases for the workspace */
  useCases: Array<Scalars['String']>;
};

export type RootSubscriptionType = {
  __typename?: 'RootSubscriptionType';
  /** Receive updates for events related to the specified branch. */
  branchEvents: BranchEvent;
  collaboratorAdded: Collaborator;
  collaboratorChanged: Collaborator;
  collaboratorRemoved: Collaborator;
  commentAdded: Comment;
  commentChanged: Comment;
  commentRemoved: Comment;
  /**
   * Receive updates when the GitHub App sends events via webhook.
   *
   * Note that this subscription will only work for repositories with the GitHub App installed,
   * except for the App installation event itself.
   */
  githubEvents: RepositoryEvent;
  invitationChanged: Invitation;
  invitationCreated: Invitation;
  invitationRemoved: Invitation;
  /**
   * Subscription for changes to the state of a live session
   *
   * Clients may subscribe to this channel in order to be notified when live sessions begin (if
   * they are editors of the underlying content), end, or when permissions are updated.
   */
  liveSessionEvents: LiveSessionEvent;
  /**
   * Receive updates if a new commit is made via the CodeSandbox UI
   *
   * Omit `branchId` to receive updates from all branches in the project.
   */
  projectCommits: BranchLastCommit;
  /**
   * Receive updates if users connect to or disconnect from a branch
   *
   * Omit `branchId` to receive updates from all branches in the project.
   */
  projectConnections: BranchConnections;
  /** Receive updates for events related to the specified repository */
  projectEvents: ProjectEvent;
  /**
   * Receive updates when the status of a branch changes
   *
   * Omit `branchId` to receive updates from all branches in the project.
   */
  projectStatus: BranchStatus;
  sandboxChanged: Sandbox;
  /**
   * Receive updates for events related to one or all of the user's teams
   *
   * Supply a `teamId` to subscribe to one team, or leave the argument `null` to receive events
   * for all of the user's teams.
   */
  teamEvents: TeamEvent;
};

export type RootSubscriptionTypeBranchEventsArgs = {
  branchName: Scalars['String'];
  owner: Scalars['String'];
  repo: Scalars['String'];
};

export type RootSubscriptionTypeCollaboratorAddedArgs = {
  sandboxId: Scalars['ID'];
};

export type RootSubscriptionTypeCollaboratorChangedArgs = {
  sandboxId: Scalars['ID'];
};

export type RootSubscriptionTypeCollaboratorRemovedArgs = {
  sandboxId: Scalars['ID'];
};

export type RootSubscriptionTypeCommentAddedArgs = {
  sandboxId: Scalars['ID'];
};

export type RootSubscriptionTypeCommentChangedArgs = {
  sandboxId: Scalars['ID'];
};

export type RootSubscriptionTypeCommentRemovedArgs = {
  sandboxId: Scalars['ID'];
};

export type RootSubscriptionTypeGithubEventsArgs = {
  owner: Scalars['String'];
  repo: Scalars['String'];
};

export type RootSubscriptionTypeInvitationChangedArgs = {
  sandboxId: Scalars['ID'];
};

export type RootSubscriptionTypeInvitationCreatedArgs = {
  sandboxId: Scalars['ID'];
};

export type RootSubscriptionTypeInvitationRemovedArgs = {
  sandboxId: Scalars['ID'];
};

export type RootSubscriptionTypeLiveSessionEventsArgs = {
  vmId: Scalars['ID'];
};

export type RootSubscriptionTypeProjectCommitsArgs = {
  branchId: InputMaybe<Scalars['String']>;
  owner: Scalars['String'];
  repo: Scalars['String'];
};

export type RootSubscriptionTypeProjectConnectionsArgs = {
  branchId: InputMaybe<Scalars['String']>;
  owner: Scalars['String'];
  repo: Scalars['String'];
};

export type RootSubscriptionTypeProjectEventsArgs = {
  owner: Scalars['String'];
  repo: Scalars['String'];
};

export type RootSubscriptionTypeProjectStatusArgs = {
  branchId: InputMaybe<Scalars['String']>;
  owner: Scalars['String'];
  repo: Scalars['String'];
};

export type RootSubscriptionTypeSandboxChangedArgs = {
  sandboxId: Scalars['ID'];
};

export type RootSubscriptionTypeTeamEventsArgs = {
  teamId: InputMaybe<Scalars['ID']>;
};

/** Events related to a specific branch. */
export type BranchEvent =
  | PullRequestCommentEvent
  | PullRequestEvent
  | PullRequestReviewCommentEvent
  | PullRequestReviewEvent;

/**
 * Event about a comment on a pull request (outside the context of a review)
 *
 * GitHub does not distinguish between PR and issue comments, so the event will be "issue_comment"
 * for both types. The API will attempt to distinguish between them using additional information
 * from the event.
 */
export type PullRequestCommentEvent = {
  __typename?: 'PullRequestCommentEvent';
  action: PullRequestCommentEventAction;
  comment: GitHubPullRequestComment;
  event: Scalars['String'];
  /**
   * Pull request on which the comment appears
   *
   * This field is nullable due to an edge case that may cause comments to be saved without the
   * parent PR. Clients can observe the comment's `issueId` field to see if the pull request is
   * already known based on its ID.
   */
  pullRequest: Maybe<PullRequest>;
};

export enum PullRequestCommentEventAction {
  Created = 'CREATED',
  Deleted = 'DELETED',
  Edited = 'EDITED',
}

/** Event about activity on a pull request */
export type PullRequestEvent = {
  __typename?: 'PullRequestEvent';
  action: PullRequestEventAction;
  event: Scalars['String'];
  pullRequest: PullRequest;
};

export enum PullRequestEventAction {
  Closed = 'CLOSED',
  ConvertedToDraft = 'CONVERTED_TO_DRAFT',
  Opened = 'OPENED',
  ReadyForReview = 'READY_FOR_REVIEW',
  ReviewRequestRemoved = 'REVIEW_REQUEST_REMOVED',
  ReviewRequested = 'REVIEW_REQUESTED',
}

/** Event about a comment on a pull request review */
export type PullRequestReviewCommentEvent = {
  __typename?: 'PullRequestReviewCommentEvent';
  action: PullRequestReviewCommentEventAction;
  comment: GitHubPullRequestReviewComment;
  event: Scalars['String'];
  pullRequest: PullRequest;
};

export enum PullRequestReviewCommentEventAction {
  Created = 'CREATED',
  Deleted = 'DELETED',
  Edited = 'EDITED',
}

/** Event about review activity on a pull request */
export type PullRequestReviewEvent = {
  __typename?: 'PullRequestReviewEvent';
  action: PullRequestReviewEventAction;
  event: Scalars['String'];
  pullRequest: PullRequest;
  review: PullRequestReview;
};

export enum PullRequestReviewEventAction {
  Dismissed = 'DISMISSED',
  Edited = 'EDITED',
  Submitted = 'SUBMITTED',
}

/** GitHub webhook event about a repository. */
export type RepositoryEvent = InstallationEvent;

/** GitHub webhook event about the status of a GitHub App installation. */
export type InstallationEvent = {
  __typename?: 'InstallationEvent';
  action: InstallationEventAction;
  event: Scalars['String'];
};

export enum InstallationEventAction {
  Created = 'CREATED',
}

/** Change to a live session emitted by the `liveSessionEvents` subscription */
export type LiveSessionEvent = {
  __typename?: 'LiveSessionEvent';
  /** Action that emitted the event */
  event: LiveSessionEventAction;
  /** Current state of the live session */
  session: LiveSession;
};

/** Actions that may emit a live session event */
export enum LiveSessionEventAction {
  Joined = 'JOINED',
  SetDefaultPermission = 'SET_DEFAULT_PERMISSION',
  SetGuestPermission = 'SET_GUEST_PERMISSION',
  Started = 'STARTED',
  Stopped = 'STOPPED',
}

/** Subscription update about a commit made by CodeSandbox for a branch */
export type BranchLastCommit = {
  __typename?: 'BranchLastCommit';
  branchId: Scalars['String'];
  lastCommit: LastCommit;
};

/** Subscription update about active users connected to a branch */
export type BranchConnections = {
  __typename?: 'BranchConnections';
  branchId: Scalars['String'];
  connections: Array<Connection>;
};

/** Events related to a project (repository). */
export type ProjectEvent =
  | PullRequestCommentEvent
  | PullRequestEvent
  | PullRequestReviewCommentEvent
  | PullRequestReviewEvent;

/** Subscription update about the underlying git status of a branch */
export type BranchStatus = {
  __typename?: 'BranchStatus';
  branchId: Scalars['String'];
  status: Status;
};

/** Events related to a team */
export type TeamEvent = TeamSubscriptionEvent;

/** Change to a team's subscription status */
export type TeamSubscriptionEvent = {
  __typename?: 'TeamSubscriptionEvent';
  event: Scalars['String'];
  subscription: ProSubscription;
  teamId: Scalars['ID'];
};

export type TemplateFragment = {
  __typename?: 'Template';
  id: any | null;
  color: string | null;
  iconUrl: string | null;
  published: boolean | null;
  sandbox: {
    __typename?: 'Sandbox';
    id: string;
    alias: string | null;
    title: string | null;
    description: string | null;
    insertedAt: string;
    updatedAt: string;
    isV2: boolean;
    forkCount: number;
    viewCount: number;
    team: { __typename?: 'TeamPreview'; name: string } | null;
    author: { __typename?: 'User'; username: string } | null;
    source: { __typename?: 'Source'; template: string | null };
  } | null;
};

export type RecentAndWorkspaceTemplatesQueryVariables = Exact<{
  teamId: InputMaybe<Scalars['UUID4']>;
}>;

export type RecentAndWorkspaceTemplatesQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    recentlyUsedTemplates: Array<{
      __typename?: 'Template';
      id: any | null;
      color: string | null;
      iconUrl: string | null;
      published: boolean | null;
      sandbox: {
        __typename?: 'Sandbox';
        id: string;
        alias: string | null;
        title: string | null;
        description: string | null;
        insertedAt: string;
        updatedAt: string;
        isV2: boolean;
        forkCount: number;
        viewCount: number;
        team: { __typename?: 'TeamPreview'; name: string } | null;
        author: { __typename?: 'User'; username: string } | null;
        source: { __typename?: 'Source'; template: string | null };
      } | null;
    }>;
    team: {
      __typename?: 'Team';
      templates: Array<{
        __typename?: 'Template';
        id: any | null;
        color: string | null;
        iconUrl: string | null;
        published: boolean | null;
        sandbox: {
          __typename?: 'Sandbox';
          id: string;
          alias: string | null;
          title: string | null;
          description: string | null;
          insertedAt: string;
          updatedAt: string;
          isV2: boolean;
          forkCount: number;
          viewCount: number;
          team: { __typename?: 'TeamPreview'; name: string } | null;
          author: { __typename?: 'User'; username: string } | null;
          source: { __typename?: 'Source'; template: string | null };
        } | null;
      }>;
    } | null;
  } | null;
};

export type GetGithubRepoQueryVariables = Exact<{
  owner: Scalars['String'];
  name: Scalars['String'];
}>;

export type GetGithubRepoQuery = {
  __typename?: 'RootQueryType';
  githubRepo: {
    __typename?: 'GithubRepo';
    name: string;
    fullName: string;
    updatedAt: string;
    pushedAt: string | null;
    authorization: GithubRepoAuthorization;
    private: boolean;
    appInstalled: boolean;
    owner: {
      __typename?: 'GithubOrganization';
      id: string;
      login: string;
      avatarUrl: string;
    };
  } | null;
};

export type ProfileFragment = {
  __typename?: 'GithubProfile';
  id: string;
  login: string;
};

export type OrganizationFragment = {
  __typename?: 'GithubOrganization';
  id: string;
  login: string;
};

export type GetGithubAccountsQueryVariables = Exact<{ [key: string]: never }>;

export type GetGithubAccountsQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    githubProfile: {
      __typename?: 'GithubProfile';
      id: string;
      login: string;
    } | null;
    githubOrganizations: Array<{
      __typename?: 'GithubOrganization';
      id: string;
      login: string;
    }> | null;
  } | null;
};

export type RepositoryTeamsQueryVariables = Exact<{
  owner: Scalars['String'];
  name: Scalars['String'];
}>;

export type RepositoryTeamsQuery = {
  __typename?: 'RootQueryType';
  projects: Array<{
    __typename?: 'Project';
    team: { __typename?: 'Team'; id: any; name: string } | null;
  }>;
};

export type SandboxFragmentDashboardFragment = {
  __typename?: 'Sandbox';
  id: string;
  alias: string | null;
  title: string | null;
  description: string | null;
  lastAccessedAt: any;
  insertedAt: string;
  updatedAt: string;
  removedAt: string | null;
  privacy: number;
  isFrozen: boolean;
  screenshotUrl: string | null;
  screenshotOutdated: boolean;
  viewCount: number;
  likeCount: number;
  isV2: boolean;
  draft: boolean;
  restricted: boolean;
  authorId: any | null;
  teamId: any | null;
  source: { __typename?: 'Source'; template: string | null };
  customTemplate: {
    __typename?: 'Template';
    id: any | null;
    iconUrl: string | null;
  } | null;
  forkedTemplate: {
    __typename?: 'Template';
    id: any | null;
    color: string | null;
    iconUrl: string | null;
  } | null;
  collection: {
    __typename?: 'Collection';
    path: string;
    id: any | null;
  } | null;
  author: { __typename?: 'User'; username: string } | null;
  permissions: {
    __typename?: 'SandboxProtectionSettings';
    preventSandboxLeaving: boolean;
    preventSandboxExport: boolean;
  } | null;
};

export type RepoFragmentDashboardFragment = {
  __typename?: 'Sandbox';
  prNumber: number | null;
  id: string;
  alias: string | null;
  title: string | null;
  description: string | null;
  lastAccessedAt: any;
  insertedAt: string;
  updatedAt: string;
  removedAt: string | null;
  privacy: number;
  isFrozen: boolean;
  screenshotUrl: string | null;
  screenshotOutdated: boolean;
  viewCount: number;
  likeCount: number;
  isV2: boolean;
  draft: boolean;
  restricted: boolean;
  authorId: any | null;
  teamId: any | null;
  baseGit: {
    __typename?: 'Git';
    branch: string | null;
    id: any | null;
    repo: string | null;
    username: string | null;
    path: string | null;
  } | null;
  originalGit: {
    __typename?: 'Git';
    branch: string | null;
    id: any | null;
    repo: string | null;
    username: string | null;
    path: string | null;
  } | null;
  source: { __typename?: 'Source'; template: string | null };
  customTemplate: {
    __typename?: 'Template';
    id: any | null;
    iconUrl: string | null;
  } | null;
  forkedTemplate: {
    __typename?: 'Template';
    id: any | null;
    color: string | null;
    iconUrl: string | null;
  } | null;
  collection: {
    __typename?: 'Collection';
    path: string;
    id: any | null;
  } | null;
  author: { __typename?: 'User'; username: string } | null;
  permissions: {
    __typename?: 'SandboxProtectionSettings';
    preventSandboxLeaving: boolean;
    preventSandboxExport: boolean;
  } | null;
};

export type SidebarCollectionDashboardFragment = {
  __typename?: 'Collection';
  id: any | null;
  path: string;
  sandboxCount: number;
};

export type TemplateFragmentDashboardFragment = {
  __typename?: 'Template';
  id: any | null;
  color: string | null;
  iconUrl: string | null;
  published: boolean | null;
  sandbox: {
    __typename?: 'Sandbox';
    id: string;
    alias: string | null;
    title: string | null;
    description: string | null;
    lastAccessedAt: any;
    insertedAt: string;
    updatedAt: string;
    removedAt: string | null;
    privacy: number;
    isFrozen: boolean;
    screenshotUrl: string | null;
    screenshotOutdated: boolean;
    viewCount: number;
    likeCount: number;
    isV2: boolean;
    draft: boolean;
    restricted: boolean;
    authorId: any | null;
    teamId: any | null;
    git: {
      __typename?: 'Git';
      id: any | null;
      username: string | null;
      commitSha: string | null;
      path: string | null;
      repo: string | null;
      branch: string | null;
    } | null;
    team: { __typename?: 'TeamPreview'; name: string } | null;
    author: { __typename?: 'User'; username: string } | null;
    source: { __typename?: 'Source'; template: string | null };
    customTemplate: {
      __typename?: 'Template';
      id: any | null;
      iconUrl: string | null;
    } | null;
    forkedTemplate: {
      __typename?: 'Template';
      id: any | null;
      color: string | null;
      iconUrl: string | null;
    } | null;
    collection: {
      __typename?: 'Collection';
      path: string;
      id: any | null;
    } | null;
    permissions: {
      __typename?: 'SandboxProtectionSettings';
      preventSandboxLeaving: boolean;
      preventSandboxExport: boolean;
    } | null;
  } | null;
};

export type TeamFragmentDashboardFragment = {
  __typename?: 'Team';
  id: any;
  name: string;
  description: string | null;
  creatorId: any | null;
  avatarUrl: string | null;
  frozen: boolean;
  insertedAt: string;
  settings: {
    __typename?: 'WorkspaceSandboxSettings';
    minimumPrivacy: number;
  } | null;
  userAuthorizations: Array<{
    __typename?: 'UserAuthorization';
    userId: any;
    authorization: TeamMemberAuthorization;
    teamManager: boolean;
  }>;
  users: Array<{
    __typename?: 'User';
    id: any;
    name: string | null;
    username: string;
    avatarUrl: string;
  }>;
  invitees: Array<{
    __typename?: 'User';
    id: any;
    name: string | null;
    username: string;
    avatarUrl: string;
  }>;
  subscription: {
    __typename?: 'ProSubscription';
    origin: SubscriptionOrigin | null;
    type: SubscriptionType;
    status: SubscriptionStatus;
    paymentProvider: SubscriptionPaymentProvider | null;
  } | null;
  featureFlags: {
    __typename?: 'TeamFeatureFlags';
    ubbBeta: boolean;
    friendOfCsb: boolean;
  };
  limits: {
    __typename?: 'TeamLimits';
    includedPublicSandboxes: number;
    includedPrivateSandboxes: number;
  };
  usage: {
    __typename?: 'TeamUsage';
    publicSandboxesQuantity: number;
    privateSandboxesQuantity: number;
  };
};

export type CurrentTeamInfoFragmentFragment = {
  __typename?: 'Team';
  id: any;
  creatorId: any | null;
  description: string | null;
  inviteToken: string;
  name: string;
  type: TeamType;
  avatarUrl: string | null;
  legacy: boolean;
  frozen: boolean;
  insertedAt: string;
  users: Array<{
    __typename?: 'User';
    id: any;
    avatarUrl: string;
    username: string;
  }>;
  invitees: Array<{
    __typename?: 'User';
    id: any;
    avatarUrl: string;
    username: string;
  }>;
  userAuthorizations: Array<{
    __typename?: 'UserAuthorization';
    userId: any;
    authorization: TeamMemberAuthorization;
    teamManager: boolean;
    drafts: number;
  }>;
  settings: {
    __typename?: 'WorkspaceSandboxSettings';
    minimumPrivacy: number;
    preventSandboxExport: boolean;
    preventSandboxLeaving: boolean;
    defaultAuthorization: TeamMemberAuthorization;
    aiConsent: {
      __typename?: 'TeamAiConsent';
      privateRepositories: boolean;
      privateSandboxes: boolean;
      publicRepositories: boolean;
      publicSandboxes: boolean;
    };
  } | null;
  subscription: {
    __typename?: 'ProSubscription';
    billingInterval: SubscriptionInterval | null;
    cancelAt: any | null;
    cancelAtPeriodEnd: boolean;
    currency: string | null;
    id: any | null;
    nextBillDate: any | null;
    origin: SubscriptionOrigin | null;
    paymentMethodAttached: boolean;
    paymentProvider: SubscriptionPaymentProvider | null;
    quantity: number | null;
    status: SubscriptionStatus;
    trialEnd: any | null;
    trialStart: any | null;
    type: SubscriptionType;
    unitPrice: number | null;
    updateBillingUrl: string | null;
  } | null;
  subscriptionSchedule: {
    __typename?: 'SubscriptionSchedule';
    billingInterval: SubscriptionInterval | null;
    current: {
      __typename?: 'SubscriptionSchedulePhase';
      startDate: string | null;
      endDate: string | null;
      items: Array<{
        __typename?: 'SubscriptionItem';
        name: string;
        quantity: number | null;
        unitAmount: number | null;
        unitAmountDecimal: string | null;
      }>;
    } | null;
    upcoming: {
      __typename?: 'SubscriptionSchedulePhase';
      startDate: string | null;
      endDate: string | null;
      items: Array<{
        __typename?: 'SubscriptionItem';
        name: string;
        quantity: number | null;
        unitAmount: number | null;
        unitAmountDecimal: string | null;
      }>;
    } | null;
  } | null;
  limits: {
    __typename?: 'TeamLimits';
    includedCredits: number;
    includedVmTier: number;
    onDemandCreditLimit: number | null;
    includedPublicSandboxes: number;
    includedPrivateSandboxes: number;
  };
  usage: {
    __typename?: 'TeamUsage';
    sandboxes: number;
    credits: number;
    publicSandboxesQuantity: number;
    privateSandboxesQuantity: number;
  };
  featureFlags: {
    __typename?: 'TeamFeatureFlags';
    ubbBeta: boolean;
    friendOfCsb: boolean;
  };
  metadata: { __typename?: 'TeamMetadata'; useCases: Array<string> };
};

export type BranchFragment = {
  __typename?: 'Branch';
  id: string;
  name: string;
  contribution: boolean;
  lastAccessedAt: string | null;
  upstream: boolean;
  owner: { __typename?: 'User'; username: string } | null;
  project: {
    __typename?: 'Project';
    repository: {
      __typename?: 'GitHubRepository';
      defaultBranch: string;
      name: string;
      owner: string;
      private: boolean;
    };
    team: { __typename?: 'Team'; id: any } | null;
  };
};

export type BranchWithPrFragment = {
  __typename?: 'Branch';
  id: string;
  name: string;
  contribution: boolean;
  lastAccessedAt: string | null;
  upstream: boolean;
  owner: { __typename?: 'User'; username: string } | null;
  project: {
    __typename?: 'Project';
    repository: {
      __typename?: 'GitHubRepository';
      defaultBranch: string;
      name: string;
      owner: string;
      private: boolean;
    };
    team: { __typename?: 'Team'; id: any } | null;
  };
  pullRequests: Array<{
    __typename?: 'PullRequest';
    title: string;
    number: number;
    additions: number | null;
    deletions: number | null;
  }>;
};

export type ProjectFragment = {
  __typename?: 'Project';
  appInstalled: boolean;
  branchCount: number;
  lastAccessedAt: string | null;
  repository: {
    __typename?: 'GitHubRepository';
    owner: string;
    name: string;
    defaultBranch: string;
    private: boolean;
  };
  team: { __typename?: 'Team'; id: any } | null;
};

export type ProjectWithBranchesFragment = {
  __typename?: 'Project';
  appInstalled: boolean;
  branches: Array<{
    __typename?: 'Branch';
    id: string;
    name: string;
    contribution: boolean;
    lastAccessedAt: string | null;
    upstream: boolean;
    owner: { __typename?: 'User'; username: string } | null;
    project: {
      __typename?: 'Project';
      repository: {
        __typename?: 'GitHubRepository';
        defaultBranch: string;
        name: string;
        owner: string;
        private: boolean;
      };
      team: { __typename?: 'Team'; id: any } | null;
    };
    pullRequests: Array<{
      __typename?: 'PullRequest';
      title: string;
      number: number;
      additions: number | null;
      deletions: number | null;
    }>;
  }>;
  repository: {
    __typename?: 'GitHubRepository';
    owner: string;
    name: string;
    defaultBranch: string;
    private: boolean;
  };
  team: { __typename?: 'Team'; id: any } | null;
};

export type GithubRepoFragment = {
  __typename?: 'GithubRepo';
  id: string;
  authorization: GithubRepoAuthorization;
  fullName: string;
  name: string;
  private: boolean;
  updatedAt: string;
  pushedAt: string | null;
  owner: {
    __typename?: 'GithubOrganization';
    id: string;
    login: string;
    avatarUrl: string;
  };
};

export type _CreateTeamMutationVariables = Exact<{
  name: Scalars['String'];
}>;

export type _CreateTeamMutation = {
  __typename?: 'RootMutationType';
  createTeam: {
    __typename?: 'Team';
    id: any;
    name: string;
    description: string | null;
    creatorId: any | null;
    avatarUrl: string | null;
    frozen: boolean;
    insertedAt: string;
    settings: {
      __typename?: 'WorkspaceSandboxSettings';
      minimumPrivacy: number;
    } | null;
    userAuthorizations: Array<{
      __typename?: 'UserAuthorization';
      userId: any;
      authorization: TeamMemberAuthorization;
      teamManager: boolean;
    }>;
    users: Array<{
      __typename?: 'User';
      id: any;
      name: string | null;
      username: string;
      avatarUrl: string;
    }>;
    invitees: Array<{
      __typename?: 'User';
      id: any;
      name: string | null;
      username: string;
      avatarUrl: string;
    }>;
    subscription: {
      __typename?: 'ProSubscription';
      origin: SubscriptionOrigin | null;
      type: SubscriptionType;
      status: SubscriptionStatus;
      paymentProvider: SubscriptionPaymentProvider | null;
    } | null;
    featureFlags: {
      __typename?: 'TeamFeatureFlags';
      ubbBeta: boolean;
      friendOfCsb: boolean;
    };
    limits: {
      __typename?: 'TeamLimits';
      includedPublicSandboxes: number;
      includedPrivateSandboxes: number;
    };
    usage: {
      __typename?: 'TeamUsage';
      publicSandboxesQuantity: number;
      privateSandboxesQuantity: number;
    };
  };
};

export type CreateFolderMutationVariables = Exact<{
  path: Scalars['String'];
  teamId: InputMaybe<Scalars['UUID4']>;
}>;

export type CreateFolderMutation = {
  __typename?: 'RootMutationType';
  createCollection: {
    __typename?: 'Collection';
    id: any | null;
    path: string;
    sandboxCount: number;
  };
};

export type DeleteFolderMutationVariables = Exact<{
  path: Scalars['String'];
  teamId: InputMaybe<Scalars['UUID4']>;
}>;

export type DeleteFolderMutation = {
  __typename?: 'RootMutationType';
  deleteCollection: Array<{
    __typename?: 'Collection';
    id: any | null;
    path: string;
    sandboxCount: number;
  }>;
};

export type RenameFolderMutationVariables = Exact<{
  path: Scalars['String'];
  newPath: Scalars['String'];
  teamId: InputMaybe<Scalars['UUID4']>;
  newTeamId: InputMaybe<Scalars['UUID4']>;
}>;

export type RenameFolderMutation = {
  __typename?: 'RootMutationType';
  renameCollection: Array<{
    __typename?: 'Collection';
    id: any | null;
    path: string;
    sandboxCount: number;
  }>;
};

export type AddToFolderMutationVariables = Exact<{
  collectionPath: InputMaybe<Scalars['String']>;
  sandboxIds: Array<Scalars['ID']> | Scalars['ID'];
  teamId: InputMaybe<Scalars['UUID4']>;
  privacy: InputMaybe<Scalars['Int']>;
}>;

export type AddToFolderMutation = {
  __typename?: 'RootMutationType';
  addToCollectionOrTeam: Array<{
    __typename?: 'Sandbox';
    id: string;
    alias: string | null;
    title: string | null;
    description: string | null;
    lastAccessedAt: any;
    insertedAt: string;
    updatedAt: string;
    removedAt: string | null;
    privacy: number;
    isFrozen: boolean;
    screenshotUrl: string | null;
    screenshotOutdated: boolean;
    viewCount: number;
    likeCount: number;
    isV2: boolean;
    draft: boolean;
    restricted: boolean;
    authorId: any | null;
    teamId: any | null;
    source: { __typename?: 'Source'; template: string | null };
    customTemplate: {
      __typename?: 'Template';
      id: any | null;
      iconUrl: string | null;
    } | null;
    forkedTemplate: {
      __typename?: 'Template';
      id: any | null;
      color: string | null;
      iconUrl: string | null;
    } | null;
    collection: {
      __typename?: 'Collection';
      path: string;
      id: any | null;
    } | null;
    author: { __typename?: 'User'; username: string } | null;
    permissions: {
      __typename?: 'SandboxProtectionSettings';
      preventSandboxLeaving: boolean;
      preventSandboxExport: boolean;
    } | null;
  } | null>;
};

export type MoveToTrashMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type MoveToTrashMutation = {
  __typename?: 'RootMutationType';
  deleteSandboxes: Array<{
    __typename?: 'Sandbox';
    id: string;
    alias: string | null;
    title: string | null;
    description: string | null;
    lastAccessedAt: any;
    insertedAt: string;
    updatedAt: string;
    removedAt: string | null;
    privacy: number;
    isFrozen: boolean;
    screenshotUrl: string | null;
    screenshotOutdated: boolean;
    viewCount: number;
    likeCount: number;
    isV2: boolean;
    draft: boolean;
    restricted: boolean;
    authorId: any | null;
    teamId: any | null;
    source: { __typename?: 'Source'; template: string | null };
    customTemplate: {
      __typename?: 'Template';
      id: any | null;
      iconUrl: string | null;
    } | null;
    forkedTemplate: {
      __typename?: 'Template';
      id: any | null;
      color: string | null;
      iconUrl: string | null;
    } | null;
    collection: {
      __typename?: 'Collection';
      path: string;
      id: any | null;
    } | null;
    author: { __typename?: 'User'; username: string } | null;
    permissions: {
      __typename?: 'SandboxProtectionSettings';
      preventSandboxLeaving: boolean;
      preventSandboxExport: boolean;
    } | null;
  }>;
};

export type ChangePrivacyMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']> | Scalars['ID'];
  privacy: Scalars['Int'];
}>;

export type ChangePrivacyMutation = {
  __typename?: 'RootMutationType';
  setSandboxesPrivacy: Array<{
    __typename?: 'Sandbox';
    id: string;
    alias: string | null;
    title: string | null;
    description: string | null;
    lastAccessedAt: any;
    insertedAt: string;
    updatedAt: string;
    removedAt: string | null;
    privacy: number;
    isFrozen: boolean;
    screenshotUrl: string | null;
    screenshotOutdated: boolean;
    viewCount: number;
    likeCount: number;
    isV2: boolean;
    draft: boolean;
    restricted: boolean;
    authorId: any | null;
    teamId: any | null;
    source: { __typename?: 'Source'; template: string | null };
    customTemplate: {
      __typename?: 'Template';
      id: any | null;
      iconUrl: string | null;
    } | null;
    forkedTemplate: {
      __typename?: 'Template';
      id: any | null;
      color: string | null;
      iconUrl: string | null;
    } | null;
    collection: {
      __typename?: 'Collection';
      path: string;
      id: any | null;
    } | null;
    author: { __typename?: 'User'; username: string } | null;
    permissions: {
      __typename?: 'SandboxProtectionSettings';
      preventSandboxLeaving: boolean;
      preventSandboxExport: boolean;
    } | null;
  }>;
};

export type ChangeFrozenMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']> | Scalars['ID'];
  isFrozen: Scalars['Boolean'];
}>;

export type ChangeFrozenMutation = {
  __typename?: 'RootMutationType';
  setSandboxesFrozen: Array<{
    __typename?: 'Sandbox';
    id: string;
    alias: string | null;
    title: string | null;
    description: string | null;
    lastAccessedAt: any;
    insertedAt: string;
    updatedAt: string;
    removedAt: string | null;
    privacy: number;
    isFrozen: boolean;
    screenshotUrl: string | null;
    screenshotOutdated: boolean;
    viewCount: number;
    likeCount: number;
    isV2: boolean;
    draft: boolean;
    restricted: boolean;
    authorId: any | null;
    teamId: any | null;
    source: { __typename?: 'Source'; template: string | null };
    customTemplate: {
      __typename?: 'Template';
      id: any | null;
      iconUrl: string | null;
    } | null;
    forkedTemplate: {
      __typename?: 'Template';
      id: any | null;
      color: string | null;
      iconUrl: string | null;
    } | null;
    collection: {
      __typename?: 'Collection';
      path: string;
      id: any | null;
    } | null;
    author: { __typename?: 'User'; username: string } | null;
    permissions: {
      __typename?: 'SandboxProtectionSettings';
      preventSandboxLeaving: boolean;
      preventSandboxExport: boolean;
    } | null;
  }>;
};

export type _RenameSandboxMutationVariables = Exact<{
  id: Scalars['ID'];
  title: Scalars['String'];
}>;

export type _RenameSandboxMutation = {
  __typename?: 'RootMutationType';
  renameSandbox: {
    __typename?: 'Sandbox';
    id: string;
    alias: string | null;
    title: string | null;
    description: string | null;
    lastAccessedAt: any;
    insertedAt: string;
    updatedAt: string;
    removedAt: string | null;
    privacy: number;
    isFrozen: boolean;
    screenshotUrl: string | null;
    screenshotOutdated: boolean;
    viewCount: number;
    likeCount: number;
    isV2: boolean;
    draft: boolean;
    restricted: boolean;
    authorId: any | null;
    teamId: any | null;
    source: { __typename?: 'Source'; template: string | null };
    customTemplate: {
      __typename?: 'Template';
      id: any | null;
      iconUrl: string | null;
    } | null;
    forkedTemplate: {
      __typename?: 'Template';
      id: any | null;
      color: string | null;
      iconUrl: string | null;
    } | null;
    collection: {
      __typename?: 'Collection';
      path: string;
      id: any | null;
    } | null;
    author: { __typename?: 'User'; username: string } | null;
    permissions: {
      __typename?: 'SandboxProtectionSettings';
      preventSandboxLeaving: boolean;
      preventSandboxExport: boolean;
    } | null;
  };
};

export type _PermanentlyDeleteSandboxesMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type _PermanentlyDeleteSandboxesMutation = {
  __typename?: 'RootMutationType';
  permanentlyDeleteSandboxes: Array<{ __typename?: 'Sandbox'; id: string }>;
};

export type _AcceptTeamInvitationMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type _AcceptTeamInvitationMutation = {
  __typename?: 'RootMutationType';
  acceptTeamInvitation: {
    __typename?: 'Team';
    id: any;
    name: string;
    description: string | null;
    creatorId: any | null;
    avatarUrl: string | null;
    frozen: boolean;
    insertedAt: string;
    settings: {
      __typename?: 'WorkspaceSandboxSettings';
      minimumPrivacy: number;
    } | null;
    userAuthorizations: Array<{
      __typename?: 'UserAuthorization';
      userId: any;
      authorization: TeamMemberAuthorization;
      teamManager: boolean;
    }>;
    users: Array<{
      __typename?: 'User';
      id: any;
      name: string | null;
      username: string;
      avatarUrl: string;
    }>;
    invitees: Array<{
      __typename?: 'User';
      id: any;
      name: string | null;
      username: string;
      avatarUrl: string;
    }>;
    subscription: {
      __typename?: 'ProSubscription';
      origin: SubscriptionOrigin | null;
      type: SubscriptionType;
      status: SubscriptionStatus;
      paymentProvider: SubscriptionPaymentProvider | null;
    } | null;
    featureFlags: {
      __typename?: 'TeamFeatureFlags';
      ubbBeta: boolean;
      friendOfCsb: boolean;
    };
    limits: {
      __typename?: 'TeamLimits';
      includedPublicSandboxes: number;
      includedPrivateSandboxes: number;
    };
    usage: {
      __typename?: 'TeamUsage';
      publicSandboxesQuantity: number;
      privateSandboxesQuantity: number;
    };
  };
};

export type _RejectTeamInvitationMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type _RejectTeamInvitationMutation = {
  __typename?: 'RootMutationType';
  rejectTeamInvitation: string;
};

export type _UnmakeSandboxesTemplateMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type _UnmakeSandboxesTemplateMutation = {
  __typename?: 'RootMutationType';
  unmakeSandboxesTemplates: Array<{ __typename?: 'Template'; id: any | null }>;
};

export type _MakeSandboxesTemplateMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type _MakeSandboxesTemplateMutation = {
  __typename?: 'RootMutationType';
  makeSandboxesTemplates: Array<{ __typename?: 'Template'; id: any | null }>;
};

export type _SetTeamNameMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  name: Scalars['String'];
}>;

export type _SetTeamNameMutation = {
  __typename?: 'RootMutationType';
  setTeamName: {
    __typename?: 'Team';
    id: any;
    name: string;
    description: string | null;
    creatorId: any | null;
    avatarUrl: string | null;
    frozen: boolean;
    insertedAt: string;
    settings: {
      __typename?: 'WorkspaceSandboxSettings';
      minimumPrivacy: number;
    } | null;
    userAuthorizations: Array<{
      __typename?: 'UserAuthorization';
      userId: any;
      authorization: TeamMemberAuthorization;
      teamManager: boolean;
    }>;
    users: Array<{
      __typename?: 'User';
      id: any;
      name: string | null;
      username: string;
      avatarUrl: string;
    }>;
    invitees: Array<{
      __typename?: 'User';
      id: any;
      name: string | null;
      username: string;
      avatarUrl: string;
    }>;
    subscription: {
      __typename?: 'ProSubscription';
      origin: SubscriptionOrigin | null;
      type: SubscriptionType;
      status: SubscriptionStatus;
      paymentProvider: SubscriptionPaymentProvider | null;
    } | null;
    featureFlags: {
      __typename?: 'TeamFeatureFlags';
      ubbBeta: boolean;
      friendOfCsb: boolean;
    };
    limits: {
      __typename?: 'TeamLimits';
      includedPublicSandboxes: number;
      includedPrivateSandboxes: number;
    };
    usage: {
      __typename?: 'TeamUsage';
      publicSandboxesQuantity: number;
      privateSandboxesQuantity: number;
    };
  };
};

export type DeleteWorkspaceMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type DeleteWorkspaceMutation = {
  __typename?: 'RootMutationType';
  deleteWorkspace: string;
};

export type SetTeamMinimumPrivacyMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  minimumPrivacy: Scalars['Int'];
  updateDrafts: Scalars['Boolean'];
}>;

export type SetTeamMinimumPrivacyMutation = {
  __typename?: 'RootMutationType';
  setTeamMinimumPrivacy: {
    __typename?: 'WorkspaceSandboxSettings';
    minimumPrivacy: number;
  };
};

export type SetPreventSandboxesLeavingWorkspaceMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']> | Scalars['ID'];
  preventSandboxLeaving: Scalars['Boolean'];
}>;

export type SetPreventSandboxesLeavingWorkspaceMutation = {
  __typename?: 'RootMutationType';
  setPreventSandboxesLeavingWorkspace: Array<{
    __typename?: 'Sandbox';
    id: string;
  }>;
};

export type SetPreventSandboxesExportMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']> | Scalars['ID'];
  preventSandboxExport: Scalars['Boolean'];
}>;

export type SetPreventSandboxesExportMutation = {
  __typename?: 'RootMutationType';
  setPreventSandboxesExport: Array<{ __typename?: 'Sandbox'; id: string }>;
};

export type DeleteCurrentUserMutationVariables = Exact<{
  [key: string]: never;
}>;

export type DeleteCurrentUserMutation = {
  __typename?: 'RootMutationType';
  deleteCurrentUser: string;
};

export type CancelDeleteCurrentUserMutationVariables = Exact<{
  [key: string]: never;
}>;

export type CancelDeleteCurrentUserMutation = {
  __typename?: 'RootMutationType';
  cancelDeleteCurrentUser: string;
};

export type UpdateCurrentUserMutationVariables = Exact<{
  username: Scalars['String'];
  name: InputMaybe<Scalars['String']>;
  bio: InputMaybe<Scalars['String']>;
  socialLinks: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;

export type UpdateCurrentUserMutation = {
  __typename?: 'RootMutationType';
  updateCurrentUser: {
    __typename?: 'User';
    username: string;
    name: string | null;
    bio: string | null;
    socialLinks: Array<string> | null;
  };
};

export type ImportProjectMutationVariables = Exact<{
  owner: Scalars['String'];
  name: Scalars['String'];
  teamId: Scalars['ID'];
}>;

export type ImportProjectMutation = {
  __typename?: 'RootMutationType';
  importProject: {
    __typename?: 'Project';
    id: string;
    defaultBranch: { __typename?: 'Branch'; name: string };
  };
};

export type DeleteProjectMutationVariables = Exact<{
  owner: Scalars['String'];
  name: Scalars['String'];
  teamId: Scalars['ID'];
}>;

export type DeleteProjectMutation = {
  __typename?: 'RootMutationType';
  deleteProject: boolean;
};

export type DeleteBranchMutationVariables = Exact<{
  branchId: Scalars['String'];
}>;

export type DeleteBranchMutation = {
  __typename?: 'RootMutationType';
  deleteBranch: boolean;
};

export type CreateBranchMutationVariables = Exact<{
  owner: Scalars['String'];
  name: Scalars['String'];
  teamId: Scalars['ID'];
}>;

export type CreateBranchMutation = {
  __typename?: 'RootMutationType';
  createBranch: { __typename?: 'Branch'; id: string; name: string };
};

export type SetTeamLimitsMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  onDemandSpendingLimit: Scalars['Int'];
}>;

export type SetTeamLimitsMutation = {
  __typename?: 'RootMutationType';
  setTeamLimits: string;
};

export type PreviewConvertToUsageBillingMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  addons: Array<Scalars['String']> | Scalars['String'];
  plan: Scalars['String'];
  billingInterval: InputMaybe<SubscriptionInterval>;
}>;

export type PreviewConvertToUsageBillingMutation = {
  __typename?: 'RootMutationType';
  previewConvertToUsageBilling: {
    __typename?: 'InvoicePreview';
    total: number;
    totalExcludingTax: number | null;
  };
};

export type ConvertToUsageBillingMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  addons: Array<Scalars['String']> | Scalars['String'];
  plan: Scalars['String'];
  billingInterval: InputMaybe<SubscriptionInterval>;
}>;

export type ConvertToUsageBillingMutation = {
  __typename?: 'RootMutationType';
  convertToUsageBilling: boolean;
};

export type PreviewUpdateUsageSubscriptionPlanMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  plan: Scalars['String'];
  billingInterval: InputMaybe<SubscriptionInterval>;
}>;

export type PreviewUpdateUsageSubscriptionPlanMutation = {
  __typename?: 'RootMutationType';
  previewUpdateUsageSubscriptionPlan: {
    __typename?: 'InvoicePreview';
    total: number;
    totalExcludingTax: number | null;
    updateMoment: SubscriptionUpdateMoment | null;
  };
};

export type UpdateSubscriptionPlanMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  plan: Scalars['String'];
  billingInterval: InputMaybe<SubscriptionInterval>;
}>;

export type UpdateSubscriptionPlanMutation = {
  __typename?: 'RootMutationType';
  updateUsageSubscriptionPlan: boolean;
};

export type UpdateProjectVmTierMutationVariables = Exact<{
  projectId: Scalars['UUID4'];
  vmTier: Scalars['Int'];
}>;

export type UpdateProjectVmTierMutation = {
  __typename?: 'RootMutationType';
  updateProjectVmTier: {
    __typename?: 'Resources';
    cpu: number;
    memory: number;
    storage: number;
  };
};

export type SetTeamMetadataMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  useCases: Array<Scalars['String']> | Scalars['String'];
}>;

export type SetTeamMetadataMutation = {
  __typename?: 'RootMutationType';
  setTeamMetadata: {
    __typename?: 'Team';
    id: any;
    name: string;
    description: string | null;
    creatorId: any | null;
    avatarUrl: string | null;
    frozen: boolean;
    insertedAt: string;
    settings: {
      __typename?: 'WorkspaceSandboxSettings';
      minimumPrivacy: number;
    } | null;
    userAuthorizations: Array<{
      __typename?: 'UserAuthorization';
      userId: any;
      authorization: TeamMemberAuthorization;
      teamManager: boolean;
    }>;
    users: Array<{
      __typename?: 'User';
      id: any;
      name: string | null;
      username: string;
      avatarUrl: string;
    }>;
    invitees: Array<{
      __typename?: 'User';
      id: any;
      name: string | null;
      username: string;
      avatarUrl: string;
    }>;
    subscription: {
      __typename?: 'ProSubscription';
      origin: SubscriptionOrigin | null;
      type: SubscriptionType;
      status: SubscriptionStatus;
      paymentProvider: SubscriptionPaymentProvider | null;
    } | null;
    featureFlags: {
      __typename?: 'TeamFeatureFlags';
      ubbBeta: boolean;
      friendOfCsb: boolean;
    };
    limits: {
      __typename?: 'TeamLimits';
      includedPublicSandboxes: number;
      includedPrivateSandboxes: number;
    };
    usage: {
      __typename?: 'TeamUsage';
      publicSandboxesQuantity: number;
      privateSandboxesQuantity: number;
    };
  };
};

export type JoinEligibleWorkspaceMutationVariables = Exact<{
  workspaceId: Scalars['ID'];
}>;

export type JoinEligibleWorkspaceMutation = {
  __typename?: 'RootMutationType';
  joinEligibleWorkspace: { __typename?: 'Team'; id: any };
};

export type RecentlyDeletedTeamSandboxesQueryVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type RecentlyDeletedTeamSandboxesQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    team: {
      __typename?: 'Team';
      sandboxes: Array<{
        __typename?: 'Sandbox';
        id: string;
        alias: string | null;
        title: string | null;
        description: string | null;
        lastAccessedAt: any;
        insertedAt: string;
        updatedAt: string;
        removedAt: string | null;
        privacy: number;
        isFrozen: boolean;
        screenshotUrl: string | null;
        screenshotOutdated: boolean;
        viewCount: number;
        likeCount: number;
        isV2: boolean;
        draft: boolean;
        restricted: boolean;
        authorId: any | null;
        teamId: any | null;
        source: { __typename?: 'Source'; template: string | null };
        customTemplate: {
          __typename?: 'Template';
          id: any | null;
          iconUrl: string | null;
        } | null;
        forkedTemplate: {
          __typename?: 'Template';
          id: any | null;
          color: string | null;
          iconUrl: string | null;
        } | null;
        collection: {
          __typename?: 'Collection';
          path: string;
          id: any | null;
        } | null;
        author: { __typename?: 'User'; username: string } | null;
        permissions: {
          __typename?: 'SandboxProtectionSettings';
          preventSandboxLeaving: boolean;
          preventSandboxExport: boolean;
        } | null;
      }>;
    } | null;
  } | null;
};

export type SandboxesByPathQueryVariables = Exact<{
  path: Scalars['String'];
  teamId: InputMaybe<Scalars['ID']>;
}>;

export type SandboxesByPathQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    collections: Array<{
      __typename?: 'Collection';
      id: any | null;
      path: string;
      sandboxCount: number;
    }>;
    collection: {
      __typename?: 'Collection';
      id: any | null;
      path: string;
      sandboxes: Array<{
        __typename?: 'Sandbox';
        id: string;
        alias: string | null;
        title: string | null;
        description: string | null;
        lastAccessedAt: any;
        insertedAt: string;
        updatedAt: string;
        removedAt: string | null;
        privacy: number;
        isFrozen: boolean;
        screenshotUrl: string | null;
        screenshotOutdated: boolean;
        viewCount: number;
        likeCount: number;
        isV2: boolean;
        draft: boolean;
        restricted: boolean;
        authorId: any | null;
        teamId: any | null;
        source: { __typename?: 'Source'; template: string | null };
        customTemplate: {
          __typename?: 'Template';
          id: any | null;
          iconUrl: string | null;
        } | null;
        forkedTemplate: {
          __typename?: 'Template';
          id: any | null;
          color: string | null;
          iconUrl: string | null;
        } | null;
        collection: {
          __typename?: 'Collection';
          path: string;
          id: any | null;
        } | null;
        author: { __typename?: 'User'; username: string } | null;
        permissions: {
          __typename?: 'SandboxProtectionSettings';
          preventSandboxLeaving: boolean;
          preventSandboxExport: boolean;
        } | null;
      }>;
    } | null;
  } | null;
};

export type TeamDraftsQueryVariables = Exact<{
  teamId: Scalars['UUID4'];
  authorId: InputMaybe<Scalars['UUID4']>;
}>;

export type TeamDraftsQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    team: {
      __typename?: 'Team';
      drafts: Array<{
        __typename?: 'Sandbox';
        id: string;
        alias: string | null;
        title: string | null;
        description: string | null;
        lastAccessedAt: any;
        insertedAt: string;
        updatedAt: string;
        removedAt: string | null;
        privacy: number;
        isFrozen: boolean;
        screenshotUrl: string | null;
        screenshotOutdated: boolean;
        viewCount: number;
        likeCount: number;
        isV2: boolean;
        draft: boolean;
        restricted: boolean;
        authorId: any | null;
        teamId: any | null;
        source: { __typename?: 'Source'; template: string | null };
        customTemplate: {
          __typename?: 'Template';
          id: any | null;
          iconUrl: string | null;
        } | null;
        forkedTemplate: {
          __typename?: 'Template';
          id: any | null;
          color: string | null;
          iconUrl: string | null;
        } | null;
        collection: {
          __typename?: 'Collection';
          path: string;
          id: any | null;
        } | null;
        author: { __typename?: 'User'; username: string } | null;
        permissions: {
          __typename?: 'SandboxProtectionSettings';
          preventSandboxLeaving: boolean;
          preventSandboxExport: boolean;
        } | null;
      }>;
    } | null;
  } | null;
};

export type AllCollectionsQueryVariables = Exact<{
  teamId: InputMaybe<Scalars['ID']>;
}>;

export type AllCollectionsQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    collections: Array<{
      __typename?: 'Collection';
      id: any | null;
      path: string;
      sandboxCount: number;
    }>;
  } | null;
};

export type GetTeamReposQueryVariables = Exact<{
  id: Scalars['UUID4'];
}>;

export type GetTeamReposQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    team: {
      __typename?: 'Team';
      sandboxes: Array<{
        __typename?: 'Sandbox';
        prNumber: number | null;
        id: string;
        alias: string | null;
        title: string | null;
        description: string | null;
        lastAccessedAt: any;
        insertedAt: string;
        updatedAt: string;
        removedAt: string | null;
        privacy: number;
        isFrozen: boolean;
        screenshotUrl: string | null;
        screenshotOutdated: boolean;
        viewCount: number;
        likeCount: number;
        isV2: boolean;
        draft: boolean;
        restricted: boolean;
        authorId: any | null;
        teamId: any | null;
        baseGit: {
          __typename?: 'Git';
          branch: string | null;
          id: any | null;
          repo: string | null;
          username: string | null;
          path: string | null;
        } | null;
        originalGit: {
          __typename?: 'Git';
          branch: string | null;
          id: any | null;
          repo: string | null;
          username: string | null;
          path: string | null;
        } | null;
        source: { __typename?: 'Source'; template: string | null };
        customTemplate: {
          __typename?: 'Template';
          id: any | null;
          iconUrl: string | null;
        } | null;
        forkedTemplate: {
          __typename?: 'Template';
          id: any | null;
          color: string | null;
          iconUrl: string | null;
        } | null;
        collection: {
          __typename?: 'Collection';
          path: string;
          id: any | null;
        } | null;
        author: { __typename?: 'User'; username: string } | null;
        permissions: {
          __typename?: 'SandboxProtectionSettings';
          preventSandboxLeaving: boolean;
          preventSandboxExport: boolean;
        } | null;
      }>;
    } | null;
  } | null;
};

export type TeamTemplatesQueryVariables = Exact<{
  id: Scalars['UUID4'];
}>;

export type TeamTemplatesQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    team: {
      __typename?: 'Team';
      id: any;
      name: string;
      templates: Array<{
        __typename?: 'Template';
        id: any | null;
        color: string | null;
        iconUrl: string | null;
        published: boolean | null;
        sandbox: {
          __typename?: 'Sandbox';
          id: string;
          alias: string | null;
          title: string | null;
          description: string | null;
          lastAccessedAt: any;
          insertedAt: string;
          updatedAt: string;
          removedAt: string | null;
          privacy: number;
          isFrozen: boolean;
          screenshotUrl: string | null;
          screenshotOutdated: boolean;
          viewCount: number;
          likeCount: number;
          isV2: boolean;
          draft: boolean;
          restricted: boolean;
          authorId: any | null;
          teamId: any | null;
          git: {
            __typename?: 'Git';
            id: any | null;
            username: string | null;
            commitSha: string | null;
            path: string | null;
            repo: string | null;
            branch: string | null;
          } | null;
          team: { __typename?: 'TeamPreview'; name: string } | null;
          author: { __typename?: 'User'; username: string } | null;
          source: { __typename?: 'Source'; template: string | null };
          customTemplate: {
            __typename?: 'Template';
            id: any | null;
            iconUrl: string | null;
          } | null;
          forkedTemplate: {
            __typename?: 'Template';
            id: any | null;
            color: string | null;
            iconUrl: string | null;
          } | null;
          collection: {
            __typename?: 'Collection';
            path: string;
            id: any | null;
          } | null;
          permissions: {
            __typename?: 'SandboxProtectionSettings';
            preventSandboxLeaving: boolean;
            preventSandboxExport: boolean;
          } | null;
        } | null;
      }>;
    } | null;
  } | null;
};

export type AllTeamsQueryVariables = Exact<{ [key: string]: never }>;

export type AllTeamsQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    primaryWorkspaceId: any | null;
    workspaces: Array<{
      __typename?: 'Team';
      id: any;
      name: string;
      description: string | null;
      creatorId: any | null;
      avatarUrl: string | null;
      frozen: boolean;
      insertedAt: string;
      settings: {
        __typename?: 'WorkspaceSandboxSettings';
        minimumPrivacy: number;
      } | null;
      userAuthorizations: Array<{
        __typename?: 'UserAuthorization';
        userId: any;
        authorization: TeamMemberAuthorization;
        teamManager: boolean;
      }>;
      users: Array<{
        __typename?: 'User';
        id: any;
        name: string | null;
        username: string;
        avatarUrl: string;
      }>;
      invitees: Array<{
        __typename?: 'User';
        id: any;
        name: string | null;
        username: string;
        avatarUrl: string;
      }>;
      subscription: {
        __typename?: 'ProSubscription';
        origin: SubscriptionOrigin | null;
        type: SubscriptionType;
        status: SubscriptionStatus;
        paymentProvider: SubscriptionPaymentProvider | null;
      } | null;
      featureFlags: {
        __typename?: 'TeamFeatureFlags';
        ubbBeta: boolean;
        friendOfCsb: boolean;
      };
      limits: {
        __typename?: 'TeamLimits';
        includedPublicSandboxes: number;
        includedPrivateSandboxes: number;
      };
      usage: {
        __typename?: 'TeamUsage';
        publicSandboxesQuantity: number;
        privateSandboxesQuantity: number;
      };
    }>;
  } | null;
};

export type _SearchTeamSandboxesQueryVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type _SearchTeamSandboxesQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    team: {
      __typename?: 'Team';
      sandboxes: Array<{
        __typename?: 'Sandbox';
        id: string;
        alias: string | null;
        title: string | null;
        description: string | null;
        lastAccessedAt: any;
        insertedAt: string;
        updatedAt: string;
        removedAt: string | null;
        privacy: number;
        isFrozen: boolean;
        screenshotUrl: string | null;
        screenshotOutdated: boolean;
        viewCount: number;
        likeCount: number;
        isV2: boolean;
        draft: boolean;
        restricted: boolean;
        authorId: any | null;
        teamId: any | null;
        source: { __typename?: 'Source'; template: string | null };
        customTemplate: {
          __typename?: 'Template';
          id: any | null;
          iconUrl: string | null;
        } | null;
        forkedTemplate: {
          __typename?: 'Template';
          id: any | null;
          color: string | null;
          iconUrl: string | null;
        } | null;
        collection: {
          __typename?: 'Collection';
          path: string;
          id: any | null;
        } | null;
        author: { __typename?: 'User'; username: string } | null;
        permissions: {
          __typename?: 'SandboxProtectionSettings';
          preventSandboxLeaving: boolean;
          preventSandboxExport: boolean;
        } | null;
      }>;
    } | null;
  } | null;
};

export type RecentlyAccessedSandboxesQueryVariables = Exact<{
  limit: Scalars['Int'];
  teamId: InputMaybe<Scalars['UUID4']>;
}>;

export type RecentlyAccessedSandboxesQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    recentlyAccessedSandboxes: Array<{
      __typename?: 'Sandbox';
      id: string;
      alias: string | null;
      title: string | null;
      description: string | null;
      lastAccessedAt: any;
      insertedAt: string;
      updatedAt: string;
      removedAt: string | null;
      privacy: number;
      isFrozen: boolean;
      screenshotUrl: string | null;
      screenshotOutdated: boolean;
      viewCount: number;
      likeCount: number;
      isV2: boolean;
      draft: boolean;
      restricted: boolean;
      authorId: any | null;
      teamId: any | null;
      source: { __typename?: 'Source'; template: string | null };
      customTemplate: {
        __typename?: 'Template';
        id: any | null;
        iconUrl: string | null;
      } | null;
      forkedTemplate: {
        __typename?: 'Template';
        id: any | null;
        color: string | null;
        iconUrl: string | null;
      } | null;
      collection: {
        __typename?: 'Collection';
        path: string;
        id: any | null;
      } | null;
      author: { __typename?: 'User'; username: string } | null;
      permissions: {
        __typename?: 'SandboxProtectionSettings';
        preventSandboxLeaving: boolean;
        preventSandboxExport: boolean;
      } | null;
    }>;
  } | null;
};

export type RecentlyAccessedBranchesQueryVariables = Exact<{
  limit: Scalars['Int'];
  teamId: InputMaybe<Scalars['UUID4']>;
}>;

export type RecentlyAccessedBranchesQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    recentBranches: Array<{
      __typename?: 'Branch';
      id: string;
      name: string;
      contribution: boolean;
      lastAccessedAt: string | null;
      upstream: boolean;
      owner: { __typename?: 'User'; username: string } | null;
      project: {
        __typename?: 'Project';
        repository: {
          __typename?: 'GitHubRepository';
          defaultBranch: string;
          name: string;
          owner: string;
          private: boolean;
        };
        team: { __typename?: 'Team'; id: any } | null;
      };
    }>;
  } | null;
};

export type SharedWithMeSandboxesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type SharedWithMeSandboxesQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    collaboratorSandboxes: Array<{
      __typename?: 'Sandbox';
      id: string;
      alias: string | null;
      title: string | null;
      description: string | null;
      lastAccessedAt: any;
      insertedAt: string;
      updatedAt: string;
      removedAt: string | null;
      privacy: number;
      isFrozen: boolean;
      screenshotUrl: string | null;
      screenshotOutdated: boolean;
      viewCount: number;
      likeCount: number;
      isV2: boolean;
      draft: boolean;
      restricted: boolean;
      authorId: any | null;
      teamId: any | null;
      source: { __typename?: 'Source'; template: string | null };
      customTemplate: {
        __typename?: 'Template';
        id: any | null;
        iconUrl: string | null;
      } | null;
      forkedTemplate: {
        __typename?: 'Template';
        id: any | null;
        color: string | null;
        iconUrl: string | null;
      } | null;
      collection: {
        __typename?: 'Collection';
        path: string;
        id: any | null;
      } | null;
      author: { __typename?: 'User'; username: string } | null;
      permissions: {
        __typename?: 'SandboxProtectionSettings';
        preventSandboxLeaving: boolean;
        preventSandboxExport: boolean;
      } | null;
    }>;
  } | null;
};

export type GetTeamQueryVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type GetTeamQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    team: {
      __typename?: 'Team';
      id: any;
      creatorId: any | null;
      description: string | null;
      inviteToken: string;
      name: string;
      type: TeamType;
      avatarUrl: string | null;
      legacy: boolean;
      frozen: boolean;
      insertedAt: string;
      users: Array<{
        __typename?: 'User';
        id: any;
        avatarUrl: string;
        username: string;
      }>;
      invitees: Array<{
        __typename?: 'User';
        id: any;
        avatarUrl: string;
        username: string;
      }>;
      userAuthorizations: Array<{
        __typename?: 'UserAuthorization';
        userId: any;
        authorization: TeamMemberAuthorization;
        teamManager: boolean;
        drafts: number;
      }>;
      settings: {
        __typename?: 'WorkspaceSandboxSettings';
        minimumPrivacy: number;
        preventSandboxExport: boolean;
        preventSandboxLeaving: boolean;
        defaultAuthorization: TeamMemberAuthorization;
        aiConsent: {
          __typename?: 'TeamAiConsent';
          privateRepositories: boolean;
          privateSandboxes: boolean;
          publicRepositories: boolean;
          publicSandboxes: boolean;
        };
      } | null;
      subscription: {
        __typename?: 'ProSubscription';
        billingInterval: SubscriptionInterval | null;
        cancelAt: any | null;
        cancelAtPeriodEnd: boolean;
        currency: string | null;
        id: any | null;
        nextBillDate: any | null;
        origin: SubscriptionOrigin | null;
        paymentMethodAttached: boolean;
        paymentProvider: SubscriptionPaymentProvider | null;
        quantity: number | null;
        status: SubscriptionStatus;
        trialEnd: any | null;
        trialStart: any | null;
        type: SubscriptionType;
        unitPrice: number | null;
        updateBillingUrl: string | null;
      } | null;
      subscriptionSchedule: {
        __typename?: 'SubscriptionSchedule';
        billingInterval: SubscriptionInterval | null;
        current: {
          __typename?: 'SubscriptionSchedulePhase';
          startDate: string | null;
          endDate: string | null;
          items: Array<{
            __typename?: 'SubscriptionItem';
            name: string;
            quantity: number | null;
            unitAmount: number | null;
            unitAmountDecimal: string | null;
          }>;
        } | null;
        upcoming: {
          __typename?: 'SubscriptionSchedulePhase';
          startDate: string | null;
          endDate: string | null;
          items: Array<{
            __typename?: 'SubscriptionItem';
            name: string;
            quantity: number | null;
            unitAmount: number | null;
            unitAmountDecimal: string | null;
          }>;
        } | null;
      } | null;
      limits: {
        __typename?: 'TeamLimits';
        includedCredits: number;
        includedVmTier: number;
        onDemandCreditLimit: number | null;
        includedPublicSandboxes: number;
        includedPrivateSandboxes: number;
      };
      usage: {
        __typename?: 'TeamUsage';
        sandboxes: number;
        credits: number;
        publicSandboxesQuantity: number;
        privateSandboxesQuantity: number;
      };
      featureFlags: {
        __typename?: 'TeamFeatureFlags';
        ubbBeta: boolean;
        friendOfCsb: boolean;
      };
      metadata: { __typename?: 'TeamMetadata'; useCases: Array<string> };
    } | null;
  } | null;
};

export type ContributionBranchesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type ContributionBranchesQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    recentBranches: Array<{
      __typename?: 'Branch';
      id: string;
      name: string;
      contribution: boolean;
      lastAccessedAt: string | null;
      upstream: boolean;
      owner: { __typename?: 'User'; username: string } | null;
      project: {
        __typename?: 'Project';
        repository: {
          __typename?: 'GitHubRepository';
          defaultBranch: string;
          name: string;
          owner: string;
          private: boolean;
        };
        team: { __typename?: 'Team'; id: any } | null;
      };
    }>;
  } | null;
};

export type RepositoriesByTeamQueryVariables = Exact<{
  teamId: Scalars['UUID4'];
  syncData: InputMaybe<Scalars['Boolean']>;
}>;

export type RepositoriesByTeamQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    team: {
      __typename?: 'Team';
      id: any;
      name: string;
      projects: Array<{
        __typename?: 'Project';
        appInstalled: boolean;
        branchCount: number;
        lastAccessedAt: string | null;
        repository: {
          __typename?: 'GitHubRepository';
          owner: string;
          name: string;
          defaultBranch: string;
          private: boolean;
        };
        team: { __typename?: 'Team'; id: any } | null;
      }>;
    } | null;
  } | null;
};

export type RepositoryByDetailsQueryVariables = Exact<{
  owner: Scalars['String'];
  name: Scalars['String'];
  teamId: InputMaybe<Scalars['ID']>;
}>;

export type RepositoryByDetailsQuery = {
  __typename?: 'RootQueryType';
  project: {
    __typename?: 'Project';
    appInstalled: boolean;
    branches: Array<{
      __typename?: 'Branch';
      id: string;
      name: string;
      contribution: boolean;
      lastAccessedAt: string | null;
      upstream: boolean;
      owner: { __typename?: 'User'; username: string } | null;
      project: {
        __typename?: 'Project';
        repository: {
          __typename?: 'GitHubRepository';
          defaultBranch: string;
          name: string;
          owner: string;
          private: boolean;
        };
        team: { __typename?: 'Team'; id: any } | null;
      };
      pullRequests: Array<{
        __typename?: 'PullRequest';
        title: string;
        number: number;
        additions: number | null;
        deletions: number | null;
      }>;
    }>;
    repository: {
      __typename?: 'GitHubRepository';
      owner: string;
      name: string;
      defaultBranch: string;
      private: boolean;
    };
    team: { __typename?: 'Team'; id: any } | null;
  } | null;
};

export type GetPartialGitHubAccountReposQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetPartialGitHubAccountReposQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    id: any;
    githubRepos: Array<{
      __typename?: 'GithubRepo';
      id: string;
      authorization: GithubRepoAuthorization;
      fullName: string;
      name: string;
      private: boolean;
      updatedAt: string;
      pushedAt: string | null;
      owner: {
        __typename?: 'GithubOrganization';
        id: string;
        login: string;
        avatarUrl: string;
      };
    }>;
  } | null;
};

export type GetFullGitHubAccountReposQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetFullGitHubAccountReposQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    id: any;
    githubRepos: Array<{
      __typename?: 'GithubRepo';
      id: string;
      authorization: GithubRepoAuthorization;
      fullName: string;
      name: string;
      private: boolean;
      updatedAt: string;
      pushedAt: string | null;
      owner: {
        __typename?: 'GithubOrganization';
        id: string;
        login: string;
        avatarUrl: string;
      };
    }>;
  } | null;
};

export type GetPartialGitHubOrganizationReposQueryVariables = Exact<{
  organization: Scalars['String'];
}>;

export type GetPartialGitHubOrganizationReposQuery = {
  __typename?: 'RootQueryType';
  githubOrganizationRepos: Array<{
    __typename?: 'GithubRepo';
    id: string;
    authorization: GithubRepoAuthorization;
    fullName: string;
    name: string;
    private: boolean;
    updatedAt: string;
    pushedAt: string | null;
    owner: {
      __typename?: 'GithubOrganization';
      id: string;
      login: string;
      avatarUrl: string;
    };
  }> | null;
};

export type GetFullGitHubOrganizationReposQueryVariables = Exact<{
  organization: Scalars['String'];
}>;

export type GetFullGitHubOrganizationReposQuery = {
  __typename?: 'RootQueryType';
  githubOrganizationRepos: Array<{
    __typename?: 'GithubRepo';
    id: string;
    authorization: GithubRepoAuthorization;
    fullName: string;
    name: string;
    private: boolean;
    updatedAt: string;
    pushedAt: string | null;
    owner: {
      __typename?: 'GithubOrganization';
      id: string;
      login: string;
      avatarUrl: string;
    };
  }> | null;
};

export type GetSandboxWithTemplateQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetSandboxWithTemplateQuery = {
  __typename?: 'RootQueryType';
  sandbox: {
    __typename?: 'Sandbox';
    id: string;
    alias: string | null;
    title: string | null;
    description: string | null;
    forkCount: number;
    viewCount: number;
    isV2: boolean;
    insertedAt: string;
    updatedAt: string;
    team: { __typename?: 'TeamPreview'; name: string } | null;
    source: { __typename?: 'Source'; template: string | null };
    customTemplate: {
      __typename?: 'Template';
      id: any | null;
      iconUrl: string | null;
    } | null;
  } | null;
};

export type GetEligibleWorkspacesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetEligibleWorkspacesQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    eligibleWorkspaces: Array<{
      __typename?: 'TeamPreview';
      id: any;
      avatarUrl: string | null;
      name: string;
      shortid: string;
    }>;
  } | null;
};

export type RecentNotificationFragment = {
  __typename?: 'Notification';
  id: any;
  type: string;
  data: string;
  insertedAt: any;
  read: boolean;
};

export type UpdateNotificationPreferencesMutationVariables = Exact<{
  emailCommentMention: InputMaybe<Scalars['Boolean']>;
  emailCommentReply: InputMaybe<Scalars['Boolean']>;
  emailMarketing: InputMaybe<Scalars['Boolean']>;
  emailNewComment: InputMaybe<Scalars['Boolean']>;
  emailSandboxInvite: InputMaybe<Scalars['Boolean']>;
  emailTeamInvite: InputMaybe<Scalars['Boolean']>;
  inAppPrReviewReceived: InputMaybe<Scalars['Boolean']>;
  inAppPrReviewRequest: InputMaybe<Scalars['Boolean']>;
}>;

export type UpdateNotificationPreferencesMutation = {
  __typename?: 'RootMutationType';
  updateNotificationPreferences: {
    __typename?: 'NotificationPreferences';
    emailCommentMention: boolean;
    emailCommentReply: boolean;
    emailMarketing: boolean;
    emailNewComment: boolean;
    emailSandboxInvite: boolean;
    emailTeamInvite: boolean;
    inAppPrReviewReceived: boolean;
    inAppPrReviewRequest: boolean;
  };
};

export type MarkNotificationsAsReadMutationVariables = Exact<{
  [key: string]: never;
}>;

export type MarkNotificationsAsReadMutation = {
  __typename?: 'RootMutationType';
  markAllNotificationsAsRead: { __typename?: 'User'; id: any };
};

export type ArchiveAllNotificationsMutationVariables = Exact<{
  [key: string]: never;
}>;

export type ArchiveAllNotificationsMutation = {
  __typename?: 'RootMutationType';
  archiveAllNotifications: { __typename?: 'User'; id: any };
};

export type UpdateNotificationReadStatusMutationVariables = Exact<{
  notificationId: Scalars['UUID4'];
  read: Scalars['Boolean'];
}>;

export type UpdateNotificationReadStatusMutation = {
  __typename?: 'RootMutationType';
  updateNotificationReadStatus: { __typename?: 'Notification'; id: any };
};

export type ArchiveNotificationMutationVariables = Exact<{
  notificationId: Scalars['UUID4'];
}>;

export type ArchiveNotificationMutation = {
  __typename?: 'RootMutationType';
  archiveNotification: { __typename?: 'Notification'; id: any };
};

export type ClearNotificationCountMutationVariables = Exact<{
  [key: string]: never;
}>;

export type ClearNotificationCountMutation = {
  __typename?: 'RootMutationType';
  clearNotificationCount: { __typename?: 'User'; id: any };
};

export type EmailPreferencesQueryVariables = Exact<{ [key: string]: never }>;

export type EmailPreferencesQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    notificationPreferences: {
      __typename?: 'NotificationPreferences';
      emailCommentMention: boolean;
      emailCommentReply: boolean;
      emailMarketing: boolean;
      emailNewComment: boolean;
      emailSandboxInvite: boolean;
      emailTeamInvite: boolean;
      inAppPrReviewRequest: boolean;
      inAppPrReviewReceived: boolean;
    } | null;
  } | null;
};

export type RecentNotificationsQueryVariables = Exact<{
  type: InputMaybe<
    Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>
  >;
}>;

export type RecentNotificationsQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    notifications: Array<{
      __typename?: 'Notification';
      id: any;
      type: string;
      data: string;
      insertedAt: any;
      read: boolean;
    }>;
  } | null;
};

export type SidebarSyncedSandboxFragmentFragment = {
  __typename?: 'Sandbox';
  id: string;
};

export type SidebarTemplateFragmentFragment = {
  __typename?: 'Template';
  id: any | null;
};

export type SidebarProjectFragmentFragment = {
  __typename?: 'Project';
  repository: {
    __typename?: 'GitHubRepository';
    name: string;
    owner: string;
    defaultBranch: string;
  };
};

export type TeamSidebarDataQueryVariables = Exact<{
  id: Scalars['UUID4'];
}>;

export type TeamSidebarDataQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    team: {
      __typename?: 'Team';
      syncedSandboxes: Array<{ __typename?: 'Sandbox'; id: string }>;
      templates: Array<{ __typename?: 'Template'; id: any | null }>;
      projects: Array<{
        __typename?: 'Project';
        repository: {
          __typename?: 'GitHubRepository';
          name: string;
          owner: string;
          defaultBranch: string;
        };
      }>;
      sandboxes: Array<{
        __typename?: 'Sandbox';
        id: string;
        alias: string | null;
        title: string | null;
        description: string | null;
        lastAccessedAt: any;
        insertedAt: string;
        updatedAt: string;
        removedAt: string | null;
        privacy: number;
        isFrozen: boolean;
        screenshotUrl: string | null;
        screenshotOutdated: boolean;
        viewCount: number;
        likeCount: number;
        isV2: boolean;
        draft: boolean;
        restricted: boolean;
        authorId: any | null;
        teamId: any | null;
        source: { __typename?: 'Source'; template: string | null };
        customTemplate: {
          __typename?: 'Template';
          id: any | null;
          iconUrl: string | null;
        } | null;
        forkedTemplate: {
          __typename?: 'Template';
          id: any | null;
          color: string | null;
          iconUrl: string | null;
        } | null;
        collection: {
          __typename?: 'Collection';
          path: string;
          id: any | null;
        } | null;
        author: { __typename?: 'User'; username: string } | null;
        permissions: {
          __typename?: 'SandboxProtectionSettings';
          preventSandboxLeaving: boolean;
          preventSandboxExport: boolean;
        } | null;
      }>;
    } | null;
  } | null;
};

export type TeamsQueryVariables = Exact<{ [key: string]: never }>;

export type TeamsQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    workspaces: Array<{ __typename?: 'Team'; id: any; name: string }>;
  } | null;
};

export type SidebarCollectionFragment = {
  __typename?: 'Collection';
  id: any | null;
  path: string;
};

export type SandboxFragment = {
  __typename?: 'Sandbox';
  id: string;
  alias: string | null;
  title: string | null;
  description: string | null;
  insertedAt: string;
  updatedAt: string;
  removedAt: string | null;
  privacy: number;
  screenshotUrl: string | null;
  screenshotOutdated: boolean;
  teamId: any | null;
  source: { __typename?: 'Source'; template: string | null };
  customTemplate: { __typename?: 'Template'; id: any | null } | null;
  forkedTemplate: {
    __typename?: 'Template';
    id: any | null;
    color: string | null;
  } | null;
  collection: {
    __typename?: 'Collection';
    path: string;
    teamId: any | null;
  } | null;
};

export type TeamFragment = {
  __typename?: 'Team';
  id: any;
  name: string;
  inviteToken: string;
  description: string | null;
  creatorId: any | null;
  users: Array<{
    __typename?: 'User';
    id: any;
    name: string | null;
    username: string;
    avatarUrl: string;
  }>;
  invitees: Array<{
    __typename?: 'User';
    id: any;
    name: string | null;
    username: string;
    avatarUrl: string;
  }>;
};

export type TeamsSidebarQueryVariables = Exact<{ [key: string]: never }>;

export type TeamsSidebarQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    teams: Array<{ __typename?: 'Team'; id: any; name: string }>;
  } | null;
};

export type PathedSandboxesFoldersQueryVariables = Exact<{
  teamId: InputMaybe<Scalars['ID']>;
}>;

export type PathedSandboxesFoldersQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    collections: Array<{
      __typename?: 'Collection';
      id: any | null;
      path: string;
    }>;
  } | null;
};

export type CreateCollectionMutationVariables = Exact<{
  path: Scalars['String'];
  teamId: InputMaybe<Scalars['UUID4']>;
}>;

export type CreateCollectionMutation = {
  __typename?: 'RootMutationType';
  createCollection: { __typename?: 'Collection'; id: any | null; path: string };
};

export type DeleteCollectionMutationVariables = Exact<{
  path: Scalars['String'];
  teamId: InputMaybe<Scalars['UUID4']>;
}>;

export type DeleteCollectionMutation = {
  __typename?: 'RootMutationType';
  deleteCollection: Array<{
    __typename?: 'Collection';
    id: any | null;
    path: string;
  }>;
};

export type RenameCollectionMutationVariables = Exact<{
  path: Scalars['String'];
  newPath: Scalars['String'];
  teamId: InputMaybe<Scalars['UUID4']>;
  newTeamId: InputMaybe<Scalars['UUID4']>;
}>;

export type RenameCollectionMutation = {
  __typename?: 'RootMutationType';
  renameCollection: Array<{
    __typename?: 'Collection';
    id: any | null;
    path: string;
  }>;
};

export type AddToCollectionMutationVariables = Exact<{
  collectionPath: InputMaybe<Scalars['String']>;
  sandboxIds: Array<Scalars['ID']> | Scalars['ID'];
  teamId: InputMaybe<Scalars['UUID4']>;
}>;

export type AddToCollectionMutation = {
  __typename?: 'RootMutationType';
  addToCollectionOrTeam: Array<{
    __typename?: 'Sandbox';
    id: string;
    alias: string | null;
    title: string | null;
    description: string | null;
    insertedAt: string;
    updatedAt: string;
    removedAt: string | null;
    privacy: number;
    screenshotUrl: string | null;
    screenshotOutdated: boolean;
    teamId: any | null;
    source: { __typename?: 'Source'; template: string | null };
    customTemplate: { __typename?: 'Template'; id: any | null } | null;
    forkedTemplate: {
      __typename?: 'Template';
      id: any | null;
      color: string | null;
    } | null;
    collection: {
      __typename?: 'Collection';
      path: string;
      teamId: any | null;
    } | null;
  } | null>;
};

export type DeleteSandboxesMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type DeleteSandboxesMutation = {
  __typename?: 'RootMutationType';
  deleteSandboxes: Array<{
    __typename?: 'Sandbox';
    id: string;
    alias: string | null;
    title: string | null;
    description: string | null;
    insertedAt: string;
    updatedAt: string;
    removedAt: string | null;
    privacy: number;
    screenshotUrl: string | null;
    screenshotOutdated: boolean;
    teamId: any | null;
    source: { __typename?: 'Source'; template: string | null };
    customTemplate: { __typename?: 'Template'; id: any | null } | null;
    forkedTemplate: {
      __typename?: 'Template';
      id: any | null;
      color: string | null;
    } | null;
    collection: {
      __typename?: 'Collection';
      path: string;
      teamId: any | null;
    } | null;
  }>;
};

export type SetSandboxesPrivacyMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']> | Scalars['ID'];
  privacy: Scalars['Int'];
}>;

export type SetSandboxesPrivacyMutation = {
  __typename?: 'RootMutationType';
  setSandboxesPrivacy: Array<{
    __typename?: 'Sandbox';
    id: string;
    alias: string | null;
    title: string | null;
    description: string | null;
    insertedAt: string;
    updatedAt: string;
    removedAt: string | null;
    privacy: number;
    screenshotUrl: string | null;
    screenshotOutdated: boolean;
    teamId: any | null;
    source: { __typename?: 'Source'; template: string | null };
    customTemplate: { __typename?: 'Template'; id: any | null } | null;
    forkedTemplate: {
      __typename?: 'Template';
      id: any | null;
      color: string | null;
    } | null;
    collection: {
      __typename?: 'Collection';
      path: string;
      teamId: any | null;
    } | null;
  }>;
};

export type RenameSandboxMutationVariables = Exact<{
  id: Scalars['ID'];
  title: Scalars['String'];
}>;

export type RenameSandboxMutation = {
  __typename?: 'RootMutationType';
  renameSandbox: {
    __typename?: 'Sandbox';
    id: string;
    alias: string | null;
    title: string | null;
    description: string | null;
    insertedAt: string;
    updatedAt: string;
    removedAt: string | null;
    privacy: number;
    screenshotUrl: string | null;
    screenshotOutdated: boolean;
    teamId: any | null;
    source: { __typename?: 'Source'; template: string | null };
    customTemplate: { __typename?: 'Template'; id: any | null } | null;
    forkedTemplate: {
      __typename?: 'Template';
      id: any | null;
      color: string | null;
    } | null;
    collection: {
      __typename?: 'Collection';
      path: string;
      teamId: any | null;
    } | null;
  };
};

export type PermanentlyDeleteSandboxesMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type PermanentlyDeleteSandboxesMutation = {
  __typename?: 'RootMutationType';
  permanentlyDeleteSandboxes: Array<{ __typename?: 'Sandbox'; id: string }>;
};

export type PathedSandboxesQueryVariables = Exact<{
  path: Scalars['String'];
  teamId: InputMaybe<Scalars['ID']>;
}>;

export type PathedSandboxesQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    collections: Array<{
      __typename?: 'Collection';
      id: any | null;
      path: string;
    }>;
    collection: {
      __typename?: 'Collection';
      id: any | null;
      path: string;
      sandboxes: Array<{
        __typename?: 'Sandbox';
        id: string;
        alias: string | null;
        title: string | null;
        description: string | null;
        insertedAt: string;
        updatedAt: string;
        removedAt: string | null;
        privacy: number;
        screenshotUrl: string | null;
        screenshotOutdated: boolean;
        teamId: any | null;
        source: { __typename?: 'Source'; template: string | null };
        customTemplate: { __typename?: 'Template'; id: any | null } | null;
        forkedTemplate: {
          __typename?: 'Template';
          id: any | null;
          color: string | null;
        } | null;
        collection: {
          __typename?: 'Collection';
          path: string;
          teamId: any | null;
        } | null;
      }>;
    } | null;
  } | null;
};

export type RecentSandboxesQueryVariables = Exact<{
  orderField: Scalars['String'];
  orderDirection: Direction;
}>;

export type RecentSandboxesQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    sandboxes: Array<{
      __typename?: 'Sandbox';
      id: string;
      alias: string | null;
      title: string | null;
      description: string | null;
      insertedAt: string;
      updatedAt: string;
      removedAt: string | null;
      privacy: number;
      screenshotUrl: string | null;
      screenshotOutdated: boolean;
      teamId: any | null;
      source: { __typename?: 'Source'; template: string | null };
      customTemplate: { __typename?: 'Template'; id: any | null } | null;
      forkedTemplate: {
        __typename?: 'Template';
        id: any | null;
        color: string | null;
      } | null;
      collection: {
        __typename?: 'Collection';
        path: string;
        teamId: any | null;
      } | null;
    }>;
  } | null;
};

export type SearchSandboxesQueryVariables = Exact<{ [key: string]: never }>;

export type SearchSandboxesQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    sandboxes: Array<{
      __typename?: 'Sandbox';
      id: string;
      alias: string | null;
      title: string | null;
      description: string | null;
      insertedAt: string;
      updatedAt: string;
      removedAt: string | null;
      privacy: number;
      screenshotUrl: string | null;
      screenshotOutdated: boolean;
      teamId: any | null;
      source: { __typename?: 'Source'; template: string | null };
      customTemplate: { __typename?: 'Template'; id: any | null } | null;
      forkedTemplate: {
        __typename?: 'Template';
        id: any | null;
        color: string | null;
      } | null;
      collection: {
        __typename?: 'Collection';
        path: string;
        teamId: any | null;
      } | null;
    }>;
  } | null;
};

export type DeletedSandboxesQueryVariables = Exact<{ [key: string]: never }>;

export type DeletedSandboxesQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    sandboxes: Array<{
      __typename?: 'Sandbox';
      id: string;
      alias: string | null;
      title: string | null;
      description: string | null;
      insertedAt: string;
      updatedAt: string;
      removedAt: string | null;
      privacy: number;
      screenshotUrl: string | null;
      screenshotOutdated: boolean;
      teamId: any | null;
      source: { __typename?: 'Source'; template: string | null };
      customTemplate: { __typename?: 'Template'; id: any | null } | null;
      forkedTemplate: {
        __typename?: 'Template';
        id: any | null;
        color: string | null;
      } | null;
      collection: {
        __typename?: 'Collection';
        path: string;
        teamId: any | null;
      } | null;
    }>;
  } | null;
};

export type TeamQueryVariables = Exact<{
  id: Scalars['UUID4'];
}>;

export type TeamQuery = {
  __typename?: 'RootQueryType';
  me: {
    __typename?: 'CurrentUser';
    team: {
      __typename?: 'Team';
      id: any;
      name: string;
      inviteToken: string;
      description: string | null;
      creatorId: any | null;
      users: Array<{
        __typename?: 'User';
        id: any;
        name: string | null;
        username: string;
        avatarUrl: string;
      }>;
      invitees: Array<{
        __typename?: 'User';
        id: any;
        name: string | null;
        username: string;
        avatarUrl: string;
      }>;
    } | null;
  } | null;
};

export type AcceptTeamInvitationMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type AcceptTeamInvitationMutation = {
  __typename?: 'RootMutationType';
  acceptTeamInvitation: {
    __typename?: 'Team';
    id: any;
    name: string;
    inviteToken: string;
    description: string | null;
    creatorId: any | null;
    users: Array<{
      __typename?: 'User';
      id: any;
      name: string | null;
      username: string;
      avatarUrl: string;
    }>;
    invitees: Array<{
      __typename?: 'User';
      id: any;
      name: string | null;
      username: string;
      avatarUrl: string;
    }>;
  };
};

export type RejectTeamInvitationMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type RejectTeamInvitationMutation = {
  __typename?: 'RootMutationType';
  rejectTeamInvitation: string;
};

export type TeamByTokenQueryVariables = Exact<{
  inviteToken: Scalars['String'];
}>;

export type TeamByTokenQuery = {
  __typename?: 'RootQueryType';
  teamByToken: { __typename?: 'TeamPreview'; name: string } | null;
};

export type JoinTeamByTokenMutationVariables = Exact<{
  inviteToken: Scalars['String'];
}>;

export type JoinTeamByTokenMutation = {
  __typename?: 'RootMutationType';
  redeemTeamInviteToken: { __typename?: 'Team'; id: any; name: string };
};
