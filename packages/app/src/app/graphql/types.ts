export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `UUID` scalar type represents UUID4 compliant string data, represented as UTF-8
   * character sequences. The UUID4 type is most often used to represent unique
   * human-readable ID strings.
   */
  UUID4: any;
  /**
   * The `DateTime` scalar type represents a date and time in the UTC
   * timezone. The DateTime appears in a JSON response as an ISO8601 formatted
   * string, including UTC timezone ("Z"). The parsed date and time string will
   * be converted to UTC if there is an offset.
   */
  DateTime: any;
  /**
   * The `Naive DateTime` scalar type represents a naive date and time without
   * timezone. The DateTime appears in a JSON response as an ISO8601 formatted
   * string.
   */
  NaiveDateTime: any;
  /** Base64 encoded file contents. */
  Base64: any;
};

export type Album = {
  __typename?: 'Album';
  id: Scalars['ID'];
  sandboxes: Array<Sandbox>;
  title: Maybe<Scalars['String']>;
};

export enum Authorization {
  Comment = 'COMMENT',
  None = 'NONE',
  Owner = 'OWNER',
  Read = 'READ',
  WriteCode = 'WRITE_CODE',
  WriteProject = 'WRITE_PROJECT',
}

export enum AuthType {
  Basic = 'BASIC',
  Bearer = 'BEARER',
}

export type BillingDetails = {
  __typename?: 'BillingDetails';
  amount: Scalars['Int'];
  currency: Scalars['String'];
  date: Scalars['String'];
};

export type BillingPreview = {
  __typename?: 'BillingPreview';
  immediatePayment: Maybe<BillingDetails>;
  nextPayment: Maybe<BillingDetails>;
};

export type Bookmarked = {
  __typename?: 'Bookmarked';
  entity: Maybe<BookmarkEntity>;
  isBookmarked: Maybe<Scalars['Boolean']>;
};

/** A team or the current user */
export type BookmarkEntity = Team | User;

export type Branch = {
  __typename?: 'Branch';
  connections: Array<Connection>;
  contribution: Scalars['Boolean'];
  id: Scalars['String'];
  lastAccessedAt: Maybe<Scalars['String']>;
  lastCommit: Maybe<LastCommit>;
  name: Scalars['String'];
  owner: Maybe<User>;
  poolSize: Scalars['Int'];
  project: Project;
  pullRequests: Array<PullRequest>;
  status: Maybe<Status>;
  /** Whether or not this branch exists on GitHub. Deduced from local information, so not guaranteed 100% accurate. */
  upstream: Scalars['Boolean'];
};

export type BranchConnections = {
  __typename?: 'BranchConnections';
  branchId: Scalars['String'];
  connections: Array<Connection>;
};

export type BranchLastCommit = {
  __typename?: 'BranchLastCommit';
  branchId: Scalars['String'];
  lastCommit: LastCommit;
};

export type BranchStatus = {
  __typename?: 'BranchStatus';
  branchId: Scalars['String'];
  status: Status;
};

export type CodeReference = {
  anchor: Scalars['Int'];
  code: Scalars['String'];
  head: Scalars['Int'];
  lastUpdatedAt: Scalars['String'];
  path: Scalars['String'];
};

