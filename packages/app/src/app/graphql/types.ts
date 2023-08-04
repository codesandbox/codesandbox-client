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

/** Subscription update about active users connected to a branch */
export type BranchConnections = {
  __typename?: 'BranchConnections';
  branchId: Scalars['String'];
  connections: Array<Connection>;
};

/** Events related to a specific branch. */
export type BranchEvent =
  | PullRequestCommentEvent
  | PullRequestEvent
  | PullRequestReviewCommentEvent
  | PullRequestReviewEvent;

/** Subscription update about a commit made by CodeSandbox for a branch */
export type BranchLastCommit = {
  __typename?: 'BranchLastCommit';
  branchId: Scalars['String'];
  lastCommit: LastCommit;
};

/** Settings for this branch. Stored with the branch so does not incur an extra db query */
export type BranchSettings = {
  __typename?: 'BranchSettings';
  protected: Scalars['Boolean'];
};

/** Subscription update about the underlying git status of a branch */
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

/** Information about an active user connection to a project branch */
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
  bookmarkedTemplates: Array<Template>;
  collaboratorSandboxes: Array<Sandbox>;
  collection: Maybe<Collection>;
  collections: Array<Collection>;
  deletionRequested: Scalars['Boolean'];
  email: Scalars['String'];
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
  contribution: Maybe<Scalars['Boolean']>;
  limit?: Maybe<Scalars['Int']>;
  teamId: Maybe<Scalars['UUID4']>;
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

