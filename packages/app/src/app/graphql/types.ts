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
   * be converted to UTC and any UTC offset other than 0 will be rejected.
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

export enum Authorization {
  Comment = 'COMMENT',
  None = 'NONE',
  Owner = 'OWNER',
  Read = 'READ',
  WriteCode = 'WRITE_CODE',
  WriteProject = 'WRITE_PROJECT',
}

export type Bookmarked = {
  __typename?: 'Bookmarked';
  entity: Maybe<BookmarkEntity>;
  isBookmarked: Maybe<Scalars['Boolean']>;
};

/** A team or the current user */
export type BookmarkEntity = Team | User;

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

export type CurrentUser = {
  __typename?: 'CurrentUser';
  bookmarkedTemplates: Array<Template>;
  collection: Maybe<Collection>;
  collections: Array<Collection>;
  email: Scalars['String'];
  firstName: Maybe<Scalars['String']>;
  id: Scalars['UUID4'];
  lastName: Maybe<Scalars['String']>;
  notificationPreferences: Maybe<NotificationPreferences>;
  notifications: Array<Notification>;
  personalWorkspaceId: Scalars['UUID4'];
  provider: ProviderName;
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

export type CurrentUserNotificationsArgs = {
  limit: Maybe<Scalars['Int']>;
  orderBy: Maybe<OrderBy>;
  type: Maybe<Array<Maybe<Scalars['String']>>>;
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
  id: Scalars['UUID4'];
};

export type CurrentUserTemplatesArgs = {
  showAll: Maybe<Scalars['Boolean']>;
  teamId: Maybe<Scalars['UUID4']>;
};

export enum Direction {
  Asc = 'ASC',
  Desc = 'DESC',
}

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

export type GitBaseGitSandboxesArgs = {
  teamId: Maybe<Scalars['UUID4']>;
};

export type GitOriginalGitSandboxesArgs = {
  teamId: Maybe<Scalars['UUID4']>;
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

/** An invitation to a sandbox */
export type Invitation = {
  __typename?: 'Invitation';
  authorization: Authorization;
  email: Maybe<Scalars['String']>;
  id: Maybe<Scalars['ID']>;
  sandbox: Sandbox;
  token: Scalars['String'];
};

export type MemberAuthorization = {
  authorization: TeamMemberAuthorization;
  userId: Scalars['ID'];
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
  responsive: Scalars['Boolean'];
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
  responsive: Scalars['Boolean'];
  screenshotUrl: Maybe<Scalars['String']>;
  userAgent: Scalars['String'];
  width: Scalars['Int'];
  x: Scalars['Int'];
  y: Scalars['Int'];
};

/** The oAuth provider used to create the account */
export enum ProviderName {
  Github = 'GITHUB',
  Google = 'GOOGLE',
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

export type RootMutationType = {
  __typename?: 'RootMutationType';
  /** Unbookmark a template */
  unbookmarkTemplate: Maybe<Template>;
  /** Archive one notification */
  archiveNotification: Notification;
  /** Delete sandboxes */
  deleteSandboxes: Array<Sandbox>;
  /** Set a user's notification preferences */
  updateNotificationPreferences: NotificationPreferences;
  /** Change authorization of a collaborator */
  changeCollaboratorAuthorization: Collaborator;
  /** Leave a team */
  leaveTeam: Scalars['String'];
  /** Revoke an invitation to a team */
  revokeTeamInvitation: Team;
  /** Reject an invitation to a team */
  rejectTeamInvitation: Scalars['String'];
  /** Rename a collection and all subfolders */
  renameCollection: Array<Collection>;
  /** Mark all notifications as read */
  markAllNotificationsAsRead: User;
  createComment: Comment;
  /** bookmark a template */
  bookmarkTemplate: Maybe<Template>;
  /** Set the description of the team */
  setTeamDescription: Team;
  createPreviewComment: Comment;
  /** Invite someone to a team via email */
  inviteToTeamViaEmail: Scalars['String'];
  /** Accept an invitation to a team */
  acceptTeamInvitation: Team;
  /** Redeem an invite token from a team */
  redeemTeamInviteToken: Team;
  /** Invite someone to a team */
  inviteToTeam: Team;
  /** Remove a collaborator */
  removeCollaborator: Collaborator;
  /** Add sandboxes to a collection */
  addToCollection: Collection;
  renameSandbox: Sandbox;
  /** Set team member authorization levels */
  changeTeamMemberAuthorizations: Team;
  createSandboxInvitation: Invitation;
  createCodeComment: Comment;
  redeemSandboxInvitation: Invitation;
  /** Archive all notifications */
  archiveAllNotifications: User;
  /** Add a collaborator */
  addCollaborator: Collaborator;
  /** Create a collection */
  createCollection: Collection;
  unresolveComment: Comment;
  updateComment: Comment;
  /** Convert templates back to sandboxes */
  unmakeSandboxesTemplates: Array<Template>;
  changeSandboxInvitationAuthorization: Invitation;
  /** Set the name of the team */
  setTeamName: Team;
  setSandboxesFrozen: Array<Sandbox>;
  /** Add sandboxes to a collection and/or team */
  addToCollectionOrTeam: Array<Maybe<Sandbox>>;
  /** Delete a collection and all subfolders */
  deleteCollection: Array<Collection>;
  permanentlyDeleteSandboxes: Array<Sandbox>;
  setSandboxesPrivacy: Array<Sandbox>;
  revokeSandboxInvitation: Invitation;
  /** Create a team */
  createTeam: Team;
  /** Remove someone from a team */
  removeFromTeam: Team;
  /** Update notification read status */
  updateNotificationReadStatus: Notification;
  /** set sandbox always on status */
  setSandboxAlwaysOn: Sandbox;
  /** Mark one notification as read */
  markNotificationAsRead: Notification;
  deleteWorkspace: Scalars['String'];
  /** Soft delete a comment. Note: all child comments will also be deleted. */
  deleteComment: Comment;
  /** Clear notification unread count */
  clearNotificationCount: User;
  resolveComment: Comment;
  /** Make templates from sandboxes */
  makeSandboxesTemplates: Array<Template>;
};

export type RootMutationTypeUnbookmarkTemplateArgs = {
  teamId: Maybe<Scalars['UUID4']>;
  templateId: Scalars['UUID4'];
};

export type RootMutationTypeArchiveNotificationArgs = {
  notificationId: Scalars['UUID4'];
};

export type RootMutationTypeDeleteSandboxesArgs = {
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeUpdateNotificationPreferencesArgs = {
  emailCommentMention: Maybe<Scalars['Boolean']>;
  emailCommentReply: Maybe<Scalars['Boolean']>;
  emailNewComment: Maybe<Scalars['Boolean']>;
};

export type RootMutationTypeChangeCollaboratorAuthorizationArgs = {
  authorization: Authorization;
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
};

export type RootMutationTypeLeaveTeamArgs = {
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeRevokeTeamInvitationArgs = {
  teamId: Scalars['UUID4'];
  userId: Scalars['UUID4'];
};

export type RootMutationTypeRejectTeamInvitationArgs = {
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeRenameCollectionArgs = {
  newPath: Scalars['String'];
  newTeamId: Maybe<Scalars['UUID4']>;
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

export type RootMutationTypeBookmarkTemplateArgs = {
  teamId: Maybe<Scalars['UUID4']>;
  templateId: Scalars['UUID4'];
};

export type RootMutationTypeSetTeamDescriptionArgs = {
  description: Scalars['String'];
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

export type RootMutationTypeInviteToTeamViaEmailArgs = {
  email: Scalars['String'];
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeAcceptTeamInvitationArgs = {
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeRedeemTeamInviteTokenArgs = {
  inviteToken: Scalars['String'];
};

export type RootMutationTypeInviteToTeamArgs = {
  teamId: Scalars['UUID4'];
  username: Scalars['String'];
};

export type RootMutationTypeRemoveCollaboratorArgs = {
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
};

export type RootMutationTypeAddToCollectionArgs = {
  collectionPath: Scalars['String'];
  sandboxIds: Maybe<Array<Maybe<Scalars['ID']>>>;
  teamId: Maybe<Scalars['UUID4']>;
};

export type RootMutationTypeRenameSandboxArgs = {
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type RootMutationTypeChangeTeamMemberAuthorizationsArgs = {
  memberAuthorizations: Maybe<Array<MemberAuthorization>>;
  teamId: Scalars['ID'];
};

export type RootMutationTypeCreateSandboxInvitationArgs = {
  authorization: Authorization;
  email: Scalars['String'];
  sandboxId: Scalars['ID'];
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

export type RootMutationTypeRedeemSandboxInvitationArgs = {
  invitationToken: Scalars['String'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeAddCollaboratorArgs = {
  authorization: Authorization;
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
};

export type RootMutationTypeCreateCollectionArgs = {
  path: Scalars['String'];
  teamId: Maybe<Scalars['UUID4']>;
};

export type RootMutationTypeUnresolveCommentArgs = {
  commentId: Scalars['UUID4'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeUpdateCommentArgs = {
  codeReferences: Maybe<Array<CodeReference>>;
  commentId: Scalars['UUID4'];
  content: Maybe<Scalars['String']>;
  imageReferences: Maybe<Array<ImageReference>>;
  sandboxId: Scalars['ID'];
  userReferences: Maybe<Array<UserReference>>;
};

export type RootMutationTypeUnmakeSandboxesTemplatesArgs = {
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeChangeSandboxInvitationAuthorizationArgs = {
  authorization: Authorization;
  invitationId: Scalars['UUID4'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeSetTeamNameArgs = {
  name: Scalars['String'];
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeSetSandboxesFrozenArgs = {
  isFrozen: Scalars['Boolean'];
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeAddToCollectionOrTeamArgs = {
  collectionPath: Maybe<Scalars['String']>;
  sandboxIds: Maybe<Array<Maybe<Scalars['ID']>>>;
  teamId: Maybe<Scalars['UUID4']>;
};

export type RootMutationTypeDeleteCollectionArgs = {
  path: Scalars['String'];
  teamId: Maybe<Scalars['UUID4']>;
};

export type RootMutationTypePermanentlyDeleteSandboxesArgs = {
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeSetSandboxesPrivacyArgs = {
  privacy: Maybe<Scalars['Int']>;
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeRevokeSandboxInvitationArgs = {
  invitationId: Scalars['UUID4'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeCreateTeamArgs = {
  name: Scalars['String'];
  pilot: Maybe<Scalars['Boolean']>;
};

export type RootMutationTypeRemoveFromTeamArgs = {
  teamId: Scalars['UUID4'];
  userId: Scalars['UUID4'];
};

export type RootMutationTypeUpdateNotificationReadStatusArgs = {
  notificationId: Scalars['UUID4'];
  read: Scalars['Boolean'];
};

export type RootMutationTypeSetSandboxAlwaysOnArgs = {
  alwaysOn: Scalars['Boolean'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeMarkNotificationAsReadArgs = {
  notificationId: Scalars['UUID4'];
};

export type RootMutationTypeDeleteWorkspaceArgs = {
  teamId: Scalars['UUID4'];
};

export type RootMutationTypeDeleteCommentArgs = {
  commentId: Scalars['UUID4'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeResolveCommentArgs = {
  commentId: Scalars['UUID4'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeMakeSandboxesTemplatesArgs = {
  sandboxIds: Array<Scalars['ID']>;
};

export type RootQueryType = {
  __typename?: 'RootQueryType';
  /** Get git repo and related sandboxes */
  git: Maybe<Git>;
  /** Get current user */
  me: Maybe<CurrentUser>;
  /** Get a sandbox */
  sandbox: Maybe<Sandbox>;
  /** A team from an invite token */
  teamByToken: Maybe<Team>;
};

export type RootQueryTypeGitArgs = {
  branch: Scalars['String'];
  path: Scalars['String'];
  repo: Scalars['String'];
  username: Scalars['String'];
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
  invitationChanged: Invitation;
  invitationCreated: Invitation;
  invitationRemoved: Invitation;
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

export type RootSubscriptionTypeInvitationChangedArgs = {
  sandboxId: Scalars['ID'];
};

export type RootSubscriptionTypeInvitationCreatedArgs = {
  sandboxId: Scalars['ID'];
};

export type RootSubscriptionTypeInvitationRemovedArgs = {
  sandboxId: Scalars['ID'];
};

export type RootSubscriptionTypeSandboxChangedArgs = {
  sandboxId: Scalars['ID'];
};

/** A Sandbox */
export type Sandbox = {
  __typename?: 'Sandbox';
  /** If the sandbox has a git repo tied to it this will be set */
  git: Maybe<Git>;
  screenshotOutdated: Scalars['Boolean'];
  isFrozen: Scalars['Boolean'];
  team: Maybe<Team>;
  /** If a PR has been opened on the sandbox, this will be set to the PR number */
  prNumber: Maybe<Scalars['Int']>;
  description: Maybe<Scalars['String']>;
  authorId: Maybe<Scalars['UUID4']>;
  collection: Maybe<Collection>;
  /** If the sandbox has been forked from a git sandbox this will be set */
  originalGit: Maybe<Git>;
  source: Source;
  author: Maybe<User>;
  authorization: Authorization;
  forkedTemplate: Maybe<Template>;
  updatedAt: Scalars['String'];
  privacy: Scalars['Int'];
  title: Maybe<Scalars['String']>;
  comments: Array<Comment>;
  insertedAt: Scalars['String'];
  forkCount: Scalars['Int'];
  screenshotUrl: Maybe<Scalars['String']>;
  viewCount: Scalars['Int'];
  teamId: Maybe<Scalars['UUID4']>;
  comment: Maybe<Comment>;
  isSse: Maybe<Scalars['Boolean']>;
  alias: Maybe<Scalars['String']>;
  removedAt: Maybe<Scalars['String']>;
  alwaysOn: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  likeCount: Scalars['Int'];
  /** If the sandbox has created a PR, this will refer to the git that you will merge into */
  baseGit: Maybe<Git>;
  collaborators: Array<Collaborator>;
  invitations: Array<Invitation>;
  /** If the sandbox is a template this will be set */
  customTemplate: Maybe<Template>;
};

/** A Sandbox */
export type SandboxCommentArgs = {
  commentId: Scalars['UUID4'];
};

export type Source = {
  __typename?: 'Source';
  id: Maybe<Scalars['UUID4']>;
  template: Maybe<Scalars['String']>;
};

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
  joinedPilotAt: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  sandboxes: Array<Sandbox>;
  templates: Array<Template>;
  userAuthorizations: Array<UserAuthorization>;
  users: Array<User>;
  settings: {
    minimumPrivacy: Sandbox['privacy'];
  };
};

export type TeamDraftsArgs = {
  authorId: Maybe<Scalars['UUID4']>;
  limit: Maybe<Scalars['Int']>;
  orderBy: Maybe<OrderBy>;
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
  firstName: Maybe<Scalars['String']>;
  id: Scalars['UUID4'];
  lastName: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  personalWorkspaceId: Scalars['UUID4'];
  username: Scalars['String'];
};

export type UserAuthorization = {
  __typename?: 'UserAuthorization';
  authorization: TeamMemberAuthorization;
  userId: Scalars['ID'];
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

export type TemplateFragment = { __typename?: 'Template' } & Pick<
  Template,
  'id' | 'color' | 'iconUrl' | 'published'
> & {
    sandbox: Maybe<
      { __typename?: 'Sandbox' } & Pick<
        Sandbox,
        'id' | 'alias' | 'title' | 'description' | 'insertedAt' | 'updatedAt'
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
  'width' | 'height' | 'x' | 'y' | 'screenshotUrl'
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
  | 'authorId'
  | 'teamId'
> & {
    source: { __typename?: 'Source' } & Pick<Source, 'template'>;
    customTemplate: Maybe<{ __typename?: 'Template' } & Pick<Template, 'id'>>;
    forkedTemplate: Maybe<
      { __typename?: 'Template' } & Pick<Template, 'id' | 'color' | 'iconUrl'>
    >;
    collection: Maybe<{ __typename?: 'Collection' } & Pick<Collection, 'path'>>;
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
  'id' | 'name' | 'description' | 'creatorId' | 'avatarUrl'
> & {
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
    settings: {
      minimumPrivacy: Sandbox['privacy'];
    };
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
    settings: {
      minimumPrivacy: Sandbox['privacy'];
    };
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
}>;

export type _InviteToTeamMutation = { __typename?: 'RootMutationType' } & {
  inviteToTeam: { __typename?: 'Team' } & CurrentTeamInfoFragmentFragment;
};

export type _InviteToTeamViaEmailMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  email: Scalars['String'];
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
  teamId: Scalars['ID'];
  userId: Scalars['ID'];
  authorization: TeamMemberAuthorization;
}>;

export type ChangeTeamMemberAuthorizationMutation = {
  __typename?: 'RootMutationType';
} & {
  changeTeamMemberAuthorizations: { __typename?: 'Team' } & Pick<Team, 'id'>;
};

export type DeleteWorkspaceMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
}>;

export type DeleteWorkspaceMutation = {
  __typename?: 'RootMutationType';
} & Pick<RootMutationType, 'deleteWorkspace'>;

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
          { __typename?: 'Team' } & Pick<Team, 'id' | 'name' | 'avatarUrl'> & {
              userAuthorizations: Array<
                { __typename?: 'UserAuthorization' } & Pick<
                  UserAuthorization,
                  'userId' | 'authorization'
                >
              >;
              settings: {
                minimumPrivacy: Sandbox['privacy'];
              };
            }
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

export type SetTeamMinimumPrivacyMutationVariables = Exact<{
  teamId: Scalars['UUID4'];
  minimumPrivacy: SandboxFragmentDashboardFragment['privacy'];
  updateDrafts: boolean;
}>;

export type SetTeamMinimumPrivacyMutation = {
  __typename?: 'RootMutationType';
} & {
  minimumPrivacy: SandboxFragmentDashboardFragment['privacy'];
};