export type CodeReferenceMetadata = {
  __typename?: 'CodeReferenceMetadata';
  anchor: Scalars['Int'];
  code: Scalars['String'];
  head: Scalars['Int'];
  path: Scalars['String'];
  sandboxId: Scalars['String'];
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

export type Connection = {
  __typename?: 'Connection';
  appId: Scalars['String'];
  clientId: Scalars['String'];
  color: Scalars['String'];
  timestamp: Scalars['String'];
  user: Maybe<User>;
};

export type CurrentUser = {
  __typename?: 'CurrentUser';
  /** @deprecated Deprecated for open beta */
  betaAccess: Scalars['Boolean'];
  /** @deprecated Use teams and projects instead */
  betaSandboxes: Array<SandboxV2>;
  bookmarkedTemplates: Array<Template>;
  collaboratorSandboxes: Array<Sandbox>;
  collection: Maybe<Collection>;
  collections: Array<Collection>;
  deletionRequested: Scalars['Boolean'];
  email: Scalars['String'];
  /** Get enabled feature flags for all teams user is in */
  featureFlags: Array<FeatureFlag>;
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
   */
  githubRepos: Array<GithubRepo>;
  id: Scalars['UUID4'];
  likedSandboxes: Array<Sandbox>;
  name: Maybe<Scalars['String']>;
  notificationPreferences: Maybe<NotificationPreferences>;
  notifications: Array<Notification>;
  personalWorkspaceId: Scalars['UUID4'];
  provider: ProviderName;
  recentBranches: Array<Branch>;
  recentProjects: Array<Project>;
  recentlyAccessedSandboxes: Array<Sandbox>;
  recentlyUsedTemplates: Array<Template>;
  sandboxes: Array<Sandbox>;
  team: Maybe<Team>;
  teams: Array<Team>;
  templates: Array<Template>;
  username: Scalars['String'];
  workspaces: Array<Team>;
};

export type CurrentUserCollectionArgs = {
  path: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
};

export type CurrentUserCollectionsArgs = {
  teamId: Maybe<Scalars['ID']>;
};

export type CurrentUserGithubReposArgs = {
  page: Maybe<Scalars['Int']>;
  perPage: Maybe<Scalars['Int']>;
};

export type CurrentUserNotificationsArgs = {
  limit: Maybe<Scalars['Int']>;
  orderBy: Maybe<OrderBy>;
  type: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type CurrentUserRecentBranchesArgs = {
  contribution?: Maybe<Scalars['Boolean']>;
  limit?: Maybe<Scalars['Int']>;
};

export type CurrentUserRecentProjectsArgs = {
  limit?: Maybe<Scalars['Int']>;
};

export type CurrentUserRecentlyAccessedSandboxesArgs = {
  limit: Maybe<Scalars['Int']>;
  teamId: Maybe<Scalars['UUID4']>;
};

export type CurrentUserRecentlyUsedTemplatesArgs = {
  teamId: Maybe<Scalars['UUID4']>;
};

export type CurrentUserSandboxesArgs = {
  hasOriginalGit: Maybe<Scalars['Boolean']>;
  limit: Maybe<Scalars['Int']>;
  orderBy: Maybe<OrderBy>;
  showDeleted: Maybe<Scalars['Boolean']>;
};

export type CurrentUserTeamArgs = {
  id: Maybe<Scalars['UUID4']>;
};

export type CurrentUserTemplatesArgs = {
  showAll: Maybe<Scalars['Boolean']>;
  teamId: Maybe<Scalars['UUID4']>;
};

export enum Direction {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type Environment = {
  __typename?: 'Environment';
  description: Scalars['String'];
  id: Scalars['UUID4'];
  limitCpu: Scalars['Int'];
  limitMemory: Scalars['String'];
  limitStorage: Scalars['String'];
  name: Scalars['String'];
  order: Scalars['Int'];
};

/** A feature flag */
export type FeatureFlag = {
  __typename?: 'FeatureFlag';
  description: Scalars['String'];
  enabled: Scalars['Boolean'];
  id: Scalars['UUID4'];
  name: Scalars['String'];
  teams: Array<Team>;
};

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
  teamId: Maybe<Scalars['UUID4']>;
};

/** A v1 git object */
export type GitOriginalGitSandboxesArgs = {
  teamId: Maybe<Scalars['UUID4']>;
};

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

/** Current user's permission to the parent resource */
export enum GithubPermission {
  Admin = 'ADMIN',
  None = 'NONE',
  Read = 'READ',
  Write = 'WRITE',
}

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

/** Details about a repository as it appears on GitHub (Open API `repository`) */
export type GithubRepo = {
  __typename?: 'GithubRepo';
  /** Current users's access to the GitHub repo */
  authorization: GithubRepoAuthorization;
  /** Full repository name, e.g. owner/name */
  fullName: Scalars['String'];
  /** Integer ID */
  id: Scalars['ID'];
  /** Short repository name */
  name: Scalars['String'];
  /** Owning user or organization */
  owner: GithubOrganization;
  /** ISO 8601 datetime */
  updatedAt: Scalars['String'];
};

export enum GithubRepoAuthorization {
  Read = 'READ',
  Write = 'WRITE',
}

/** Repository as it appears on GitHub */
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

export enum GitProvider {
  Github = 'GITHUB',
}

/** A git object specifically for v2 that combines git_branch and git_repo */
export type GitV2 = {
  __typename?: 'GitV2';
  branch: Maybe<Scalars['String']>;
  owner: Maybe<Scalars['String']>;
  repo: Maybe<Scalars['String']>;
};

export type ImageReference = {
  fileName: Scalars['String'];
  resolution: Array<Scalars['Int']>;
  src: Maybe<Scalars['Base64']>;
  url: Maybe<Scalars['String']>;
};

export type ImageReferenceMetadata = {
  __typename?: 'ImageReferenceMetadata';
  fileName: Scalars['String'];
  resolution: Array<Scalars['Int']>;
  uploadId: Scalars['UUID4'];
  url: Scalars['String'];
};

/** GitHub webhook event about the status of a GitHub App installation. */
export type InstallationEvent = {
  __typename?: 'InstallationEvent';
  action: InstallationEventAction;
  event: Scalars['String'];
};

export enum InstallationEventAction {
  Created = 'CREATED',
}

/** An invitation to a sandbox */
export type Invitation = {
  __typename?: 'Invitation';
  authorization: Authorization;
  email: Maybe<Scalars['String']>;
  id: Maybe<Scalars['ID']>;
  sandbox: Sandbox;
  token: Scalars['String'];
};

export type LastCommit = {
  __typename?: 'LastCommit';
  color: Scalars['String'];
  message: Maybe<Scalars['String']>;
  sha: Scalars['String'];
  timestamp: Scalars['String'];
  user: Maybe<User>;
};

export type MemberAuthorization = {
  authorization: TeamMemberAuthorization;
  userId: Scalars['UUID4'];
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

export type NotificationPreferences = {
  __typename?: 'NotificationPreferences';
  emailCommentMention: Scalars['Boolean'];
  emailCommentReply: Scalars['Boolean'];
  emailNewComment: Scalars['Boolean'];
};

export type OrderBy = {
  direction: Direction;
  field: Scalars['String'];
};

export type PreviewReference = {
  height: Scalars['Int'];
  previewPath: Scalars['String'];
  screenshotSrc: Maybe<Scalars['Base64']>;
  userAgent: Scalars['String'];
  width: Scalars['Int'];
  x: Scalars['Int'];
  y: Scalars['Int'];
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
  teamId: Scalars['UUID4'];
};

export type Project = {
  __typename?: 'Project';
  appInstalled: Scalars['Boolean'];
  availableEnvironments: Array<Environment>;
  branches: Array<Branch>;
  connections: Array<Connection>;
  defaultBranch: Branch;
  /** @deprecated Use repository->description instead */
  description: Maybe<Scalars['String']>;
  environment: Maybe<Environment>;
  lastAccessedAt: Maybe<Scalars['String']>;
  lastCommit: Maybe<LastCommit>;
  /** @deprecated Use repository->owner instead */
  owner: Scalars['String'];
  /** @deprecated Use repository->private instead */
  private: Scalars['Boolean'];
  pullRequests: Array<PullRequest>;
  /** @deprecated Use repository->name instead */
  repo: Scalars['String'];
  repository: Repository;
  teams: Array<Team>;
};

export type ProSubscription = {
  __typename?: 'ProSubscription';
  billingInterval: Maybe<SubscriptionInterval>;
  cancelAt: Maybe<Scalars['DateTime']>;
  currency: Maybe<Scalars['String']>;
  id: Maybe<Scalars['UUID4']>;
  nextBillDate: Maybe<Scalars['DateTime']>;
  origin: Maybe<SubscriptionOrigin>;
  paymentProvider: Maybe<SubscriptionPaymentProvider>;
  quantity: Maybe<Scalars['Int']>;
  status: SubscriptionStatus;
  type: SubscriptionType;
  unitPrice: Maybe<Scalars['Int']>;
  updateBillingUrl: Maybe<Scalars['String']>;
};

/** The oAuth provider used to create the account */
export enum ProviderName {
  Apple = 'APPLE',
  Github = 'GITHUB',
  Google = 'GOOGLE',
}

export type PullRequest = {
  __typename?: 'PullRequest';
  creator: Maybe<User>;
  creatorUsername: Scalars['String'];
  draft: Scalars['Boolean'];
  number: Scalars['Int'];
  prClosedAt: Maybe<Scalars['DateTime']>;
  prCreatedAt: Maybe<Scalars['DateTime']>;
  prMergedAt: Maybe<Scalars['DateTime']>;
  prUpdatedAt: Scalars['DateTime'];
  /** @deprecated This field is deprecated. We cannot guarantee subfields will resolve properly */
  sourceBranch: Branch;
  state: Scalars['String'];
  /** @deprecated This field is deprecated. We cannot guarantee subfields will resolve properly */
  targetBranch: Branch;
  title: Scalars['String'];
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

export enum RegistryType {
  Custom = 'CUSTOM',
  Github = 'GITHUB',
  Npm = 'NPM',
}

/** Repository as seen on one of our git providers */
export type Repository = GitHubRepository;

/** GitHub webhook event about a repository. */
export type RepositoryEvent = InstallationEvent;

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
  createAlbum: Album;
  createCodeComment: Comment;
  /** Create a collection */
  createCollection: Collection;
  createComment: Comment;
  /** Create a feature flag */
  createFeatureFlag: FeatureFlag;
  /** Create or Update a private registry */
  createOrUpdatePrivateNpmRegistry: PrivateRegistry;
  createPreviewComment: Comment;
  createSandboxInvitation: Invitation;
  /** Create a team */
  createTeam: Team;
  deleteAlbum: Scalars['String'];
  /** Delete a collection and all subfolders */
  deleteCollection: Array<Collection>;
  /** Soft delete a comment. Note: all child comments will also be deleted. */
  deleteComment: Comment;
  /** Request deletion of current user */
  deleteCurrentUser: Scalars['String'];
  /** Delete a private registry */
  deletePrivateNpmRegistry: Maybe<PrivateRegistry>;
  /** Delete sandboxes */
  deleteSandboxes: Array<Sandbox>;
  deleteWorkspace: Scalars['String'];
  /** Disable a feature flag globally */
  disableFeatureFlag: FeatureFlag;
  /** Disable a feature flag for a team */
  disableFeatureFlagForTeam: TeamsFeatureFlag;
  /** Enable a feature flag globally */
  enableFeatureFlag: FeatureFlag;
  /** Enable a feature flag for a team */
  enableFeatureFlagForTeam: TeamsFeatureFlag;
  /** Enable beta-access for team and all members */
  enableTeamBetaAccess: Team;
  /** Invite someone to a team */
  inviteToTeam: Team;
  /** Invite someone to a team via email */
  inviteToTeamViaEmail: Scalars['String'];
  /** Leave a team */
  leaveTeam: Scalars['String'];
  /** Make templates from sandboxes */
  makeSandboxesTemplates: Array<Template>;
  /** Mark all notifications as read */
  markAllNotificationsAsRead: User;
  /** Mark one notification as read */
  markNotificationAsRead: Notification;
  permanentlyDeleteSandboxes: Array<Sandbox>;
  previewUpdateSubscriptionBillingInterval: BillingPreview;
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
  /** Remove sandboxes from album (idempotent) */
  removeSandboxesFromAlbum: Maybe<Album>;
  /** Rename a collection and all subfolders */
  renameCollection: Array<Collection>;
  renameSandbox: Sandbox;
  resolveComment: Comment;
  revokeSandboxInvitation: Invitation;
  /** Revoke an invitation to a team */
  revokeTeamInvitation: Team;
  /** Set the default authorization for any new members joining this workspace */
  setDefaultTeamMemberAuthorization: WorkspaceSandboxSettings;
  setPreventSandboxesExport: Array<Sandbox>;
  setPreventSandboxesLeavingWorkspace: Array<Sandbox>;
  /** set sandbox always on status */
  setSandboxAlwaysOn: Sandbox;
  setSandboxesFrozen: Array<Sandbox>;
  setSandboxesPrivacy: Array<Sandbox>;
  /** Set the description of the team */
  setTeamDescription: Team;
  /** Set minimum privacy level for workspace */
  setTeamMinimumPrivacy: WorkspaceSandboxSettings;
  /** Set the name of the team */
  setTeamName: Team;
  setWorkspaceSandboxSettings: WorkspaceSandboxSettings;
  softCancelSubscription: ProSubscription;
  /** Unbookmark a template */
  unbookmarkTemplate: Maybe<Template>;
  /** Convert templates back to sandboxes */
  unmakeSandboxesTemplates: Array<Template>;
  unresolveComment: Comment;
  updateAlbum: Album;
  updateComment: Comment;
  /** Change details of current user */
  updateCurrentUser: User;
  /** Set a user's notification preferences */
  updateNotificationPreferences: NotificationPreferences;
  /** Update notification read status */
  updateNotificationReadStatus: Notification;
  updateProjectEnvironment: Project;
  /** update subscription details (not billing details) */
  updateSubscription: ProSubscription;
  updateSubscriptionBillingInterval: ProSubscription;
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
  sandboxIds: Maybe<Array<Maybe<Scalars['ID']>>>;
  teamId: Maybe<Scalars['UUID4']>;
};

export type RootMutationTypeAddToCollectionOrTeamArgs = {
  collectionPath: Maybe<Scalars['String']>;
  sandboxIds: Maybe<Array<Maybe<Scalars['ID']>>>;
  teamId: Maybe<Scalars['UUID4']>;
};

export type RootMutationTypeArchiveNotificationArgs = {
  notificationId: Scalars['UUID4'];
};

export type RootMutationTypeBookmarkTemplateArgs = {
  teamId: Maybe<Scalars['UUID4']>;
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
  memberAuthorizations: Maybe<Array<MemberAuthorization>>;
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeCreateAlbumArgs = {
  description: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type RootMutationTypeCreateCodeCommentArgs = {
  anchorReference: CodeReference;
  codeReferences: Maybe<Array<CodeReference>>;
  content: Scalars['String'];
  id: Maybe<Scalars['ID']>;
  imageReferences: Maybe<Array<ImageReference>>;
  parentCommentId: Maybe<Scalars['ID']>;
  sandboxId: Scalars['ID'];
  userReferences: Maybe<Array<UserReference>>;
};

export type RootMutationTypeCreateCollectionArgs = {
  path: Scalars['String'];
  teamId: Maybe<Scalars['UUID4']>;
};

export type RootMutationTypeCreateCommentArgs = {
  codeReference: Maybe<CodeReference>;
  codeReferences: Maybe<Array<CodeReference>>;
  content: Scalars['String'];
  id: Maybe<Scalars['ID']>;
  imageReferences: Maybe<Array<ImageReference>>;
  parentCommentId: Maybe<Scalars['ID']>;
  sandboxId: Scalars['ID'];
  userReferences: Maybe<Array<UserReference>>;
};

export type RootMutationTypeCreateFeatureFlagArgs = {
  description: Scalars['String'];
  enabled: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
};

export type RootMutationTypeCreateOrUpdatePrivateNpmRegistryArgs = {
  authType: Maybe<AuthType>;
  enabledScopes: Array<Scalars['String']>;
  limitToScopes: Scalars['Boolean'];
  proxyEnabled: Scalars['Boolean'];
  registryAuthKey: Maybe<Scalars['String']>;
  registryType: RegistryType;
  registryUrl: Maybe<Scalars['String']>;
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeCreatePreviewCommentArgs = {
  anchorReference: PreviewReference;
  codeReferences: Maybe<Array<CodeReference>>;
  content: Scalars['String'];
  id: Maybe<Scalars['ID']>;
  imageReferences: Maybe<Array<ImageReference>>;
  parentCommentId: Maybe<Scalars['ID']>;
  sandboxId: Scalars['ID'];
  userReferences: Maybe<Array<UserReference>>;
};

export type RootMutationTypeCreateSandboxInvitationArgs = {
  authorization: Authorization;
  email: Scalars['String'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeCreateTeamArgs = {
  name: Scalars['String'];
  pilot: Maybe<Scalars['Boolean']>;
};

export type RootMutationTypeDeleteAlbumArgs = {
  id: Scalars['ID'];
};

export type RootMutationTypeDeleteCollectionArgs = {
  path: Scalars['String'];
  teamId: Maybe<Scalars['UUID4']>;
};

export type RootMutationTypeDeleteCommentArgs = {
  commentId: Scalars['UUID4'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeDeletePrivateNpmRegistryArgs = {
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeDeleteSandboxesArgs = {
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeDeleteWorkspaceArgs = {
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeDisableFeatureFlagArgs = {
  name: Scalars['String'];
};

export type RootMutationTypeDisableFeatureFlagForTeamArgs = {
  featureFlagId: Scalars['UUID4'];
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeEnableFeatureFlagArgs = {
  name: Scalars['String'];
};

export type RootMutationTypeEnableFeatureFlagForTeamArgs = {
  featureFlagId: Scalars['UUID4'];
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeEnableTeamBetaAccessArgs = {
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeInviteToTeamArgs = {
  authorization: Maybe<TeamMemberAuthorization>;
  teamId: Scalars['UUID4'];
  username: Scalars['String'];
};

export type RootMutationTypeInviteToTeamViaEmailArgs = {
  authorization: Maybe<TeamMemberAuthorization>;
  email: Scalars['String'];
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

export type RootMutationTypePermanentlyDeleteSandboxesArgs = {
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypePreviewUpdateSubscriptionBillingIntervalArgs = {
  billingInterval: SubscriptionInterval;
  subscriptionId: Scalars['UUID4'];
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

export type RootMutationTypeRemoveSandboxesFromAlbumArgs = {
  albumId: Scalars['ID'];
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeRenameCollectionArgs = {
  newPath: Scalars['String'];
  newTeamId: Maybe<Scalars['UUID4']>;
  path: Scalars['String'];
  teamId: Maybe<Scalars['UUID4']>;
};

export type RootMutationTypeRenameSandboxArgs = {
  id: Scalars['ID'];
  title: Scalars['String'];
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

export type RootMutationTypeSetDefaultTeamMemberAuthorizationArgs = {
  defaultAuthorization: TeamMemberAuthorization;
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeSetPreventSandboxesExportArgs = {
  preventSandboxExport: Scalars['Boolean'];
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeSetPreventSandboxesLeavingWorkspaceArgs = {
  preventSandboxLeaving: Scalars['Boolean'];
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeSetSandboxAlwaysOnArgs = {
  alwaysOn: Scalars['Boolean'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeSetSandboxesFrozenArgs = {
  isFrozen: Scalars['Boolean'];
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeSetSandboxesPrivacyArgs = {
  privacy: Maybe<Scalars['Int']>;
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeSetTeamDescriptionArgs = {
  description: Scalars['String'];
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

export type RootMutationTypeUnbookmarkTemplateArgs = {
  teamId: Maybe<Scalars['UUID4']>;
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
  description: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  title: Maybe<Scalars['String']>;
};

export type RootMutationTypeUpdateCommentArgs = {
  codeReferences: Maybe<Array<CodeReference>>;
  commentId: Scalars['UUID4'];
  content: Maybe<Scalars['String']>;
  imageReferences: Maybe<Array<ImageReference>>;
  sandboxId: Scalars['ID'];
  userReferences: Maybe<Array<UserReference>>;
};

export type RootMutationTypeUpdateCurrentUserArgs = {
  bio: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  socialLinks: Maybe<Array<Scalars['String']>>;
  username: Scalars['String'];
};

export type RootMutationTypeUpdateNotificationPreferencesArgs = {
  emailCommentMention: Maybe<Scalars['Boolean']>;
  emailCommentReply: Maybe<Scalars['Boolean']>;
  emailNewComment: Maybe<Scalars['Boolean']>;
};

export type RootMutationTypeUpdateNotificationReadStatusArgs = {
  notificationId: Scalars['UUID4'];
  read: Scalars['Boolean'];
};

export type RootMutationTypeUpdateProjectEnvironmentArgs = {
  environmentId: Maybe<Scalars['UUID4']>;
  gitProvider?: Maybe<GitProvider>;
  owner: Scalars['String'];
  repo: Scalars['String'];
};

export type RootMutationTypeUpdateSubscriptionArgs = {
  quantity: Maybe<Scalars['Int']>;
  subscriptionId: Scalars['UUID4'];
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeUpdateSubscriptionBillingIntervalArgs = {
  billingInterval: SubscriptionInterval;
  subscriptionId: Scalars['UUID4'];
  teamId: Scalars['UUID4'];
};

export type RootQueryType = {
  __typename?: 'RootQueryType';
  album: Maybe<Album>;
  albums: Array<Album>;
  curatedAlbums: Array<Album>;
  /** Get all feature flags */
  featureFlags: Array<FeatureFlag>;
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
  /** Get current user */
  me: Maybe<CurrentUser>;
  /** Get a V2 project by git details */
  project: Maybe<Project>;
  /** Get a sandbox */
  sandbox: Maybe<Sandbox>;
  /** A team from an invite token */
  teamByToken: Maybe<Team>;
};

export type RootQueryTypeAlbumArgs = {
  albumId: Scalars['ID'];
};

export type RootQueryTypeAlbumsArgs = {
  username: Scalars['String'];
};

export type RootQueryTypeGitArgs = {
  branch: Scalars['String'];
  path: Scalars['String'];
  repo: Scalars['String'];
  username: Scalars['String'];
};

export type RootQueryTypeGithubOrganizationReposArgs = {
  organization: Scalars['String'];
  page: Maybe<Scalars['Int']>;
  perPage: Maybe<Scalars['Int']>;
};

export type RootQueryTypeGithubRepoArgs = {
  owner: Scalars['String'];
  repo: Scalars['String'];
};

export type RootQueryTypeProjectArgs = {
  gitProvider?: Maybe<GitProvider>;
  owner: Scalars['String'];
  repo: Scalars['String'];
};

export type RootQueryTypeSandboxArgs = {
  sandboxId: Scalars['ID'];
};

export type RootQueryTypeTeamByTokenArgs = {
  inviteToken: Scalars['String'];
};

export type RootSubscriptionType = {
  __typename?: 'RootSubscriptionType';
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
  /** Receive updates if a new commit is made via the CSB ui. Omitting branchId subscribes to all branches in the project. */
  projectCommits: BranchLastCommit;
  /** Receive updates if users (dis)connect to a branch. Omitting branchId subscribes to all branches in the project. */
  projectConnections: BranchConnections;
  /** Receive updates when the status of a branch changes. Omitting branchId subscribes to all branches in the project. */
  projectStatus: BranchStatus;
  sandboxChanged: Sandbox;
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

export type RootSubscriptionTypeProjectCommitsArgs = {
  branchId: Maybe<Scalars['String']>;
  owner: Scalars['String'];
  repo: Scalars['String'];
};

export type RootSubscriptionTypeProjectConnectionsArgs = {
  branchId: Maybe<Scalars['String']>;
  owner: Scalars['String'];
  repo: Scalars['String'];
};

export type RootSubscriptionTypeProjectStatusArgs = {
  branchId: Maybe<Scalars['String']>;
  owner: Scalars['String'];
  repo: Scalars['String'];
};

export type RootSubscriptionTypeSandboxChangedArgs = {
  sandboxId: Scalars['ID'];
};

/** A Sandbox */
export type Sandbox = {
  __typename?: 'Sandbox';
  alias: Maybe<Scalars['String']>;
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
  forkCount: Scalars['Int'];
  forkedTemplate: Maybe<Template>;
  /** If the sandbox has a v1 git repo tied to it this will be set */
  git: Maybe<Git>;
  id: Scalars['ID'];
  insertedAt: Scalars['String'];
  invitations: Array<Invitation>;
  isFrozen: Scalars['Boolean'];
  isSse: Maybe<Scalars['Boolean']>;
  isV2: Scalars['Boolean'];
  likeCount: Scalars['Int'];
  /** If the sandbox has been forked from a git sandbox this will be set */
  originalGit: Maybe<Git>;
  permissions: Maybe<SandboxProtectionSettings>;
  /** If a PR has been opened on the sandbox, this will be set to the PR number */
  prNumber: Maybe<Scalars['Int']>;
  privacy: Scalars['Int'];
  removedAt: Maybe<Scalars['String']>;
  screenshotOutdated: Scalars['Boolean'];
  screenshotUrl: Maybe<Scalars['String']>;
  source: Source;
  team: Maybe<Team>;
  teamId: Maybe<Scalars['UUID4']>;
  title: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  viewCount: Scalars['Int'];
};

/** A Sandbox */
export type SandboxCommentArgs = {
  commentId: Scalars['UUID4'];
};

export type SandboxProtectionSettings = {
  __typename?: 'SandboxProtectionSettings';
  preventSandboxExport: Scalars['Boolean'];
  preventSandboxLeaving: Scalars['Boolean'];
};

/** A blank v2 sandbox */
export type SandboxV2 = {
  __typename?: 'SandboxV2';
  alias: Maybe<Scalars['String']>;
  authorization: Authorization;
  collaborators: Array<Collaborator>;
  /** If the sandbox has a v2 git tied to it this will be set */
  gitv2: Maybe<GitV2>;
  id: Scalars['ID'];
  insertedAt: Scalars['String'];
  isV2: Scalars['Boolean'];
  removedAt: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type Source = {
  __typename?: 'Source';
  id: Maybe<Scalars['UUID4']>;
  template: Maybe<Scalars['String']>;
};

export type Status = {
  __typename?: 'Status';
  hasChanges: Scalars['Boolean'];
  hasConflicts: Scalars['Boolean'];
  remote: StatusCommitCounts;
  target: StatusCommitCounts;
};

export type StatusCommitCounts = {
  __typename?: 'StatusCommitCounts';
  ahead: Scalars['Int'];
  behind: Scalars['Int'];
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
  Paddle = 'PADDLE',
  Stripe = 'STRIPE',
}

export enum SubscriptionStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
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

export type Team = {
  __typename?: 'Team';
  avatarUrl: Maybe<Scalars['String']>;
  /** @deprecated Deprecated for open beta */
  beta: Scalars['Boolean'];
  bookmarkedTemplates: Array<Template>;
  collections: Array<Collection>;
  creatorId: Maybe<Scalars['UUID4']>;
  description: Maybe<Scalars['String']>;
  /** Draft sandboxes by everyone on the team */
  drafts: Array<Sandbox>;
  id: Scalars['UUID4'];
  inviteToken: Scalars['String'];
  invitees: Array<User>;
  joinedPilotAt: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  privateRegistry: Maybe<PrivateRegistry>;
  projects: Array<Project>;
  sandboxes: Array<Sandbox>;
  settings: Maybe<WorkspaceSandboxSettings>;
  subscription: Maybe<ProSubscription>;
  templates: Array<Template>;
  userAuthorizations: Array<UserAuthorization>;
  users: Array<User>;
};

export type TeamDraftsArgs = {
  authorId: Maybe<Scalars['UUID4']>;
  limit: Maybe<Scalars['Int']>;
  orderBy: Maybe<OrderBy>;
};

export type TeamProjectsArgs = {
  syncData?: Maybe<Scalars['Boolean']>;
};

export type TeamSandboxesArgs = {
  alwaysOn: Maybe<Scalars['Boolean']>;
  authorId: Maybe<Scalars['UUID4']>;
  hasOriginalGit: Maybe<Scalars['Boolean']>;
  limit: Maybe<Scalars['Int']>;
  orderBy: Maybe<OrderBy>;
  showDeleted: Maybe<Scalars['Boolean']>;
};

export enum TeamMemberAuthorization {
  /** Permission to add/remove users and change permissions (in addition to write and read). */
  Admin = 'ADMIN',
  /** Permission view and comment on team sandboxes. */
  Read = 'READ',
  /** Permission create and edit team sandboxes (in addition to read). */
  Write = 'WRITE',
}

/** A team's feature flag */
export type TeamsFeatureFlag = {
  __typename?: 'TeamsFeatureFlag';
  enabledForTeam: Scalars['Boolean'];
  featureFlagId: Scalars['UUID4'];
  teamId: Scalars['UUID4'];
};

/** A Template */
export type Template = {
  __typename?: 'Template';
  bookmarked: Maybe<Array<Maybe<Bookmarked>>>;
  color: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  iconUrl: Maybe<Scalars['String']>;
  id: Maybe<Scalars['UUID4']>;
  insertedAt: Maybe<Scalars['String']>;
  published: Maybe<Scalars['Boolean']>;
  sandbox: Maybe<Sandbox>;
  title: Maybe<Scalars['String']>;
  updatedAt: Maybe<Scalars['String']>;
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

export type UserAuthorization = {
  __typename?: 'UserAuthorization';
  authorization: TeamMemberAuthorization;
  userId: Scalars['UUID4'];
};

export type UserReference = {
  userId: Scalars['String'];
  username: Scalars['String'];
};

export type UserReferenceMetadata = {
  __typename?: 'UserReferenceMetadata';
  userId: Scalars['String'];
  username: Scalars['String'];
};

export type WorkspaceSandboxSettings = {
  __typename?: 'WorkspaceSandboxSettings';
  defaultAuthorization: TeamMemberAuthorization;
  minimumPrivacy: Scalars['Int'];
  preventSandboxExport: Scalars['Boolean'];
  preventSandboxLeaving: Scalars['Boolean'];
};

export type TemplateFragment = { __typename?: 'Template' } & Pick<
  Template,
  'id' | 'color' | 'iconUrl' | 'published'
> & {
    sandbox: Maybe<
      { __typename?: 'Sandbox' } & Pick<
        Sandbox,
        | 'id'
        | 'alias'
        | 'title'
        | 'description'
        | 'insertedAt'
        | 'updatedAt'
        | 'isV2'
      > & {
          collection: Maybe<
            { __typename?: 'Collection' } & {
              team: Maybe<{ __typename?: 'Team' } & Pick<Team, 'name'>>;
            }
          >;
          author: Maybe<{ __typename?: 'User' } & Pick<User, 'username'>>;
          source: { __typename?: 'Source' } & Pick<Source, 'template'>;
        }
    >;
  };

export type ListPersonalTemplatesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type ListPersonalTemplatesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      templates: Array<{ __typename?: 'Template' } & TemplateFragment>;
      recentlyUsedTemplates: Array<
        { __typename?: 'Template' } & {
          sandbox: Maybe<
            { __typename?: 'Sandbox' } & {
              git: Maybe<
                { __typename?: 'Git' } & Pick<
                  Git,
                  'id' | 'username' | 'commitSha' | 'path' | 'repo' | 'branch'
                >
              >;
            }
          >;
        } & TemplateFragment
      >;
      bookmarkedTemplates: Array<
        { __typename?: 'Template' } & TemplateFragment
      >;
      teams: Array<
        { __typename?: 'Team' } & Pick<Team, 'id' | 'name'> & {
            bookmarkedTemplates: Array<
              { __typename?: 'Template' } & TemplateFragment
            >;
            templates: Array<{ __typename?: 'Template' } & TemplateFragment>;
          }
      >;
    }
  >;
};

export type ListTemplatesQueryVariables = Exact<{
  showAll: Maybe<Scalars['Boolean']>;
}>;

export type ListTemplatesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      templates: Array<{ __typename?: 'Template' } & TemplateFragment>;
      teams: Array<
        { __typename?: 'Team' } & Pick<Team, 'id' | 'name'> & {
            templates: Array<{ __typename?: 'Template' } & TemplateFragment>;
          }
      >;
    }
  >;
};

export type ListPersonalBookmarkedTemplatesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type ListPersonalBookmarkedTemplatesQuery = {
  __typename?: 'RootQueryType';
} & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      teams: Array<
        { __typename?: 'Team' } & Pick<Team, 'id' | 'name'> & {
            bookmarkedTemplates: Array<
              { __typename?: 'Template' } & TemplateFragment
            >;
          }
      >;
      bookmarkedTemplates: Array<
        { __typename?: 'Template' } & TemplateFragment
      >;
    }
  >;
};

export type MakeSandboxesTemplateMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']>;
}>;

export type MakeSandboxesTemplateMutation = {
  __typename?: 'RootMutationType';
} & {
  makeSandboxesTemplates: Array<
    { __typename?: 'Template' } & Pick<Template, 'id'>
  >;
};

export type UnmakeSandboxesTemplateMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']>;
}>;

export type UnmakeSandboxesTemplateMutation = {
  __typename?: 'RootMutationType';
} & {
  unmakeSandboxesTemplates: Array<
    { __typename?: 'Template' } & Pick<Template, 'id'>
  >;
};

export type CollaboratorFragment = { __typename?: 'Collaborator' } & Pick<
  Collaborator,
  'id' | 'authorization' | 'lastSeenAt' | 'warning'
> & {
    user: { __typename?: 'User' } & Pick<User, 'id' | 'username' | 'avatarUrl'>;
  };

export type InvitationFragment = { __typename?: 'Invitation' } & Pick<
  Invitation,
  'id' | 'authorization' | 'email'
>;

export type SandboxChangedFragment = { __typename?: 'Sandbox' } & Pick<
  Sandbox,
  'id' | 'privacy' | 'title' | 'description' | 'authorization'
>;

export type AddCollaboratorMutationVariables = Exact<{
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
  authorization: Authorization;
}>;

export type AddCollaboratorMutation = { __typename?: 'RootMutationType' } & {
  addCollaborator: { __typename?: 'Collaborator' } & CollaboratorFragment;
};

export type RemoveCollaboratorMutationVariables = Exact<{
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
}>;

export type RemoveCollaboratorMutation = { __typename?: 'RootMutationType' } & {
  removeCollaborator: { __typename?: 'Collaborator' } & CollaboratorFragment;
};

export type ChangeCollaboratorAuthorizationMutationVariables = Exact<{
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
  authorization: Authorization;
}>;

export type ChangeCollaboratorAuthorizationMutation = {
  __typename?: 'RootMutationType';
} & {
  changeCollaboratorAuthorization: {
    __typename?: 'Collaborator';
  } & CollaboratorFragment;
};

export type InviteCollaboratorMutationVariables = Exact<{
  sandboxId: Scalars['ID'];
  authorization: Authorization;
  email: Scalars['String'];
}>;

export type InviteCollaboratorMutation = { __typename?: 'RootMutationType' } & {
  createSandboxInvitation: { __typename?: 'Invitation' } & InvitationFragment;
};

export type RevokeSandboxInvitationMutationVariables = Exact<{
  sandboxId: Scalars['ID'];
  invitationId: Scalars['UUID4'];
}>;

export type RevokeSandboxInvitationMutation = {
  __typename?: 'RootMutationType';
} & {
  revokeSandboxInvitation: { __typename?: 'Invitation' } & InvitationFragment;
};

export type ChangeSandboxInvitationAuthorizationMutationVariables = Exact<{
  sandboxId: Scalars['ID'];
  invitationId: Scalars['UUID4'];
  authorization: Authorization;
}>;

export type ChangeSandboxInvitationAuthorizationMutation = {
  __typename?: 'RootMutationType';
} & {
  changeSandboxInvitationAuthorization: {
    __typename?: 'Invitation';
  } & InvitationFragment;
};

export type RedeemSandboxInvitationMutationVariables = Exact<{
  sandboxId: Scalars['ID'];
  invitationToken: Scalars['String'];
}>;

export type RedeemSandboxInvitationMutation = {
  __typename?: 'RootMutationType';
} & {
  redeemSandboxInvitation: { __typename?: 'Invitation' } & InvitationFragment;
};

export type SandboxCollaboratorsQueryVariables = Exact<{
  sandboxId: Scalars['ID'];
}>;

export type SandboxCollaboratorsQuery = { __typename?: 'RootQueryType' } & {
  sandbox: Maybe<
    { __typename?: 'Sandbox' } & {
      collaborators: Array<
        { __typename?: 'Collaborator' } & CollaboratorFragment
      >;
    }
  >;
};

export type SandboxInvitationsQueryVariables = Exact<{
  sandboxId: Scalars['ID'];
}>;

export type SandboxInvitationsQuery = { __typename?: 'RootQueryType' } & {
  sandbox: Maybe<
    { __typename?: 'Sandbox' } & {
      invitations: Array<{ __typename?: 'Invitation' } & InvitationFragment>;
    }
  >;
};

export type OnCollaboratorAddedSubscriptionVariables = Exact<{
  sandboxId: Scalars['ID'];
}>;

export type OnCollaboratorAddedSubscription = {
  __typename?: 'RootSubscriptionType';
} & {
  collaboratorAdded: { __typename?: 'Collaborator' } & CollaboratorFragment;
};

export type OnCollaboratorChangedSubscriptionVariables = Exact<{
  sandboxId: Scalars['ID'];
}>;

export type OnCollaboratorChangedSubscription = {
  __typename?: 'RootSubscriptionType';
} & {
  collaboratorChanged: { __typename?: 'Collaborator' } & CollaboratorFragment;
};

export type OnCollaboratorRemovedSubscriptionVariables = Exact<{
  sandboxId: Scalars['ID'];
}>;

export type OnCollaboratorRemovedSubscription = {
  __typename?: 'RootSubscriptionType';
} & {
  collaboratorRemoved: { __typename?: 'Collaborator' } & CollaboratorFragment;
};

export type OnInvitationCreatedSubscriptionVariables = Exact<{
  sandboxId: Scalars['ID'];
}>;

export type OnInvitationCreatedSubscription = {
  __typename?: 'RootSubscriptionType';
} & { invitationCreated: { __typename?: 'Invitation' } & InvitationFragment };

export type OnInvitationRemovedSubscriptionVariables = Exact<{
  sandboxId: Scalars['ID'];
}>;

export type OnInvitationRemovedSubscription = {
  __typename?: 'RootSubscriptionType';
} & { invitationRemoved: { __typename?: 'Invitation' } & InvitationFragment };

export type OnInvitationChangedSubscriptionVariables = Exact<{
  sandboxId: Scalars['ID'];
}>;

export type OnInvitationChangedSubscription = {
  __typename?: 'RootSubscriptionType';
} & { invitationChanged: { __typename?: 'Invitation' } & InvitationFragment };

export type OnSandboxChangedSubscriptionVariables = Exact<{
  sandboxId: Scalars['ID'];
}>;

export type OnSandboxChangedSubscription = {
  __typename?: 'RootSubscriptionType';
} & { sandboxChanged: { __typename?: 'Sandbox' } & SandboxChangedFragment };

export type CodeReferenceMetadataFragment = {
  __typename?: 'CodeReferenceMetadata';
} & Pick<CodeReferenceMetadata, 'anchor' | 'code' | 'head' | 'path'>;

export type UserReferenceMetadataFragment = {
  __typename?: 'UserReferenceMetadata';
} & Pick<UserReferenceMetadata, 'username' | 'userId'>;

export type ImageReferenceMetadataFragment = {
  __typename?: 'ImageReferenceMetadata';
} & Pick<ImageReferenceMetadata, 'fileName'>;

export type PreviewReferenceMetadataFragment = {
  __typename?: 'PreviewReferenceMetadata';
} & Pick<
  PreviewReferenceMetadata,
  'width' | 'height' | 'x' | 'y' | 'screenshotUrl' | 'userAgent'
>;

export type CommentFragment = { __typename?: 'Comment' } & Pick<
  Comment,
  'id' | 'content' | 'insertedAt' | 'updatedAt' | 'isResolved' | 'replyCount'
> & {
    anchorReference: Maybe<
      { __typename?: 'Reference' } & Pick<
        Reference,
        'id' | 'resource' | 'type'
      > & {
          metadata:
            | ({
                __typename?: 'CodeReferenceMetadata';
              } & CodeReferenceMetadataFragment)
            | { __typename?: 'ImageReferenceMetadata' }
            | ({
                __typename?: 'PreviewReferenceMetadata';
              } & PreviewReferenceMetadataFragment)
            | { __typename?: 'UserReferenceMetadata' };
        }
    >;
    references: Array<
      { __typename?: 'Reference' } & Pick<
        Reference,
        'id' | 'resource' | 'type'
      > & {
          metadata:
            | ({
                __typename?: 'CodeReferenceMetadata';
              } & CodeReferenceMetadataFragment)
            | ({
                __typename?: 'ImageReferenceMetadata';
              } & ImageReferenceMetadataFragment)
            | { __typename?: 'PreviewReferenceMetadata' }
            | ({
                __typename?: 'UserReferenceMetadata';
              } & UserReferenceMetadataFragment);
        }
    >;
    user: { __typename?: 'User' } & Pick<
      User,
      'id' | 'name' | 'username' | 'avatarUrl'
    >;
    parentComment: Maybe<{ __typename?: 'Comment' } & Pick<Comment, 'id'>>;
  };

export type CommentWithRepliesFragment = { __typename?: 'Comment' } & Pick<
  Comment,
  'id' | 'content' | 'insertedAt' | 'updatedAt' | 'isResolved' | 'replyCount'
> & {
    anchorReference: Maybe<
      { __typename?: 'Reference' } & Pick<
        Reference,
        'id' | 'resource' | 'type'
      > & {
          metadata:
            | ({
                __typename?: 'CodeReferenceMetadata';
              } & CodeReferenceMetadataFragment)
            | { __typename?: 'ImageReferenceMetadata' }
            | ({
                __typename?: 'PreviewReferenceMetadata';
              } & PreviewReferenceMetadataFragment)
            | { __typename?: 'UserReferenceMetadata' };
        }
    >;
    references: Array<
      { __typename?: 'Reference' } & Pick<
        Reference,
        'id' | 'resource' | 'type'
      > & {
          metadata:
            | ({
                __typename?: 'CodeReferenceMetadata';
              } & CodeReferenceMetadataFragment)
            | ({
                __typename?: 'ImageReferenceMetadata';
              } & ImageReferenceMetadataFragment)
            | { __typename?: 'PreviewReferenceMetadata' }
            | ({
                __typename?: 'UserReferenceMetadata';
              } & UserReferenceMetadataFragment);
        }
    >;
    user: { __typename?: 'User' } & Pick<
      User,
      'id' | 'name' | 'username' | 'avatarUrl'
    >;
    parentComment: Maybe<{ __typename?: 'Comment' } & Pick<Comment, 'id'>>;
    comments: Array<{ __typename?: 'Comment' } & CommentFragment>;
  };

export type CreateCommentMutationVariables = Exact<{
  id: Maybe<Scalars['ID']>;
  content: Scalars['String'];
  sandboxId: Scalars['ID'];
  parentCommentId: Maybe<Scalars['ID']>;
  userReferences: Maybe<Array<UserReference>>;
  codeReferences: Maybe<Array<CodeReference>>;
  imageReferences: Maybe<Array<ImageReference>>;
}>;

export type CreateCommentMutation = { __typename?: 'RootMutationType' } & {
  createComment: { __typename?: 'Comment' } & CommentFragment;
};

export type CreateCodeCommentMutationVariables = Exact<{
  id: Maybe<Scalars['ID']>;
  content: Scalars['String'];
  sandboxId: Scalars['ID'];
  parentCommentId: Maybe<Scalars['ID']>;
  anchorReference: CodeReference;
  userReferences: Maybe<Array<UserReference>>;
  codeReferences: Maybe<Array<CodeReference>>;
  imageReferences: Maybe<Array<ImageReference>>;
}>;

export type CreateCodeCommentMutation = { __typename?: 'RootMutationType' } & {
  createCodeComment: { __typename?: 'Comment' } & CommentFragment;
};

export type CreatePreviewCommentMutationVariables = Exact<{
  id: Maybe<Scalars['ID']>;
  content: Scalars['String'];
  sandboxId: Scalars['ID'];
  parentCommentId: Maybe<Scalars['ID']>;
  anchorReference: PreviewReference;
  userReferences: Maybe<Array<UserReference>>;
  codeReferences: Maybe<Array<CodeReference>>;
  imageReferences: Maybe<Array<ImageReference>>;
}>;

export type CreatePreviewCommentMutation = {
  __typename?: 'RootMutationType';
} & { createPreviewComment: { __typename?: 'Comment' } & CommentFragment };

export type DeleteCommentMutationVariables = Exact<{
  commentId: Scalars['UUID4'];
  sandboxId: Scalars['ID'];
}>;

export type DeleteCommentMutation = { __typename?: 'RootMutationType' } & {
  deleteComment: { __typename?: 'Comment' } & Pick<Comment, 'id'>;
};

export type UpdateCommentMutationVariables = Exact<{
  commentId: Scalars['UUID4'];
  sandboxId: Scalars['ID'];
  content: Maybe<Scalars['String']>;
  userReferences: Maybe<Array<UserReference>>;
  codeReferences: Maybe<Array<CodeReference>>;
  imageReferences: Maybe<Array<ImageReference>>;
}>;

export type UpdateCommentMutation = { __typename?: 'RootMutationType' } & {
  updateComment: { __typename?: 'Comment' } & Pick<Comment, 'id'>;
};

export type ResolveCommentMutationVariables = Exact<{
  commentId: Scalars['UUID4'];
  sandboxId: Scalars['ID'];
}>;

export type ResolveCommentMutation = { __typename?: 'RootMutationType' } & {
  resolveComment: { __typename?: 'Comment' } & Pick<Comment, 'id'>;
};

export type UnresolveCommentMutationVariables = Exact<{
  commentId: Scalars['UUID4'];
  sandboxId: Scalars['ID'];
}>;

export type UnresolveCommentMutation = { __typename?: 'RootMutationType' } & {
  unresolveComment: { __typename?: 'Comment' } & Pick<Comment, 'id'>;
};

export type SandboxCommentQueryVariables = Exact<{
  sandboxId: Scalars['ID'];
  commentId: Scalars['UUID4'];
}>;

export type SandboxCommentQuery = { __typename?: 'RootQueryType' } & {
  sandbox: Maybe<
    { __typename?: 'Sandbox' } & {
      comment: Maybe<{ __typename?: 'Comment' } & CommentWithRepliesFragment>;
    }
  >;
};

export type SandboxCommentsQueryVariables = Exact<{
  sandboxId: Scalars['ID'];
}>;

export type SandboxCommentsQuery = { __typename?: 'RootQueryType' } & {
  sandbox: Maybe<
    { __typename?: 'Sandbox' } & {
      comments: Array<{ __typename?: 'Comment' } & CommentFragment>;
    }
  >;
};

export type CommentAddedSubscriptionVariables = Exact<{
  sandboxId: Scalars['ID'];
}>;

export type CommentAddedSubscription = {
  __typename?: 'RootSubscriptionType';
} & {
  commentAdded: { __typename?: 'Comment' } & {
    sandbox: { __typename?: 'Sandbox' } & Pick<Sandbox, 'id'>;
  } & CommentFragment;
};

export type CommentChangedSubscriptionVariables = Exact<{
  sandboxId: Scalars['ID'];
}>;

export type CommentChangedSubscription = {
  __typename?: 'RootSubscriptionType';
} & {
  commentChanged: { __typename?: 'Comment' } & {
    sandbox: { __typename?: 'Sandbox' } & Pick<Sandbox, 'id'>;
  } & CommentFragment;
};

export type CommentRemovedSubscriptionVariables = Exact<{
  sandboxId: Scalars['ID'];
}>;

export type CommentRemovedSubscription = {
  __typename?: 'RootSubscriptionType';
} & {
  commentRemoved: { __typename?: 'Comment' } & {
    sandbox: { __typename?: 'Sandbox' } & Pick<Sandbox, 'id'>;
  } & CommentFragment;
};

export type SandboxFragmentDashboardFragment = {
  __typename?: 'Sandbox';
} & Pick<
  Sandbox,
  | 'id'
  | 'alias'
  | 'title'
  | 'description'
  | 'insertedAt'
  | 'updatedAt'
  | 'removedAt'
  | 'privacy'
  | 'isFrozen'
  | 'screenshotUrl'
  | 'screenshotOutdated'
  | 'viewCount'
  | 'likeCount'
  | 'alwaysOn'
  | 'authorId'
  | 'teamId'
> & {
    source: { __typename?: 'Source' } & Pick<Source, 'template'>;
    customTemplate: Maybe<{ __typename?: 'Template' } & Pick<Template, 'id'>>;
    forkedTemplate: Maybe<
      { __typename?: 'Template' } & Pick<Template, 'id' | 'color' | 'iconUrl'>
    >;
    collection: Maybe<{ __typename?: 'Collection' } & Pick<Collection, 'path'>>;
    permissions: Maybe<
      { __typename?: 'SandboxProtectionSettings' } & Pick<
        SandboxProtectionSettings,
        'preventSandboxLeaving' | 'preventSandboxExport'
      >
    >;
  };

export type RepoFragmentDashboardFragment = { __typename?: 'Sandbox' } & Pick<
  Sandbox,
  'prNumber'
> & {
    baseGit: Maybe<
      { __typename?: 'Git' } & Pick<
        Git,
        'branch' | 'id' | 'repo' | 'username' | 'path'
      >
    >;
    originalGit: Maybe<
      { __typename?: 'Git' } & Pick<
        Git,
        'branch' | 'id' | 'repo' | 'username' | 'path'
      >
    >;
  } & SandboxFragmentDashboardFragment;

export type SidebarCollectionDashboardFragment = {
  __typename?: 'Collection';
} & Pick<Collection, 'id' | 'path' | 'sandboxCount'>;

export type TemplateFragmentDashboardFragment = {
  __typename?: 'Template';
} & Pick<Template, 'id' | 'color' | 'iconUrl' | 'published'> & {
    sandbox: Maybe<
      { __typename?: 'Sandbox' } & {
        git: Maybe<
          { __typename?: 'Git' } & Pick<
            Git,
            'id' | 'username' | 'commitSha' | 'path' | 'repo' | 'branch'
          >
        >;
        team: Maybe<{ __typename?: 'Team' } & Pick<Team, 'name'>>;
        author: Maybe<{ __typename?: 'User' } & Pick<User, 'username'>>;
        source: { __typename?: 'Source' } & Pick<Source, 'template'>;
      } & SandboxFragmentDashboardFragment
    >;
  };

export type TeamFragmentDashboardFragment = { __typename?: 'Team' } & Pick<
  Team,
  'id' | 'name' | 'description' | 'creatorId' | 'avatarUrl' | 'joinedPilotAt'
> & {
    settings: Maybe<
      { __typename?: 'WorkspaceSandboxSettings' } & Pick<
        WorkspaceSandboxSettings,
        'minimumPrivacy'
      >
    >;
    userAuthorizations: Array<
      { __typename?: 'UserAuthorization' } & Pick<
        UserAuthorization,
        'userId' | 'authorization'
      >
    >;
    users: Array<
      { __typename?: 'User' } & Pick<
        User,
        'id' | 'name' | 'username' | 'avatarUrl'
      >
    >;
    invitees: Array<
      { __typename?: 'User' } & Pick<
        User,
        'id' | 'name' | 'username' | 'avatarUrl'
      >
    >;
    subscription: Maybe<
      { __typename?: 'ProSubscription' } & Pick<
        ProSubscription,
        'origin' | 'type' | 'paymentProvider'
      >
    >;
  };

export type CurrentTeamInfoFragmentFragment = { __typename?: 'Team' } & Pick<
  Team,
  | 'id'
  | 'creatorId'
  | 'description'
  | 'inviteToken'
  | 'joinedPilotAt'
  | 'name'
  | 'avatarUrl'
> & {
    users: Array<
      { __typename?: 'User' } & Pick<User, 'id' | 'avatarUrl' | 'username'>
    >;
    invitees: Array<
      { __typename?: 'User' } & Pick<User, 'id' | 'avatarUrl' | 'username'>
    >;
    userAuthorizations: Array<
      { __typename?: 'UserAuthorization' } & Pick<
        UserAuthorization,
        'userId' | 'authorization'
      >
    >;
    settings: Maybe<
      { __typename?: 'WorkspaceSandboxSettings' } & Pick<
        WorkspaceSandboxSettings,
        | 'minimumPrivacy'
        | 'preventSandboxExport'
        | 'preventSandboxLeaving'
        | 'defaultAuthorization'
      >
    >;
    subscription: Maybe<
      { __typename?: 'ProSubscription' } & Pick<
        ProSubscription,
        | 'id'
        | 'type'
        | 'status'
        | 'origin'
        | 'quantity'
        | 'unitPrice'
        | 'currency'
        | 'billingInterval'
        | 'updateBillingUrl'
        | 'nextBillDate'
        | 'paymentProvider'
        | 'cancelAt'
      >
    >;
  };

export type NpmRegistryFragment = { __typename?: 'PrivateRegistry' } & Pick<
  PrivateRegistry,
  | 'id'
  | 'authType'
  | 'enabledScopes'
  | 'limitToScopes'
  | 'proxyEnabled'
  | 'registryAuthKey'
  | 'registryType'
  | 'registryUrl'
  | 'teamId'
>;

export type BranchFragment = { __typename?: 'Branch' } & Pick<
  Branch,
  'id' | 'name' | 'contribution' | 'lastAccessedAt'
> & {
    project: { __typename?: 'Project' } & {
      repository: { __typename?: 'GitHubRepository' } & Pick<
        GitHubRepository,
        'name' | 'owner'
      >;
    };
  };

export type ProjectFragment = { __typename?: 'Project' } & {
  branches: Array<{ __typename?: 'Branch' } & BranchFragment>;
  repository: { __typename?: 'GitHubRepository' } & Pick<
    GitHubRepository,
    'owner' | 'name'
  >;
};

export type _CreateTeamMutationVariables = Exact<{
  name: Scalars['String'];
  pilot: Maybe<Scalars['Boolean']>;
}>;

export type _CreateTeamMutation = { __typename?: 'RootMutationType' } & {
  createTeam: { __typename?: 'Team' } & TeamFragmentDashboardFragment;
};

export type CreateFolderMutationVariables = Exact<{
  path: Scalars['String'];
  teamId: Maybe<Scalars['UUID4']>;
}>;

export type CreateFolderMutation = { __typename?: 'RootMutationType' } & {
  createCollection: {
    __typename?: 'Collection';
  } & SidebarCollectionDashboardFragment;
};

export type DeleteFolderMutationVariables = Exact<{
  path: Scalars['String'];
  teamId: Maybe<Scalars['UUID4']>;
}>;

export type DeleteFolderMutation = { __typename?: 'RootMutationType' } & {
  deleteCollection: Array<
    { __typename?: 'Collection' } & SidebarCollectionDashboardFragment
  >;
};

export type RenameFolderMutationVariables = Exact<{
  path: Scalars['String'];
  newPath: Scalars['String'];
  teamId: Maybe<Scalars['UUID4']>;
  newTeamId: Maybe<Scalars['UUID4']>;
}>;

export type RenameFolderMutation = { __typename?: 'RootMutationType' } & {
  renameCollection: Array<
    { __typename?: 'Collection' } & SidebarCollectionDashboardFragment
  >;
};

export type AddToFolderMutationVariables = Exact<{
  collectionPath: Maybe<Scalars['String']>;
  sandboxIds: Array<Scalars['ID']>;
  teamId: Maybe<Scalars['UUID4']>;
}>;

export type AddToFolderMutation = { __typename?: 'RootMutationType' } & {
  addToCollectionOrTeam: Array<
    Maybe<{ __typename?: 'Sandbox' } & SandboxFragmentDashboardFragment>
  >;
};

export type MoveToTrashMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']>;
}>;

export type MoveToTrashMutation = { __typename?: 'RootMutationType' } & {
  deleteSandboxes: Array<
    { __typename?: 'Sandbox' } & SandboxFragmentDashboardFragment
  >;
};

export type ChangePrivacyMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']>;
  privacy: Scalars['Int'];
}>;

export type ChangePrivacyMutation = { __typename?: 'RootMutationType' } & {
  setSandboxesPrivacy: Array<
    { __typename?: 'Sandbox' } & SandboxFragmentDashboardFragment
  >;
};

export type ChangeFrozenMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']>;
  isFrozen: Scalars['Boolean'];
}>;

export type ChangeFrozenMutation = { __typename?: 'RootMutationType' } & {
  setSandboxesFrozen: Array<
    { __typename?: 'Sandbox' } & SandboxFragmentDashboardFragment
  >;
};

export type _RenameSandboxMutationVariables = Exact<{
  id: Scalars['ID'];
  title: Scalars['String'];
}>;

export type _RenameSandboxMutation = { __typename?: 'RootMutationType' } & {
  renameSandbox: { __typename?: 'Sandbox' } & SandboxFragmentDashboardFragment;
};

export type _PermanentlyDeleteSandboxesMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']>;
}>;

export type _PermanentlyDeleteSandboxesMutation = {
  __typename?: 'RootMutationType';
} & {
  permanentlyDeleteSandboxes: Array<
    { __typename?: 'Sandbox' } & Pick<Sandbox, 'id'>
  >;
};

export type _LeaveTeamMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type _LeaveTeamMutation = { __typename?: 'RootMutationType' } & Pick<
  RootMutationType,
  'leaveTeam'
>;

export type _RemoveFromTeamMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  userId: Scalars['UUID4'];
}>;

export type _RemoveFromTeamMutation = { __typename?: 'RootMutationType' } & {
  removeFromTeam: { __typename?: 'Team' } & TeamFragmentDashboardFragment;
};

export type _InviteToTeamMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  username: Scalars['String'];
  authorization: Maybe<TeamMemberAuthorization>;
}>;

export type _InviteToTeamMutation = { __typename?: 'RootMutationType' } & {
  inviteToTeam: { __typename?: 'Team' } & CurrentTeamInfoFragmentFragment;
};

export type _InviteToTeamViaEmailMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  email: Scalars['String'];
  authorization: Maybe<TeamMemberAuthorization>;
}>;

export type _InviteToTeamViaEmailMutation = {
  __typename?: 'RootMutationType';
} & Pick<RootMutationType, 'inviteToTeamViaEmail'>;

export type _RevokeTeamInvitationMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  userId: Scalars['UUID4'];
}>;

export type _RevokeTeamInvitationMutation = {
  __typename?: 'RootMutationType';
} & {
  revokeTeamInvitation: {
    __typename?: 'Team';
  } & CurrentTeamInfoFragmentFragment;
};

export type _AcceptTeamInvitationMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type _AcceptTeamInvitationMutation = {
  __typename?: 'RootMutationType';
} & {
  acceptTeamInvitation: { __typename?: 'Team' } & TeamFragmentDashboardFragment;
};

export type _RejectTeamInvitationMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type _RejectTeamInvitationMutation = {
  __typename?: 'RootMutationType';
} & Pick<RootMutationType, 'rejectTeamInvitation'>;

export type _SetTeamDescriptionMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  description: Scalars['String'];
}>;

export type _SetTeamDescriptionMutation = {
  __typename?: 'RootMutationType';
} & {
  setTeamDescription: { __typename?: 'Team' } & TeamFragmentDashboardFragment;
};

export type _UnmakeSandboxesTemplateMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']>;
}>;

export type _UnmakeSandboxesTemplateMutation = {
  __typename?: 'RootMutationType';
} & {
  unmakeSandboxesTemplates: Array<
    { __typename?: 'Template' } & Pick<Template, 'id'>
  >;
};

export type _MakeSandboxesTemplateMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']>;
}>;

export type _MakeSandboxesTemplateMutation = {
  __typename?: 'RootMutationType';
} & {
  makeSandboxesTemplates: Array<
    { __typename?: 'Template' } & Pick<Template, 'id'>
  >;
};

export type _SetTeamNameMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  name: Scalars['String'];
}>;

export type _SetTeamNameMutation = { __typename?: 'RootMutationType' } & {
  setTeamName: { __typename?: 'Team' } & TeamFragmentDashboardFragment;
};

export type ChangeTeamMemberAuthorizationMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  userId: Scalars['UUID4'];
  authorization: TeamMemberAuthorization;
}>;

export type ChangeTeamMemberAuthorizationMutation = {
  __typename?: 'RootMutationType';
} & {
  changeTeamMemberAuthorizations: { __typename?: 'Team' } & Pick<Team, 'id'>;
};

export type CreateOrUpdateNpmRegistryMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  registryType: RegistryType;
  registryUrl: Maybe<Scalars['String']>;
  registryAuthKey: Scalars['String'];
  registryAuthType: Maybe<AuthType>;
  proxyEnabled: Scalars['Boolean'];
  limitToScopes: Scalars['Boolean'];
  enabledScopes: Array<Scalars['String']>;
}>;

export type CreateOrUpdateNpmRegistryMutation = {
  __typename?: 'RootMutationType';
} & {
  createOrUpdatePrivateNpmRegistry: {
    __typename?: 'PrivateRegistry';
  } & NpmRegistryFragment;
};

export type DeleteNpmRegistryMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type DeleteNpmRegistryMutation = { __typename?: 'RootMutationType' } & {
  deletePrivateNpmRegistry: Maybe<
    { __typename?: 'PrivateRegistry' } & NpmRegistryFragment
  >;
};

export type DeleteWorkspaceMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type DeleteWorkspaceMutation = {
  __typename?: 'RootMutationType';
} & Pick<RootMutationType, 'deleteWorkspace'>;

export type SetTeamMinimumPrivacyMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  minimumPrivacy: Scalars['Int'];
  updateDrafts: Scalars['Boolean'];
}>;

export type SetTeamMinimumPrivacyMutation = {
  __typename?: 'RootMutationType';
} & {
  setTeamMinimumPrivacy: { __typename?: 'WorkspaceSandboxSettings' } & Pick<
    WorkspaceSandboxSettings,
    'minimumPrivacy'
  >;
};

export type SetSandboxAlwaysOnMutationVariables = Exact<{
  sandboxId: Scalars['ID'];
  alwaysOn: Scalars['Boolean'];
}>;

export type SetSandboxAlwaysOnMutation = { __typename?: 'RootMutationType' } & {
  setSandboxAlwaysOn: {
    __typename?: 'Sandbox';
  } & SandboxFragmentDashboardFragment;
};

export type SetWorkspaceSandboxSettingsMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  preventSandboxLeaving: Scalars['Boolean'];
  preventSandboxExport: Scalars['Boolean'];
}>;

export type SetWorkspaceSandboxSettingsMutation = {
  __typename?: 'RootMutationType';
} & {
  setWorkspaceSandboxSettings: {
    __typename?: 'WorkspaceSandboxSettings';
  } & Pick<
    WorkspaceSandboxSettings,
    'preventSandboxLeaving' | 'preventSandboxExport'
  >;
};

export type SetPreventSandboxesLeavingWorkspaceMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']>;
  preventSandboxLeaving: Scalars['Boolean'];
}>;

export type SetPreventSandboxesLeavingWorkspaceMutation = {
  __typename?: 'RootMutationType';
} & {
  setPreventSandboxesLeavingWorkspace: Array<
    { __typename?: 'Sandbox' } & Pick<Sandbox, 'id'>
  >;
};

export type SetPreventSandboxesExportMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']>;
  preventSandboxExport: Scalars['Boolean'];
}>;

export type SetPreventSandboxesExportMutation = {
  __typename?: 'RootMutationType';
} & {
  setPreventSandboxesExport: Array<
    { __typename?: 'Sandbox' } & Pick<Sandbox, 'id'>
  >;
};

export type SetDefaultTeamMemberAuthorizationMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  defaultAuthorization: TeamMemberAuthorization;
}>;

export type SetDefaultTeamMemberAuthorizationMutation = {
  __typename?: 'RootMutationType';
} & {
  setDefaultTeamMemberAuthorization: {
    __typename?: 'WorkspaceSandboxSettings';
  } & Pick<WorkspaceSandboxSettings, 'defaultAuthorization'>;
};

export type DeleteCurrentUserMutationVariables = Exact<{
  [key: string]: never;
}>;

export type DeleteCurrentUserMutation = {
  __typename?: 'RootMutationType';
} & Pick<RootMutationType, 'deleteCurrentUser'>;

export type CancelDeleteCurrentUserMutationVariables = Exact<{
  [key: string]: never;
}>;

export type CancelDeleteCurrentUserMutation = {
  __typename?: 'RootMutationType';
} & Pick<RootMutationType, 'cancelDeleteCurrentUser'>;

export type UpdateSubscriptionBillingIntervalMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  subscriptionId: Scalars['UUID4'];
  billingInterval: SubscriptionInterval;
}>;

export type UpdateSubscriptionBillingIntervalMutation = {
  __typename?: 'RootMutationType';
} & {
  updateSubscriptionBillingInterval: { __typename?: 'ProSubscription' } & Pick<
    ProSubscription,
    'id'
  >;
};

export type PreviewUpdateSubscriptionBillingIntervalMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  subscriptionId: Scalars['UUID4'];
  billingInterval: SubscriptionInterval;
}>;

export type PreviewUpdateSubscriptionBillingIntervalMutation = {
  __typename?: 'RootMutationType';
} & {
  previewUpdateSubscriptionBillingInterval: {
    __typename?: 'BillingPreview';
  } & {
    immediatePayment: Maybe<
      { __typename?: 'BillingDetails' } & Pick<
        BillingDetails,
        'amount' | 'currency'
      >
    >;
    nextPayment: Maybe<
      { __typename?: 'BillingDetails' } & Pick<
        BillingDetails,
        'amount' | 'currency'
      >
    >;
  };
};

export type SoftCancelSubscriptionMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  subscriptionId: Scalars['UUID4'];
}>;

export type SoftCancelSubscriptionMutation = {
  __typename?: 'RootMutationType';
} & {
  softCancelSubscription: { __typename?: 'ProSubscription' } & Pick<
    ProSubscription,
    'id' | 'cancelAt'
  >;
};

export type ReactivateSubscriptionMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  subscriptionId: Scalars['UUID4'];
}>;

export type ReactivateSubscriptionMutation = {
  __typename?: 'RootMutationType';
} & {
  reactivateSubscription: { __typename?: 'ProSubscription' } & Pick<
    ProSubscription,
    'id'
  >;
};

export type UpdateCurrentUserMutationVariables = Exact<{
  username: Scalars['String'];
  name: Maybe<Scalars['String']>;
  bio: Maybe<Scalars['String']>;
  socialLinks: Maybe<Array<Scalars['String']>>;
}>;

export type UpdateCurrentUserMutation = { __typename?: 'RootMutationType' } & {
  updateCurrentUser: { __typename?: 'User' } & Pick<
    User,
    'username' | 'name' | 'bio' | 'socialLinks'
  >;
};

export type AddSandboxesToAlbumMutationVariables = Exact<{
  albumId: Scalars['ID'];
  sandboxIds: Array<Scalars['ID']>;
}>;

export type AddSandboxesToAlbumMutation = {
  __typename?: 'RootMutationType';
} & {
  addSandboxesToAlbum: Maybe<{ __typename?: 'Album' } & Pick<Album, 'id'>>;
};

export type RemoveSandboxesFromAlbumMutationVariables = Exact<{
  albumId: Scalars['ID'];
  sandboxIds: Array<Scalars['ID']>;
}>;

export type RemoveSandboxesFromAlbumMutation = {
  __typename?: 'RootMutationType';
} & {
  removeSandboxesFromAlbum: Maybe<{ __typename?: 'Album' } & Pick<Album, 'id'>>;
};

export type CreateAlbumMutationVariables = Exact<{
  title: Scalars['String'];
}>;

export type CreateAlbumMutation = { __typename?: 'RootMutationType' } & {
  createAlbum: { __typename?: 'Album' } & Pick<Album, 'id' | 'title'>;
};

export type UpdateAlbumMutationVariables = Exact<{
  id: Scalars['ID'];
  title: Scalars['String'];
}>;

export type UpdateAlbumMutation = { __typename?: 'RootMutationType' } & {
  updateAlbum: { __typename?: 'Album' } & Pick<Album, 'id'>;
};

export type RecentlyDeletedPersonalSandboxesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type RecentlyDeletedPersonalSandboxesQuery = {
  __typename?: 'RootQueryType';
} & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      sandboxes: Array<
        { __typename?: 'Sandbox' } & SandboxFragmentDashboardFragment
      >;
    }
  >;
};