/** Relationship between a user and repository */
export enum GitHubAuthorAssociation {
  Collaborator = 'COLLABORATOR',
  Contributor = 'CONTRIBUTOR',
  FirstTimer = 'FIRST_TIMER',
  FirstTimeContributor = 'FIRST_TIME_CONTRIBUTOR',
  Mannequin = 'MANNEQUIN',
  Member = 'MEMBER',
  None = 'NONE',
  Owner = 'OWNER',
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

/** Ways to merge a pull request */
export enum GitHubPullRequestMergeMethod {
  Merge = 'MERGE',
  Rebase = 'REBASE',
  Squash = 'SQUASH',
}

/** The action to take with a pull request review */
export enum GitHubPullRequestReviewAction {
  Approve = 'APPROVE',
  Comment = 'COMMENT',
  RequestChanges = 'REQUEST_CHANGES',
}

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
  startLine: Maybe<Scalars['Int']>;
  /** Start side of multi-line comment. Only needed for multi-line comments. */
  startSide: Maybe<GitHubPullRequestReviewCommentSide>;
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
  /** Whether the repository is marked as private */
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

/**
 * Information about a GitHub organization team. Currently very limited, but
 * hopefully we can include member information in the future
 */
export type GithubRequestedTeam = {
  __typename?: 'GithubRequestedTeam';
  name: Scalars['String'];
  /** Timestamp that the team was last requested to review this PR */
  requestedAt: Maybe<Scalars['DateTime']>;
};

export enum GitProvider {
  Github = 'GITHUB',
}

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

/** Information about the last commit made by CodeSandbox for a project or branch */
export type LastCommit = {
  __typename?: 'LastCommit';
  color: Scalars['String'];
  message: Maybe<Scalars['String']>;
  sha: Scalars['String'];
  timestamp: Scalars['String'];
  user: Maybe<User>;
};

export type Limits = {
  __typename?: 'Limits';
  personalFree: TeamLimits;
  personalPro: TeamLimits;
  teamFree: TeamLimits;
  teamPro: TeamLimits;
};

export type MemberAuthorization = {
  authorization: TeamMemberAuthorization;
  teamManager: Maybe<Scalars['Boolean']>;
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
  sandpackTrustedDomains: Array<Scalars['String']>;
  teamId: Scalars['UUID4'];
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

/** Events related to a project (repository). */
export type ProjectEvent =
  | PullRequestCommentEvent
  | PullRequestEvent
  | PullRequestReviewCommentEvent
  | PullRequestReviewEvent;

/** User-editable settings for a project */
export type ProjectSettings = {
  __typename?: 'ProjectSettings';
  /** Whether AI features are explicitly enabled or disabled for this project. If `null`, the team-wide setting applies. */
  aiConsent: Maybe<Scalars['Boolean']>;
};

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
  /**
   * Whether or not this subscription has a payment method attached to it. It will
   * almost always be true, except when a team started a trial without a credit
   * card and has not yet added one.
   */
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

/** The oAuth provider used to create the account */
export enum ProviderName {
  Apple = 'APPLE',
  Github = 'GITHUB',
  Google = 'GOOGLE',
}

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

/** Current state of a GitHub pull request review */
export enum PullRequestReviewState {
  Approved = 'APPROVED',
  ChangesRequested = 'CHANGES_REQUESTED',
  Commented = 'COMMENTED',
  Dismissed = 'DISMISSED',
}

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
   * This endpoint allows users to create a contribution branch on a read-only
   * project. This branch will only be created on CodeSandbox and the branch will
   * be a _contribution branch_, which will automatically fork a new repository
   * andproject on the first commit.
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
  /** Request deletion of current user */
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
  setPreventSandboxesExport: Array<Sandbox>;
  setPreventSandboxesLeavingWorkspace: Array<Sandbox>;
  /** set sandbox always on status */
  setSandboxAlwaysOn: Sandbox;
  setSandboxesFrozen: Array<Sandbox>;
  setSandboxesPrivacy: Array<Sandbox>;
  /** Configure consent for AI features in this team. Can be overridden for specific repositories or sandboxes. */
  setTeamAiConsent: TeamAiConsent;
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
   * Update the settings for a sandbox. All settings are nullable.
   * Not passing a specific argument will leave it unchanged, explicitly passing `null` will revert it to the default.
   */
  updateSandboxSettings: SandboxSettings;
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

export type RootMutationTypeCreateBranchArgs = {
  branch: Maybe<Scalars['String']>;
  from: Maybe<Scalars['String']>;
  name: Scalars['String'];
  owner: Scalars['String'];
  provider: GitProvider;
  team: Scalars['ID'];
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

export type RootMutationTypeCreateContributionBranchArgs = {
  from: Maybe<Scalars['String']>;
  name: Scalars['String'];
  owner: Scalars['String'];
  provider: GitProvider;
};

export type RootMutationTypeCreateGithubPullRequestReviewArgs = {
  body: Maybe<Scalars['String']>;
  comments: Maybe<Array<GithubPullRequestReviewCommentInput>>;
  commitId: Maybe<Scalars['String']>;
  event: GitHubPullRequestReviewAction;
  name: Scalars['String'];
  owner: Scalars['String'];
  pullRequestNumber: Scalars['Int'];
};

export type RootMutationTypeCreateOrUpdatePrivateNpmRegistryArgs = {
  authType: Maybe<AuthType>;
  enabledScopes: Array<Scalars['String']>;
  limitToScopes: Scalars['Boolean'];
  proxyEnabled: Scalars['Boolean'];
  registryAuthKey: Maybe<Scalars['String']>;
  registryType: RegistryType;
  registryUrl: Maybe<Scalars['String']>;
  sandpackTrustedDomains: Maybe<Array<Scalars['String']>>;
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

export type RootMutationTypeDeleteBranchArgs = {
  id: Scalars['String'];
};

export type RootMutationTypeDeleteCollectionArgs = {
  path: Scalars['String'];
  teamId: Maybe<Scalars['UUID4']>;
};

export type RootMutationTypeDeleteCommentArgs = {
  commentId: Scalars['UUID4'];
  sandboxId: Scalars['ID'];
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

export type RootMutationTypeMergeGithubPullRequestArgs = {
  mergeMethod?: Maybe<GitHubPullRequestMergeMethod>;
  name: Scalars['String'];
  owner: Scalars['String'];
  pullRequestNumber: Scalars['Int'];
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
  newTeamId: Maybe<Scalars['UUID4']>;
  path: Scalars['String'];
  teamId: Maybe<Scalars['UUID4']>;
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
  emailCommentMention: Maybe<Scalars['Boolean']>;
  emailCommentReply: Maybe<Scalars['Boolean']>;
  emailMarketing: Maybe<Scalars['Boolean']>;
  emailNewComment: Maybe<Scalars['Boolean']>;
  emailSandboxInvite: Maybe<Scalars['Boolean']>;
  emailTeamInvite: Maybe<Scalars['Boolean']>;
  emailTeamRequest: Maybe<Scalars['Boolean']>;
  inAppPrReviewReceived: Maybe<Scalars['Boolean']>;
  inAppPrReviewRequest: Maybe<Scalars['Boolean']>;
};

export type RootMutationTypeUpdateNotificationReadStatusArgs = {
  notificationId: Scalars['UUID4'];
  read: Scalars['Boolean'];
};

export type RootMutationTypeUpdateProjectSettingsArgs = {
  aiConsent: Maybe<Scalars['Boolean']>;
  projectId: Scalars['UUID4'];
};

export type RootMutationTypeUpdateSandboxSettingsArgs = {
  aiConsent: Maybe<Scalars['Boolean']>;
  sandboxId: Scalars['ID'];
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

export type RootQueryTypeBranchByIdArgs = {
  id: Scalars['String'];
};

export type RootQueryTypeBranchByNameArgs = {
  branch: Scalars['String'];
  name: Scalars['String'];
  owner: Scalars['String'];
  provider: GitProvider;
  team: Maybe<Scalars['ID']>;
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
  team: Maybe<Scalars['ID']>;
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

export type RootQueryTypeTeamByTokenArgs = {
  inviteToken: Scalars['String'];
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

export type RootSubscriptionTypeProjectEventsArgs = {
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

export type RootSubscriptionTypeTeamEventsArgs = {
  teamId: Maybe<Scalars['ID']>;
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
  /** Depending on the context, this may be the last access of the current user or the aggregate last access for all users */
  lastAccessedAt: Scalars['DateTime'];
  likeCount: Scalars['Int'];
  /** If the sandbox has been made into a git sandbox, then this will be set */
  originalGit: Maybe<Git>;
  permissions: Maybe<SandboxProtectionSettings>;
  /** If a PR has been opened on the sandbox, this will be set to the PR number */
  prNumber: Maybe<Scalars['Int']>;
  privacy: Scalars['Int'];
  removedAt: Maybe<Scalars['String']>;
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
  bookmarkedTemplates: Array<Template>;
  collections: Array<Collection>;
  creatorId: Maybe<Scalars['UUID4']>;
  description: Maybe<Scalars['String']>;
  /** Draft sandboxes by everyone on the team */
  drafts: Array<Sandbox>;
  id: Scalars['UUID4'];
  inviteToken: Scalars['String'];
  invitees: Array<User>;
  /** @deprecated There's no such thing as a pilot team anymore */
  joinedPilotAt: Maybe<Scalars['DateTime']>;
  legacy: Scalars['Boolean'];
  limits: TeamLimits;
  members: Array<TeamMember>;
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
  templates: Array<Template>;
  type: TeamType;
  usage: TeamUsage;
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

export type TeamSubscriptionArgs = {
  includeCancelled?: Maybe<Scalars['Boolean']>;
};

export type TeamAiConsent = {
  __typename?: 'TeamAiConsent';
  privateRepositories: Scalars['Boolean'];
  privateSandboxes: Scalars['Boolean'];
  publicRepositories: Scalars['Boolean'];
  publicSandboxes: Scalars['Boolean'];
};

/** Events related to a team */
export type TeamEvent = TeamSubscriptionEvent;

export type TeamLimits = {
  __typename?: 'TeamLimits';
  maxEditors: Maybe<Scalars['Int']>;
  maxPrivateProjects: Maybe<Scalars['Int']>;
  maxPrivateSandboxes: Maybe<Scalars['Int']>;
  maxPublicProjects: Maybe<Scalars['Int']>;
  maxPublicSandboxes: Maybe<Scalars['Int']>;
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

export enum TeamMemberAuthorization {
  /** Permission to add/remove users and change permissions (in addition to write and read). */
  Admin = 'ADMIN',
  /** Permission view and comment on team sandboxes. */
  Read = 'READ',
  /** Permission create and edit team sandboxes (in addition to read). */
  Write = 'WRITE',
}

export type TeamPreview = {
  __typename?: 'TeamPreview';
  avatarUrl: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  id: Scalars['UUID4'];
  name: Scalars['String'];
  shortid: Scalars['String'];
};

/** Change to a team's subscription status */
export type TeamSubscriptionEvent = {
  __typename?: 'TeamSubscriptionEvent';
  event: Scalars['String'];
  subscription: ProSubscription;
  teamId: Scalars['ID'];
};

export enum TeamType {
  Personal = 'PERSONAL',
  Team = 'TEAM',
}

export type TeamUsage = {
  __typename?: 'TeamUsage';
  editorsQuantity: Scalars['Int'];
  privateProjectsQuantity: Scalars['Int'];
  privateSandboxesQuantity: Scalars['Int'];
  publicProjectsQuantity: Scalars['Int'];
  publicSandboxesQuantity: Scalars['Int'];
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
  teamManager: Scalars['Boolean'];
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
  aiConsent: TeamAiConsent;
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
          team: Maybe<
            { __typename?: 'TeamPreview' } & Pick<TeamPreview, 'name'>
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

export type GetGithubRepoQueryVariables = Exact<{
  owner: Scalars['String'];
  name: Scalars['String'];
}>;

export type GetGithubRepoQuery = { __typename?: 'RootQueryType' } & {
  githubRepo: Maybe<
    { __typename?: 'GithubRepo' } & Pick<
      GithubRepo,
      | 'name'
      | 'fullName'
      | 'updatedAt'
      | 'pushedAt'
      | 'authorization'
      | 'private'
    > & {
        owner: { __typename?: 'GithubOrganization' } & Pick<
          GithubOrganization,
          'id' | 'login' | 'avatarUrl'
        >;
      }
  >;
};

export type ProfileFragment = { __typename?: 'GithubProfile' } & Pick<
  GithubProfile,
  'id' | 'login' | 'name'
>;

export type OrganizationFragment = { __typename?: 'GithubOrganization' } & Pick<
  GithubOrganization,
  'id' | 'login'
>;

export type GetGithubAccountsQueryVariables = Exact<{ [key: string]: never }>;

export type GetGithubAccountsQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      githubProfile: Maybe<{ __typename?: 'GithubProfile' } & ProfileFragment>;
      githubOrganizations: Maybe<
        Array<{ __typename?: 'GithubOrganization' } & OrganizationFragment>
      >;
    }
  >;
};

export type GetGitHubAccountReposQueryVariables = Exact<{
  perPage: Maybe<Scalars['Int']>;
  page: Maybe<Scalars['Int']>;
}>;

export type GetGitHubAccountReposQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & Pick<CurrentUser, 'id'> & {
        githubRepos: Array<
          { __typename?: 'GithubRepo' } & Pick<
            GithubRepo,
            | 'id'
            | 'authorization'
            | 'fullName'
            | 'name'
            | 'private'
            | 'updatedAt'
            | 'pushedAt'
          > & {
              owner: { __typename?: 'GithubOrganization' } & Pick<
                GithubOrganization,
                'id' | 'login' | 'avatarUrl'
              >;
            }
        >;
      }
  >;
};

export type GetGitHubOrganizationReposQueryVariables = Exact<{
  organization: Scalars['String'];
  perPage: Maybe<Scalars['Int']>;
  page: Maybe<Scalars['Int']>;
}>;

export type GetGitHubOrganizationReposQuery = {
  __typename?: 'RootQueryType';
} & {
  githubOrganizationRepos: Maybe<
    Array<
      { __typename?: 'GithubRepo' } & Pick<
        GithubRepo,
        | 'id'
        | 'authorization'
        | 'fullName'
        | 'name'
        | 'private'
        | 'updatedAt'
        | 'pushedAt'
      > & {
          owner: { __typename?: 'GithubOrganization' } & Pick<
            GithubOrganization,
            'id' | 'login'
          >;
        }
    >
  >;
};

export type RepositoryTeamsQueryVariables = Exact<{
  owner: Scalars['String'];
  name: Scalars['String'];
}>;

export type RepositoryTeamsQuery = { __typename?: 'RootQueryType' } & {
  projects: Array<
    { __typename?: 'Project' } & {
      team: Maybe<{ __typename?: 'Team' } & Pick<Team, 'id' | 'name'>>;
    }
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
  | 'lastAccessedAt'
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
  | 'isV2'
  | 'authorId'
  | 'teamId'
> & {
    source: { __typename?: 'Source' } & Pick<Source, 'template'>;
    customTemplate: Maybe<
      { __typename?: 'Template' } & Pick<Template, 'id' | 'iconUrl'>
    >;
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
        team: Maybe<{ __typename?: 'TeamPreview' } & Pick<TeamPreview, 'name'>>;
        author: Maybe<{ __typename?: 'User' } & Pick<User, 'username'>>;
        source: { __typename?: 'Source' } & Pick<Source, 'template'>;
      } & SandboxFragmentDashboardFragment
    >;
  };

export type TeamFragmentDashboardFragment = { __typename?: 'Team' } & Pick<
  Team,
  'id' | 'name' | 'type' | 'description' | 'creatorId' | 'avatarUrl' | 'legacy'
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
        'userId' | 'authorization' | 'teamManager'
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
        'origin' | 'type' | 'status' | 'paymentProvider'
      >
    >;
  };

export type CurrentTeamInfoFragmentFragment = { __typename?: 'Team' } & Pick<
  Team,
  | 'id'
  | 'creatorId'
  | 'description'
  | 'inviteToken'
  | 'name'
  | 'type'
  | 'avatarUrl'
  | 'legacy'
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
        'userId' | 'authorization' | 'teamManager'
      >
    >;
    settings: Maybe<
      { __typename?: 'WorkspaceSandboxSettings' } & Pick<
        WorkspaceSandboxSettings,
        | 'minimumPrivacy'
        | 'preventSandboxExport'
        | 'preventSandboxLeaving'
        | 'defaultAuthorization'
      > & {
          aiConsent: { __typename?: 'TeamAiConsent' } & Pick<
            TeamAiConsent,
            | 'privateRepositories'
            | 'privateSandboxes'
            | 'publicRepositories'
            | 'publicSandboxes'
          >;
        }
    >;
    subscription: Maybe<
      { __typename?: 'ProSubscription' } & Pick<
        ProSubscription,
        | 'billingInterval'
        | 'cancelAt'
        | 'cancelAtPeriodEnd'
        | 'currency'
        | 'id'
        | 'nextBillDate'
        | 'origin'
        | 'paymentMethodAttached'
        | 'paymentProvider'
        | 'quantity'
        | 'status'
        | 'trialEnd'
        | 'trialStart'
        | 'type'
        | 'unitPrice'
        | 'updateBillingUrl'
      >
    >;
    limits: { __typename?: 'TeamLimits' } & Pick<
      TeamLimits,
      | 'maxEditors'
      | 'maxPrivateProjects'
      | 'maxPrivateSandboxes'
      | 'maxPublicProjects'
      | 'maxPublicSandboxes'
    >;
    usage: { __typename?: 'TeamUsage' } & Pick<
      TeamUsage,
      | 'editorsQuantity'
      | 'privateProjectsQuantity'
      | 'privateSandboxesQuantity'
      | 'publicProjectsQuantity'
      | 'publicSandboxesQuantity'
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
  | 'sandpackTrustedDomains'
>;

export type BranchFragment = { __typename?: 'Branch' } & Pick<
  Branch,
  'id' | 'name' | 'contribution' | 'lastAccessedAt' | 'upstream'
> & {
    project: { __typename?: 'Project' } & {
      repository: { __typename?: 'GitHubRepository' } & Pick<
        GitHubRepository,
        'defaultBranch' | 'name' | 'owner' | 'private'
      >;
      team: Maybe<{ __typename?: 'Team' } & Pick<Team, 'id'>>;
    };
  };

export type ProjectFragment = { __typename?: 'Project' } & Pick<
  Project,
  'branchCount' | 'lastAccessedAt'
> & {
    repository: { __typename?: 'GitHubRepository' } & Pick<
      GitHubRepository,
      'owner' | 'name' | 'defaultBranch' | 'private'
    >;
    team: Maybe<{ __typename?: 'Team' } & Pick<Team, 'id'>>;
  };

export type ProjectWithBranchesFragment = { __typename?: 'Project' } & {
  branches: Array<{ __typename?: 'Branch' } & BranchFragment>;
  repository: { __typename?: 'GitHubRepository' } & Pick<
    GitHubRepository,
    'owner' | 'name' | 'defaultBranch' | 'private'
  >;
  team: Maybe<{ __typename?: 'Team' } & Pick<Team, 'id'>>;
};

export type TeamLimitsFragment = { __typename?: 'TeamLimits' } & Pick<
  TeamLimits,
  | 'maxEditors'
  | 'maxPrivateProjects'
  | 'maxPrivateSandboxes'
  | 'maxPublicProjects'
  | 'maxPublicSandboxes'
>;

export type _CreateTeamMutationVariables = Exact<{
  name: Scalars['String'];
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
  teamManager: Maybe<Scalars['Boolean']>;
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
  sandpackTrustedDomains: Array<Scalars['String']>;
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

export type ImportProjectMutationVariables = Exact<{
  owner: Scalars['String'];
  name: Scalars['String'];
  teamId: Scalars['ID'];
}>;

export type ImportProjectMutation = { __typename?: 'RootMutationType' } & {
  importProject: { __typename?: 'Project' } & Pick<Project, 'id'> & {
      defaultBranch: { __typename?: 'Branch' } & Pick<Branch, 'name'>;
    };
};

export type DeleteProjectMutationVariables = Exact<{
  owner: Scalars['String'];
  name: Scalars['String'];
  teamId: Scalars['ID'];
}>;

export type DeleteProjectMutation = { __typename?: 'RootMutationType' } & Pick<
  RootMutationType,
  'deleteProject'
>;

export type DeleteBranchMutationVariables = Exact<{
  branchId: Scalars['String'];
}>;

export type DeleteBranchMutation = { __typename?: 'RootMutationType' } & Pick<
  RootMutationType,
  'deleteBranch'
>;

export type CreateBranchMutationVariables = Exact<{
  owner: Scalars['String'];
  name: Scalars['String'];
  teamId: Scalars['ID'];
}>;

export type CreateBranchMutation = { __typename?: 'RootMutationType' } & {
  createBranch: { __typename?: 'Branch' } & Pick<Branch, 'id' | 'name'>;
};

export type SetTeamAiConsentMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  privateRepositories: Scalars['Boolean'];
  privateSandboxes: Scalars['Boolean'];
  publicSandboxes: Scalars['Boolean'];
  publicRepositories: Scalars['Boolean'];
}>;

export type SetTeamAiConsentMutation = { __typename?: 'RootMutationType' } & {
  setTeamAiConsent: { __typename?: 'TeamAiConsent' } & Pick<
    TeamAiConsent,
    | 'privateRepositories'
    | 'privateSandboxes'
    | 'publicSandboxes'
    | 'publicRepositories'
  >;
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
  teamId: Maybe<Scalars['UUID4']>;
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

export type CuratedAlbumByIdQueryVariables = Exact<{
  albumId: Scalars['ID'];
}>;

export type CuratedAlbumByIdQuery = { __typename?: 'RootQueryType' } & {
  album: Maybe<
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
  syncData: Maybe<Scalars['Boolean']>;
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

export type RepositoryByDetailsQueryVariables = Exact<{
  owner: Scalars['String'];
  name: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
}>;

export type RepositoryByDetailsQuery = { __typename?: 'RootQueryType' } & {
  project: Maybe<{ __typename?: 'Project' } & ProjectWithBranchesFragment>;
};

export type LimitsQueryVariables = Exact<{ [key: string]: never }>;

export type LimitsQuery = { __typename?: 'RootQueryType' } & {
  limits: { __typename?: 'Limits' } & {
    personalFree: { __typename?: 'TeamLimits' } & TeamLimitsFragment;
    personalPro: { __typename?: 'TeamLimits' } & TeamLimitsFragment;
    teamFree: { __typename?: 'TeamLimits' } & TeamLimitsFragment;
    teamPro: { __typename?: 'TeamLimits' } & TeamLimitsFragment;
  };
};

export type TeamEventsSubscriptionVariables = Exact<{
  teamId: Scalars['ID'];
}>;

export type TeamEventsSubscription = { __typename?: 'RootSubscriptionType' } & {
  teamEvents: { __typename?: 'TeamSubscriptionEvent' } & {
    subscription: { __typename?: 'ProSubscription' } & Pick<
      ProSubscription,
      'active'
    >;
  };
};

export type RecentNotificationFragment = { __typename?: 'Notification' } & Pick<
  Notification,
  'id' | 'type' | 'data' | 'insertedAt' | 'read'
>;

export type UpdateNotificationPreferencesMutationVariables = Exact<{
  emailCommentMention: Maybe<Scalars['Boolean']>;
  emailCommentReply: Maybe<Scalars['Boolean']>;
  emailMarketing: Maybe<Scalars['Boolean']>;
  emailNewComment: Maybe<Scalars['Boolean']>;
  emailSandboxInvite: Maybe<Scalars['Boolean']>;
  emailTeamInvite: Maybe<Scalars['Boolean']>;
  inAppPrReviewReceived: Maybe<Scalars['Boolean']>;
  inAppPrReviewRequest: Maybe<Scalars['Boolean']>;
}>;

export type UpdateNotificationPreferencesMutation = {
  __typename?: 'RootMutationType';
} & {
  updateNotificationPreferences: {
    __typename?: 'NotificationPreferences';
  } & Pick<
    NotificationPreferences,
    | 'emailCommentMention'
    | 'emailCommentReply'
    | 'emailMarketing'
    | 'emailNewComment'
    | 'emailSandboxInvite'
    | 'emailTeamInvite'
    | 'inAppPrReviewReceived'
    | 'inAppPrReviewRequest'
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
          | 'emailCommentMention'
          | 'emailCommentReply'
          | 'emailMarketing'
          | 'emailNewComment'
          | 'emailSandboxInvite'
          | 'emailTeamInvite'
          | 'inAppPrReviewRequest'
          | 'inAppPrReviewReceived'
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

export type SidebarSyncedSandboxFragmentFragment = {
  __typename?: 'Sandbox';
} & Pick<Sandbox, 'id'>;

export type SidebarTemplateFragmentFragment = {
  __typename?: 'Template';
} & Pick<Template, 'id'>;

export type PersonalSidebarDataQueryVariables = Exact<{ [key: string]: never }>;

export type PersonalSidebarDataQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      sandboxes: Array<
        { __typename?: 'Sandbox' } & SidebarSyncedSandboxFragmentFragment
      >;
      templates: Array<
        { __typename?: 'Template' } & SidebarTemplateFragmentFragment
      >;
    }
  >;
};

export type TeamSidebarDataQueryVariables = Exact<{
  id: Scalars['UUID4'];
}>;

export type TeamSidebarDataQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      team: Maybe<
        { __typename?: 'Team' } & {
          sandboxes: Array<
            { __typename?: 'Sandbox' } & SidebarSyncedSandboxFragmentFragment
          >;
          templates: Array<
            { __typename?: 'Template' } & SidebarTemplateFragmentFragment
          >;
        }
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
  redeemTeamInviteToken: { __typename?: 'Team' } & Pick<Team, 'id' | 'name'>;
};