export type RecentlyDeletedTeamSandboxesQueryVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type RecentlyDeletedTeamSandboxesQuery = {
  __typename?: 'RootQueryType';
} & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      team: Maybe<
        { __typename?: 'Team' } & {
          sandboxes: Array<
            { __typename?: 'Sandbox' } & SandboxFragmentDashboardFragment
          >;
        }
      >;
    }
  >;
};

export type SandboxesByPathQueryVariables = Exact<{
  path: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
}>;

export type SandboxesByPathQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      collections: Array<
        { __typename?: 'Collection' } & SidebarCollectionDashboardFragment
      >;
      collection: Maybe<
        { __typename?: 'Collection' } & Pick<Collection, 'id' | 'path'> & {
            sandboxes: Array<
              { __typename?: 'Sandbox' } & SandboxFragmentDashboardFragment
            >;
          }
      >;
    }
  >;
};

export type TeamDraftsQueryVariables = Exact<{
  teamId: Scalars['UUID4'];
  authorId: Maybe<Scalars['UUID4']>;
}>;

export type TeamDraftsQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      team: Maybe<
        { __typename?: 'Team' } & {
          drafts: Array<
            { __typename?: 'Sandbox' } & SandboxFragmentDashboardFragment
          >;
        }
      >;
    }
  >;
};

export type AllCollectionsQueryVariables = Exact<{
  teamId: Maybe<Scalars['ID']>;
}>;

export type AllCollectionsQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      collections: Array<
        { __typename?: 'Collection' } & SidebarCollectionDashboardFragment
      >;
    }
  >;
};

export type GetPersonalReposQueryVariables = Exact<{ [key: string]: never }>;

export type GetPersonalReposQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      sandboxes: Array<
        { __typename?: 'Sandbox' } & RepoFragmentDashboardFragment
      >;
    }
  >;
};

export type GetTeamReposQueryVariables = Exact<{
  id: Scalars['UUID4'];
}>;

export type GetTeamReposQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      team: Maybe<
        { __typename?: 'Team' } & {
          sandboxes: Array<
            { __typename?: 'Sandbox' } & RepoFragmentDashboardFragment
          >;
        }
      >;
    }
  >;
};

export type TeamTemplatesQueryVariables = Exact<{
  id: Scalars['UUID4'];
}>;

export type TeamTemplatesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      team: Maybe<
        { __typename?: 'Team' } & Pick<Team, 'id' | 'name'> & {
            templates: Array<
              { __typename?: 'Template' } & TemplateFragmentDashboardFragment
            >;
          }
      >;
    }
  >;
};

export type OwnedTemplatesQueryVariables = Exact<{
  showAll: Maybe<Scalars['Boolean']>;
}>;

export type OwnedTemplatesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      templates: Array<
        { __typename?: 'Template' } & TemplateFragmentDashboardFragment
      >;
    }
  >;
};

export type AllTeamsQueryVariables = Exact<{ [key: string]: never }>;

export type AllTeamsQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & Pick<
      CurrentUser,
      'personalWorkspaceId'
    > & {
        workspaces: Array<
          { __typename?: 'Team' } & TeamFragmentDashboardFragment
        >;
      }
  >;
};

export type _SearchPersonalSandboxesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type _SearchPersonalSandboxesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      sandboxes: Array<
        { __typename?: 'Sandbox' } & SandboxFragmentDashboardFragment
      >;
    }
  >;
};

export type _SearchTeamSandboxesQueryVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type _SearchTeamSandboxesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      team: Maybe<
        { __typename?: 'Team' } & {
          sandboxes: Array<
            { __typename?: 'Sandbox' } & SandboxFragmentDashboardFragment
          >;
        }
      >;
    }
  >;
};

export type ListUserTemplatesQueryVariables = Exact<{
  teamId: Maybe<Scalars['UUID4']>;
}>;

export type ListUserTemplatesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & Pick<CurrentUser, 'id'> & {
        templates: Array<
          { __typename?: 'Template' } & TemplateFragmentDashboardFragment
        >;
        recentlyUsedTemplates: Array<
          { __typename?: 'Template' } & TemplateFragmentDashboardFragment
        >;
        bookmarkedTemplates: Array<
          { __typename?: 'Template' } & TemplateFragmentDashboardFragment
        >;
        teams: Array<
          { __typename?: 'Team' } & Pick<Team, 'id' | 'name'> & {
              bookmarkedTemplates: Array<
                { __typename?: 'Template' } & TemplateFragmentDashboardFragment
              >;
              templates: Array<
                { __typename?: 'Template' } & TemplateFragmentDashboardFragment
              >;
            }
        >;
      }
  >;
};

export type LatestSandboxesQueryVariables = Exact<{
  limit: Scalars['Int'];
  orderField: Scalars['String'];
  orderDirection: Direction;
}>;

export type LatestSandboxesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      sandboxes: Array<
        { __typename?: 'Sandbox' } & SandboxFragmentDashboardFragment
      >;
    }
  >;
};

export type RecentlyAccessedSandboxesQueryVariables = Exact<{
  limit: Scalars['Int'];
  teamId: Maybe<Scalars['UUID4']>;
}>;

export type RecentlyAccessedSandboxesQuery = {
  __typename?: 'RootQueryType';
} & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      recentlyAccessedSandboxes: Array<
        { __typename?: 'Sandbox' } & SandboxFragmentDashboardFragment
      >;
    }
  >;
};

export type RecentlyAccessedBranchesQueryVariables = Exact<{
  limit: Scalars['Int'];
}>;

export type RecentlyAccessedBranchesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      recentBranches: Array<{ __typename?: 'Branch' } & BranchFragment>;
    }
  >;
};

export type SharedWithMeSandboxesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type SharedWithMeSandboxesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      collaboratorSandboxes: Array<
        { __typename?: 'Sandbox' } & SandboxFragmentDashboardFragment
      >;
    }
  >;
};

export type LikedSandboxesQueryVariables = Exact<{ [key: string]: never }>;

export type LikedSandboxesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      likedSandboxes: Array<
        { __typename?: 'Sandbox' } & SandboxFragmentDashboardFragment
      >;
    }
  >;
};

export type LatestTeamSandboxesQueryVariables = Exact<{
  limit: Scalars['Int'];
  orderField: Scalars['String'];
  orderDirection: Direction;
  teamId: Scalars['UUID4'];
}>;

export type LatestTeamSandboxesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      team: Maybe<
        { __typename?: 'Team' } & {
          sandboxes: Array<
            { __typename?: 'Sandbox' } & SandboxFragmentDashboardFragment
          >;
        }
      >;
    }
  >;
};

export type GetTeamQueryVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type GetTeamQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      team: Maybe<{ __typename?: 'Team' } & CurrentTeamInfoFragmentFragment>;
    }
  >;
};

export type GetPersonalWorkspaceIdQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetPersonalWorkspaceIdQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & Pick<CurrentUser, 'personalWorkspaceId'>
  >;
};

export type GetPrivateNpmRegistryQueryVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type GetPrivateNpmRegistryQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      team: Maybe<
        { __typename?: 'Team' } & {
          privateRegistry: Maybe<
            { __typename?: 'PrivateRegistry' } & NpmRegistryFragment
          >;
        }
      >;
    }
  >;
};

export type _AlwaysOnTeamSandboxesQueryVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type _AlwaysOnTeamSandboxesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      team: Maybe<
        { __typename?: 'Team' } & {
          sandboxes: Array<
            { __typename?: 'Sandbox' } & SandboxFragmentDashboardFragment
          >;
        }
      >;
    }
  >;
};

export type CuratedAlbumsQueryVariables = Exact<{ [key: string]: never }>;

export type CuratedAlbumsQuery = { __typename?: 'RootQueryType' } & {
  curatedAlbums: Array<
    { __typename?: 'Album' } & Pick<Album, 'id' | 'title'> & {
        sandboxes: Array<
          { __typename?: 'Sandbox' } & Pick<
            Sandbox,
            'forkCount' | 'likeCount'
          > & {
              author: Maybe<
                { __typename?: 'User' } & Pick<User, 'username' | 'avatarUrl'>
              >;
            } & SandboxFragmentDashboardFragment
        >;
      }
  >;
};

export type ContributionBranchesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type ContributionBranchesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      recentBranches: Array<{ __typename?: 'Branch' } & BranchFragment>;
    }
  >;
};

export type RepositoriesByTeamQueryVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type RepositoriesByTeamQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      team: Maybe<
        { __typename?: 'Team' } & Pick<Team, 'id' | 'name'> & {
            projects: Array<{ __typename?: 'Project' } & ProjectFragment>;
          }
      >;
    }
  >;
};

export type RecentNotificationFragment = { __typename?: 'Notification' } & Pick<
  Notification,
  'id' | 'type' | 'data' | 'insertedAt' | 'read'
>;

export type UpdateNotificationPreferencesMutationVariables = Exact<{
  emailCommentMention: Maybe<Scalars['Boolean']>;
  emailCommentReply: Maybe<Scalars['Boolean']>;
  emailNewComment: Maybe<Scalars['Boolean']>;
}>;

export type UpdateNotificationPreferencesMutation = {
  __typename?: 'RootMutationType';
} & {
  updateNotificationPreferences: {
    __typename?: 'NotificationPreferences';
  } & Pick<
    NotificationPreferences,
    'emailCommentMention' | 'emailCommentReply' | 'emailNewComment'
  >;
};

export type MarkNotificationsAsReadMutationVariables = Exact<{
  [key: string]: never;
}>;

export type MarkNotificationsAsReadMutation = {
  __typename?: 'RootMutationType';
} & { markAllNotificationsAsRead: { __typename?: 'User' } & Pick<User, 'id'> };

export type ArchiveAllNotificationsMutationVariables = Exact<{
  [key: string]: never;
}>;

export type ArchiveAllNotificationsMutation = {
  __typename?: 'RootMutationType';
} & { archiveAllNotifications: { __typename?: 'User' } & Pick<User, 'id'> };

export type UpdateNotificationReadStatusMutationVariables = Exact<{
  notificationId: Scalars['UUID4'];
  read: Scalars['Boolean'];
}>;

export type UpdateNotificationReadStatusMutation = {
  __typename?: 'RootMutationType';
} & {
  updateNotificationReadStatus: { __typename?: 'Notification' } & Pick<
    Notification,
    'id'
  >;
};

export type ArchiveNotificationMutationVariables = Exact<{
  notificationId: Scalars['UUID4'];
}>;

export type ArchiveNotificationMutation = {
  __typename?: 'RootMutationType';
} & {
  archiveNotification: { __typename?: 'Notification' } & Pick<
    Notification,
    'id'
  >;
};

export type ClearNotificationCountMutationVariables = Exact<{
  [key: string]: never;
}>;

export type ClearNotificationCountMutation = {
  __typename?: 'RootMutationType';
} & { clearNotificationCount: { __typename?: 'User' } & Pick<User, 'id'> };

export type EmailPreferencesQueryVariables = Exact<{ [key: string]: never }>;

export type EmailPreferencesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      notificationPreferences: Maybe<
        { __typename?: 'NotificationPreferences' } & Pick<
          NotificationPreferences,
          'emailCommentMention' | 'emailCommentReply' | 'emailNewComment'
        >
      >;
    }
  >;
};

export type RecentNotificationsQueryVariables = Exact<{
  type: Maybe<Array<Maybe<Scalars['String']>>>;
}>;

export type RecentNotificationsQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      notifications: Array<
        { __typename?: 'Notification' } & RecentNotificationFragment
      >;
    }
  >;
};

export type TeamsQueryVariables = Exact<{ [key: string]: never }>;

export type TeamsQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      workspaces: Array<{ __typename?: 'Team' } & Pick<Team, 'id' | 'name'>>;
    }
  >;
};

export type SidebarCollectionFragment = { __typename?: 'Collection' } & Pick<
  Collection,
  'id' | 'path'
>;

export type SandboxFragment = { __typename?: 'Sandbox' } & Pick<
  Sandbox,
  | 'id'
  | 'alias'
  | 'title'
  | 'description'
  | 'insertedAt'
  | 'updatedAt'
  | 'removedAt'
  | 'privacy'
  | 'screenshotUrl'
  | 'screenshotOutdated'
  | 'teamId'
> & {
    source: { __typename?: 'Source' } & Pick<Source, 'template'>;
    customTemplate: Maybe<{ __typename?: 'Template' } & Pick<Template, 'id'>>;
    forkedTemplate: Maybe<
      { __typename?: 'Template' } & Pick<Template, 'id' | 'color'>
    >;
    collection: Maybe<
      { __typename?: 'Collection' } & Pick<Collection, 'path' | 'teamId'>
    >;
  };

export type TeamFragment = { __typename?: 'Team' } & Pick<
  Team,
  'id' | 'name' | 'inviteToken' | 'description' | 'creatorId'
> & {
    users: Array<
      { __typename?: 'User' } & Pick<
        User,
        'id' | 'name' | 'username' | 'avatarUrl'
      >
    >;
    invitees: Array<
      { __typename?: 'User' } & Pick<
        User,
        'id' | 'name' | 'username' | 'avatarUrl'
      >
    >;
  };

export type TeamsSidebarQueryVariables = Exact<{ [key: string]: never }>;

export type TeamsSidebarQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      teams: Array<{ __typename?: 'Team' } & Pick<Team, 'id' | 'name'>>;
    }
  >;
};

export type CreateTeamMutationVariables = Exact<{
  name: Scalars['String'];
}>;

export type CreateTeamMutation = { __typename?: 'RootMutationType' } & {
  createTeam: { __typename?: 'Team' } & TeamFragment;
};

export type PathedSandboxesFoldersQueryVariables = Exact<{
  teamId: Maybe<Scalars['ID']>;
}>;

export type PathedSandboxesFoldersQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      collections: Array<
        { __typename?: 'Collection' } & SidebarCollectionFragment
      >;
    }
  >;
};

export type CreateCollectionMutationVariables = Exact<{
  path: Scalars['String'];
  teamId: Maybe<Scalars['UUID4']>;
}>;

export type CreateCollectionMutation = { __typename?: 'RootMutationType' } & {
  createCollection: { __typename?: 'Collection' } & SidebarCollectionFragment;
};

export type DeleteCollectionMutationVariables = Exact<{
  path: Scalars['String'];
  teamId: Maybe<Scalars['UUID4']>;
}>;

export type DeleteCollectionMutation = { __typename?: 'RootMutationType' } & {
  deleteCollection: Array<
    { __typename?: 'Collection' } & SidebarCollectionFragment
  >;
};

export type RenameCollectionMutationVariables = Exact<{
  path: Scalars['String'];
  newPath: Scalars['String'];
  teamId: Maybe<Scalars['UUID4']>;
  newTeamId: Maybe<Scalars['UUID4']>;
}>;

export type RenameCollectionMutation = { __typename?: 'RootMutationType' } & {
  renameCollection: Array<
    { __typename?: 'Collection' } & SidebarCollectionFragment
  >;
};

export type AddToCollectionMutationVariables = Exact<{
  collectionPath: Maybe<Scalars['String']>;
  sandboxIds: Array<Scalars['ID']>;
  teamId: Maybe<Scalars['UUID4']>;
}>;

export type AddToCollectionMutation = { __typename?: 'RootMutationType' } & {
  addToCollectionOrTeam: Array<
    Maybe<{ __typename?: 'Sandbox' } & SandboxFragment>
  >;
};

export type DeleteSandboxesMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']>;
}>;

export type DeleteSandboxesMutation = { __typename?: 'RootMutationType' } & {
  deleteSandboxes: Array<{ __typename?: 'Sandbox' } & SandboxFragment>;
};

export type SetSandboxesPrivacyMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']>;
  privacy: Scalars['Int'];
}>;

export type SetSandboxesPrivacyMutation = {
  __typename?: 'RootMutationType';
} & {
  setSandboxesPrivacy: Array<{ __typename?: 'Sandbox' } & SandboxFragment>;
};

export type RenameSandboxMutationVariables = Exact<{
  id: Scalars['ID'];
  title: Scalars['String'];
}>;

export type RenameSandboxMutation = { __typename?: 'RootMutationType' } & {
  renameSandbox: { __typename?: 'Sandbox' } & SandboxFragment;
};

export type PermanentlyDeleteSandboxesMutationVariables = Exact<{
  sandboxIds: Array<Scalars['ID']>;
}>;

export type PermanentlyDeleteSandboxesMutation = {
  __typename?: 'RootMutationType';
} & {
  permanentlyDeleteSandboxes: Array<
    { __typename?: 'Sandbox' } & Pick<Sandbox, 'id'>
  >;
};

export type PathedSandboxesQueryVariables = Exact<{
  path: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
}>;

export type PathedSandboxesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      collections: Array<
        { __typename?: 'Collection' } & SidebarCollectionFragment
      >;
      collection: Maybe<
        { __typename?: 'Collection' } & Pick<Collection, 'id' | 'path'> & {
            sandboxes: Array<{ __typename?: 'Sandbox' } & SandboxFragment>;
          }
      >;
    }
  >;
};

export type RecentSandboxesQueryVariables = Exact<{
  orderField: Scalars['String'];
  orderDirection: Direction;
}>;

export type RecentSandboxesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      sandboxes: Array<{ __typename?: 'Sandbox' } & SandboxFragment>;
    }
  >;
};

export type SearchSandboxesQueryVariables = Exact<{ [key: string]: never }>;

export type SearchSandboxesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      sandboxes: Array<{ __typename?: 'Sandbox' } & SandboxFragment>;
    }
  >;
};

export type DeletedSandboxesQueryVariables = Exact<{ [key: string]: never }>;

export type DeletedSandboxesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      sandboxes: Array<{ __typename?: 'Sandbox' } & SandboxFragment>;
    }
  >;
};

export type TeamQueryVariables = Exact<{
  id: Scalars['UUID4'];
}>;

export type TeamQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      team: Maybe<{ __typename?: 'Team' } & TeamFragment>;
    }
  >;
};

export type LeaveTeamMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type LeaveTeamMutation = { __typename?: 'RootMutationType' } & Pick<
  RootMutationType,
  'leaveTeam'
>;

export type RemoveFromTeamMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  userId: Scalars['UUID4'];
}>;

export type RemoveFromTeamMutation = { __typename?: 'RootMutationType' } & {
  removeFromTeam: { __typename?: 'Team' } & TeamFragment;
};

export type InviteToTeamMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  username: Scalars['String'];
}>;

export type InviteToTeamMutation = { __typename?: 'RootMutationType' } & {
  inviteToTeam: { __typename?: 'Team' } & TeamFragment;
};

export type InviteToTeamViaEmailMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  email: Scalars['String'];
}>;

export type InviteToTeamViaEmailMutation = {
  __typename?: 'RootMutationType';
} & Pick<RootMutationType, 'inviteToTeamViaEmail'>;

export type RevokeTeamInvitationMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  userId: Scalars['UUID4'];
}>;

export type RevokeTeamInvitationMutation = {
  __typename?: 'RootMutationType';
} & { revokeTeamInvitation: { __typename?: 'Team' } & TeamFragment };

export type AcceptTeamInvitationMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type AcceptTeamInvitationMutation = {
  __typename?: 'RootMutationType';
} & { acceptTeamInvitation: { __typename?: 'Team' } & TeamFragment };

export type RejectTeamInvitationMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type RejectTeamInvitationMutation = {
  __typename?: 'RootMutationType';
} & Pick<RootMutationType, 'rejectTeamInvitation'>;

export type SetTeamDescriptionMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  description: Scalars['String'];
}>;

export type SetTeamDescriptionMutation = { __typename?: 'RootMutationType' } & {
  setTeamDescription: { __typename?: 'Team' } & TeamFragment;
};

export type SetTeamNameMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  name: Scalars['String'];
}>;

export type SetTeamNameMutation = { __typename?: 'RootMutationType' } & {
  setTeamName: { __typename?: 'Team' } & TeamFragment;
};

export type BookmarkTemplateMutationVariables = Exact<{
  template: Scalars['UUID4'];
  team: Maybe<Scalars['UUID4']>;
}>;

export type BookmarkTemplateMutation = { __typename?: 'RootMutationType' } & {
  template: Maybe<{ __typename?: 'Template' } & BookmarkTemplateFieldsFragment>;
};

export type UnbookmarkTemplateMutationVariables = Exact<{
  template: Scalars['UUID4'];
  team: Maybe<Scalars['UUID4']>;
}>;

export type UnbookmarkTemplateMutation = { __typename?: 'RootMutationType' } & {
  template: Maybe<{ __typename?: 'Template' } & BookmarkTemplateFieldsFragment>;
};

export type BookmarkTemplateFieldsFragment = { __typename?: 'Template' } & Pick<
  Template,
  'id'
> & {
    bookmarked: Maybe<
      Array<
        Maybe<
          { __typename?: 'Bookmarked' } & Pick<Bookmarked, 'isBookmarked'> & {
              entity: Maybe<
                | ({ __typename: 'Team' } & Pick<Team, 'id' | 'name'>)
                | ({ __typename: 'User' } & Pick<User, 'id'> & {
                      name: User['username'];
                    })
              >;
            }
        >
      >
    >;
  };

export type BookmarkedSandboxInfoQueryVariables = Exact<{
  sandboxId: Scalars['ID'];
}>;

export type BookmarkedSandboxInfoQuery = { __typename?: 'RootQueryType' } & {
  sandbox: Maybe<
    { __typename?: 'Sandbox' } & Pick<Sandbox, 'id'> & {
        author: Maybe<
          { __typename?: 'User' } & Pick<User, 'id'> & {
              name: User['username'];
            }
        >;
        customTemplate: Maybe<
          { __typename?: 'Template' } & BookmarkTemplateFieldsFragment
        >;
      }
  >;
};

export type TeamByTokenQueryVariables = Exact<{
  inviteToken: Scalars['String'];
}>;

export type TeamByTokenQuery = { __typename?: 'RootQueryType' } & {
  teamByToken: Maybe<{ __typename?: 'Team' } & Pick<Team, 'name'>>;
};

export type JoinTeamByTokenMutationVariables = Exact<{
  inviteToken: Scalars['String'];
}>;

export type JoinTeamByTokenMutation = { __typename?: 'RootMutationType' } & {
  redeemTeamInviteToken: { __typename?: 'Team' } & Pick<
    Team,
    'id' | 'name' | 'joinedPilotAt'
  >;
};
