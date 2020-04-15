export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `DateTime` scalar type represents a date and time in the UTC
   * timezone. The DateTime appears in a JSON response as an ISO8601 formatted
   * string, including UTC timezone ("Z"). The parsed date and time string will
   * be converted to UTC and any UTC offset other than 0 will be rejected.
   * */
  DateTime: any;
  /**
   * The `Naive DateTime` scalar type represents a naive date and time without
   * timezone. The DateTime appears in a JSON response as an ISO8601 formatted
   * string.
   * */
  NaiveDateTime: any;
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
  path: Scalars['String'];
};

export type CodeReferenceMetadata = {
  __typename?: 'CodeReferenceMetadata';
  anchor: Scalars['Int'];
  code: Scalars['String'];
  head: Scalars['Int'];
  path: Scalars['String'];
};

/** A collaborator on a sandbox */
export type Collaborator = {
  __typename?: 'Collaborator';
  authorization: Authorization;
  id: Scalars['ID'];
  lastSeenAt: Maybe<Scalars['DateTime']>;
  sandbox: Sandbox;
  user: User;
  warning: Maybe<Scalars['String']>;
};

export type Collection = {
  __typename?: 'Collection';
  id: Maybe<Scalars['ID']>;
  path: Scalars['String'];
  sandboxes: Array<Sandbox>;
  team: Maybe<Team>;
  teamId: Maybe<Scalars['ID']>;
  user: Maybe<User>;
};

/** A comment on a sandbox. A comment can also have replies and references. */
export type Comment = {
  __typename?: 'Comment';
  comments: Array<Comment>;
  content: Maybe<Scalars['String']>;
  id: Scalars['ID'];
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
  id: Scalars['ID'];
  lastName: Maybe<Scalars['String']>;
  notifications: Maybe<Array<Maybe<Notification>>>;
  recentlyUsedTemplates: Array<Template>;
  sandboxes: Array<Sandbox>;
  team: Maybe<Team>;
  teams: Array<Team>;
  templates: Array<Template>;
  username: Scalars['String'];
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
};

export type CurrentUserSandboxesArgs = {
  limit: Maybe<Scalars['Int']>;
  orderBy: Maybe<OrderBy>;
  showDeleted: Maybe<Scalars['Boolean']>;
};

export type CurrentUserTeamArgs = {
  id: Scalars['ID'];
};

export type CurrentUserTemplatesArgs = {
  showAll: Maybe<Scalars['Boolean']>;
  teamId: Maybe<Scalars['ID']>;
};

export enum Direction {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type Git = {
  __typename?: 'Git';
  branch: Maybe<Scalars['String']>;
  commitSha: Maybe<Scalars['String']>;
  id: Maybe<Scalars['ID']>;
  path: Maybe<Scalars['String']>;
  repo: Maybe<Scalars['String']>;
  username: Maybe<Scalars['String']>;
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

export type Notification = {
  __typename?: 'Notification';
  data: Maybe<Scalars['String']>;
  id: Maybe<Scalars['ID']>;
  read: Maybe<Scalars['Boolean']>;
  type: Maybe<Scalars['String']>;
};

export type OrderBy = {
  direction: Direction;
  field: Scalars['String'];
};

export type Reference = {
  __typename?: 'Reference';
  id: Scalars['ID'];
  metadata: ReferenceMetadata;
  resource: Scalars['String'];
  type: Scalars['String'];
};

/** The metadata of a reference */
export type ReferenceMetadata = CodeReferenceMetadata;

export type RootMutationType = {
  __typename?: 'RootMutationType';
  /** Change authorization of a collaborator */
  changeCollaboratorAuthorization: Collaborator;
  /** Clear notification unread count */
  clearNotificationCount: Maybe<User>;
  renameSandbox: Sandbox;
  /** Add sandboxes to a collection */
  addToCollection: Collection;
  /** Delete a collection and all subfolders */
  deleteCollection: Array<Collection>;
  /** Revoke an invitation to a team */
  revokeTeamInvitation: Maybe<Team>;
  /** Soft delete a comment. Note: all child comments will also be deleted. */
  deleteComment: Comment;
  changeSandboxInvitationAuthorization: Invitation;
  resolveComment: Comment;
  createSandboxInvitation: Invitation;
  /** Create a team */
  createTeam: Maybe<Team>;
  /** Rename a collection and all subfolders */
  renameCollection: Array<Collection>;
  /** Convert templates back to sandboxes */
  unmakeSandboxesTemplates: Array<Template>;
  /** Delete sandboxes */
  deleteSandboxes: Array<Sandbox>;
  /** Unbookmark a template */
  unbookmarkTemplate: Maybe<Template>;
  /** Leave a team */
  leaveTeam: Maybe<Scalars['String']>;
  /** bookmark a template */
  bookmarkTemplate: Maybe<Template>;
  updateComment: Comment;
  createComment: Comment;
  /** Reject an invitation to a team */
  rejectTeamInvitation: Maybe<Scalars['String']>;
  /** Accept an invitation to a team */
  acceptTeamInvitation: Maybe<Team>;
  /** Make templates from sandboxes */
  makeSandboxesTemplates: Array<Template>;
  /** Create a collection */
  createCollection: Collection;
  /** Remove a collaborator */
  removeCollaborator: Collaborator;
  setSandboxesPrivacy: Array<Sandbox>;
  /** Remove someone from a team */
  removeFromTeam: Maybe<Team>;
  /** Set the description of the team */
  setTeamDescription: Maybe<Team>;
  permanentlyDeleteSandboxes: Array<Sandbox>;
  /** Add a collaborator */
  addCollaborator: Collaborator;
  /** Invite someone to a team */
  inviteToTeam: Maybe<Team>;
  unresolveComment: Comment;
  redeemSandboxInvitation: Invitation;
  revokeSandboxInvitation: Invitation;
  /** Mark all notifications as read */
  markAllNotificationsAsRead: Maybe<User>;
};

export type RootMutationTypeChangeCollaboratorAuthorizationArgs = {
  authorization: Authorization;
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
};

export type RootMutationTypeRenameSandboxArgs = {
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type RootMutationTypeAddToCollectionArgs = {
  collectionPath: Scalars['String'];
  sandboxIds: Array<Maybe<Scalars['ID']>>;
  teamId: Maybe<Scalars['ID']>;
};

export type RootMutationTypeDeleteCollectionArgs = {
  path: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
};

export type RootMutationTypeRevokeTeamInvitationArgs = {
  teamId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type RootMutationTypeDeleteCommentArgs = {
  commentId: Scalars['ID'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeChangeSandboxInvitationAuthorizationArgs = {
  authorization: Authorization;
  invitationId: Scalars['ID'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeResolveCommentArgs = {
  commentId: Scalars['ID'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeCreateSandboxInvitationArgs = {
  authorization: Authorization;
  email: Scalars['String'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeCreateTeamArgs = {
  name: Scalars['String'];
};

export type RootMutationTypeRenameCollectionArgs = {
  newPath: Scalars['String'];
  newTeamId: Maybe<Scalars['ID']>;
  path: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
};

export type RootMutationTypeUnmakeSandboxesTemplatesArgs = {
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeDeleteSandboxesArgs = {
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeUnbookmarkTemplateArgs = {
  teamId: Maybe<Scalars['ID']>;
  templateId: Scalars['ID'];
};

export type RootMutationTypeLeaveTeamArgs = {
  teamId: Scalars['ID'];
};

export type RootMutationTypeBookmarkTemplateArgs = {
  teamId: Maybe<Scalars['ID']>;
  templateId: Scalars['ID'];
};

export type RootMutationTypeUpdateCommentArgs = {
  commentId: Scalars['ID'];
  content: Maybe<Scalars['String']>;
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeCreateCommentArgs = {
  codeReference: Maybe<CodeReference>;
  content: Scalars['String'];
  id: Maybe<Scalars['ID']>;
  parentCommentId: Maybe<Scalars['ID']>;
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeRejectTeamInvitationArgs = {
  teamId: Scalars['ID'];
};

export type RootMutationTypeAcceptTeamInvitationArgs = {
  teamId: Scalars['ID'];
};

export type RootMutationTypeMakeSandboxesTemplatesArgs = {
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeCreateCollectionArgs = {
  path: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
};

export type RootMutationTypeRemoveCollaboratorArgs = {
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
};

export type RootMutationTypeSetSandboxesPrivacyArgs = {
  privacy: Maybe<Scalars['Int']>;
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeRemoveFromTeamArgs = {
  teamId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type RootMutationTypeSetTeamDescriptionArgs = {
  description: Scalars['String'];
  teamId: Scalars['ID'];
};

export type RootMutationTypePermanentlyDeleteSandboxesArgs = {
  sandboxIds: Array<Scalars['ID']>;
};

export type RootMutationTypeAddCollaboratorArgs = {
  authorization: Authorization;
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
};

export type RootMutationTypeInviteToTeamArgs = {
  teamId: Scalars['ID'];
  username: Maybe<Scalars['String']>;
};

export type RootMutationTypeUnresolveCommentArgs = {
  commentId: Scalars['ID'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeRedeemSandboxInvitationArgs = {
  invitationToken: Scalars['String'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeRevokeSandboxInvitationArgs = {
  invitationId: Scalars['ID'];
  sandboxId: Scalars['ID'];
};

export type RootQueryType = {
  __typename?: 'RootQueryType';
  /** Get current user */
  me: Maybe<CurrentUser>;
  /** Get a sandbox */
  sandbox: Maybe<Sandbox>;
};

export type RootQueryTypeSandboxArgs = {
  sandboxId: Scalars['ID'];
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
  alias: Maybe<Scalars['String']>;
  author: Maybe<User>;
  authorization: Authorization;
  collaborators: Array<Collaborator>;
  collection: Maybe<Collection>;
  comment: Maybe<Comment>;
  comments: Array<Comment>;
  /** If the sandbox is a template this will be set */
  customTemplate: Maybe<Template>;
  description: Maybe<Scalars['String']>;
  forkedTemplate: Maybe<Template>;
  /** If the sandbox has a git repo tied to it this will be set */
  git: Maybe<Git>;
  id: Scalars['ID'];
  insertedAt: Scalars['String'];
  invitations: Array<Invitation>;
  privacy: Scalars['Int'];
  removedAt: Maybe<Scalars['String']>;
  screenshotOutdated: Scalars['Boolean'];
  screenshotUrl: Maybe<Scalars['String']>;
  source: Source;
  title: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

/** A Sandbox */
export type SandboxCommentArgs = {
  commentId: Scalars['ID'];
};

export type Source = {
  __typename?: 'Source';
  id: Maybe<Scalars['ID']>;
  template: Maybe<Scalars['String']>;
};

export type Team = {
  __typename?: 'Team';
  bookmarkedTemplates: Array<Template>;
  collections: Array<Collection>;
  creatorId: Maybe<Scalars['ID']>;
  description: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  invitees: Array<User>;
  name: Scalars['String'];
  templates: Array<Template>;
  users: Array<User>;
};

/** A Template */
export type Template = {
  __typename?: 'Template';
  bookmarked: Maybe<Array<Maybe<Bookmarked>>>;
  color: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  iconUrl: Maybe<Scalars['String']>;
  id: Maybe<Scalars['ID']>;
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
  id: Scalars['ID'];
  lastName: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
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

export type ListPersonalTemplatesQueryVariables = {};

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

export type ListTemplatesQueryVariables = {
  showAll: Maybe<Scalars['Boolean']>;
};

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

export type ListPersonalBookmarkedTemplatesQueryVariables = {};

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

export type MakeSandboxesTemplateMutationVariables = {
  sandboxIds: Array<Scalars['ID']>;
};

export type MakeSandboxesTemplateMutation = {
  __typename?: 'RootMutationType';
} & {
  makeSandboxesTemplates: Array<
    { __typename?: 'Template' } & Pick<Template, 'id'>
  >;
};

export type UnmakeSandboxesTemplateMutationVariables = {
  sandboxIds: Array<Scalars['ID']>;
};

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

export type AddCollaboratorMutationVariables = {
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
  authorization: Authorization;
};

export type AddCollaboratorMutation = { __typename?: 'RootMutationType' } & {
  addCollaborator: { __typename?: 'Collaborator' } & CollaboratorFragment;
};

export type RemoveCollaboratorMutationVariables = {
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
};

export type RemoveCollaboratorMutation = { __typename?: 'RootMutationType' } & {
  removeCollaborator: { __typename?: 'Collaborator' } & CollaboratorFragment;
};

export type ChangeCollaboratorAuthorizationMutationVariables = {
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
  authorization: Authorization;
};

export type ChangeCollaboratorAuthorizationMutation = {
  __typename?: 'RootMutationType';
} & {
  changeCollaboratorAuthorization: {
    __typename?: 'Collaborator';
  } & CollaboratorFragment;
};

export type InviteCollaboratorMutationVariables = {
  sandboxId: Scalars['ID'];
  authorization: Authorization;
  email: Scalars['String'];
};

export type InviteCollaboratorMutation = { __typename?: 'RootMutationType' } & {
  createSandboxInvitation: { __typename?: 'Invitation' } & InvitationFragment;
};

export type RevokeSandboxInvitationMutationVariables = {
  sandboxId: Scalars['ID'];
  invitationId: Scalars['ID'];
};

export type RevokeSandboxInvitationMutation = {
  __typename?: 'RootMutationType';
} & {
  revokeSandboxInvitation: { __typename?: 'Invitation' } & InvitationFragment;
};

export type ChangeSandboxInvitationAuthorizationMutationVariables = {
  sandboxId: Scalars['ID'];
  invitationId: Scalars['ID'];
  authorization: Authorization;
};

export type ChangeSandboxInvitationAuthorizationMutation = {
  __typename?: 'RootMutationType';
} & {
  changeSandboxInvitationAuthorization: {
    __typename?: 'Invitation';
  } & InvitationFragment;
};

export type RedeemSandboxInvitationMutationVariables = {
  sandboxId: Scalars['ID'];
  invitationToken: Scalars['String'];
};

export type RedeemSandboxInvitationMutation = {
  __typename?: 'RootMutationType';
} & {
  redeemSandboxInvitation: { __typename?: 'Invitation' } & InvitationFragment;
};

export type SandboxCollaboratorsQueryVariables = {
  sandboxId: Scalars['ID'];
};

export type SandboxCollaboratorsQuery = { __typename?: 'RootQueryType' } & {
  sandbox: Maybe<
    { __typename?: 'Sandbox' } & {
      collaborators: Array<
        { __typename?: 'Collaborator' } & CollaboratorFragment
      >;
    }
  >;
};

export type SandboxInvitationsQueryVariables = {
  sandboxId: Scalars['ID'];
};

export type SandboxInvitationsQuery = { __typename?: 'RootQueryType' } & {
  sandbox: Maybe<
    { __typename?: 'Sandbox' } & {
      invitations: Array<{ __typename?: 'Invitation' } & InvitationFragment>;
    }
  >;
};

export type OnCollaboratorAddedSubscriptionVariables = {
  sandboxId: Scalars['ID'];
};

export type OnCollaboratorAddedSubscription = {
  __typename?: 'RootSubscriptionType';
} & {
  collaboratorAdded: { __typename?: 'Collaborator' } & CollaboratorFragment;
};

export type OnCollaboratorChangedSubscriptionVariables = {
  sandboxId: Scalars['ID'];
};

export type OnCollaboratorChangedSubscription = {
  __typename?: 'RootSubscriptionType';
} & {
  collaboratorChanged: { __typename?: 'Collaborator' } & CollaboratorFragment;
};

export type OnCollaboratorRemovedSubscriptionVariables = {
  sandboxId: Scalars['ID'];
};

export type OnCollaboratorRemovedSubscription = {
  __typename?: 'RootSubscriptionType';
} & {
  collaboratorRemoved: { __typename?: 'Collaborator' } & CollaboratorFragment;
};

export type OnInvitationCreatedSubscriptionVariables = {
  sandboxId: Scalars['ID'];
};

export type OnInvitationCreatedSubscription = {
  __typename?: 'RootSubscriptionType';
} & { invitationCreated: { __typename?: 'Invitation' } & InvitationFragment };

export type OnInvitationRemovedSubscriptionVariables = {
  sandboxId: Scalars['ID'];
};

export type OnInvitationRemovedSubscription = {
  __typename?: 'RootSubscriptionType';
} & { invitationRemoved: { __typename?: 'Invitation' } & InvitationFragment };

export type OnInvitationChangedSubscriptionVariables = {
  sandboxId: Scalars['ID'];
};

export type OnInvitationChangedSubscription = {
  __typename?: 'RootSubscriptionType';
} & { invitationChanged: { __typename?: 'Invitation' } & InvitationFragment };

export type OnSandboxChangedSubscriptionVariables = {
  sandboxId: Scalars['ID'];
};

export type OnSandboxChangedSubscription = {
  __typename?: 'RootSubscriptionType';
} & { sandboxChanged: { __typename?: 'Sandbox' } & SandboxChangedFragment };

export type CommentFragment = { __typename?: 'Comment' } & Pick<
  Comment,
  'id' | 'content' | 'insertedAt' | 'updatedAt' | 'isResolved' | 'replyCount'
> & {
    references: Array<
      { __typename?: 'Reference' } & Pick<
        Reference,
        'id' | 'resource' | 'type'
      > & {
          metadata: { __typename?: 'CodeReferenceMetadata' } & Pick<
            CodeReferenceMetadata,
            'anchor' | 'code' | 'head' | 'path'
          >;
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
    references: Array<
      { __typename?: 'Reference' } & Pick<
        Reference,
        'id' | 'resource' | 'type'
      > & {
          metadata: { __typename?: 'CodeReferenceMetadata' } & Pick<
            CodeReferenceMetadata,
            'anchor' | 'code' | 'head' | 'path'
          >;
        }
    >;
    user: { __typename?: 'User' } & Pick<
      User,
      'id' | 'name' | 'username' | 'avatarUrl'
    >;
    parentComment: Maybe<{ __typename?: 'Comment' } & Pick<Comment, 'id'>>;
    comments: Array<{ __typename?: 'Comment' } & CommentFragment>;
  };

export type CreateCommentMutationVariables = {
  id: Maybe<Scalars['ID']>;
  content: Scalars['String'];
  sandboxId: Scalars['ID'];
  parentCommentId: Maybe<Scalars['ID']>;
  codeReference: Maybe<CodeReference>;
};

export type CreateCommentMutation = { __typename?: 'RootMutationType' } & {
  createComment: { __typename?: 'Comment' } & CommentFragment;
};

export type DeleteCommentMutationVariables = {
  commentId: Scalars['ID'];
  sandboxId: Scalars['ID'];
};

export type DeleteCommentMutation = { __typename?: 'RootMutationType' } & {
  deleteComment: { __typename?: 'Comment' } & Pick<Comment, 'id'>;
};

export type UpdateCommentMutationVariables = {
  commentId: Scalars['ID'];
  sandboxId: Scalars['ID'];
  content: Maybe<Scalars['String']>;
};

export type UpdateCommentMutation = { __typename?: 'RootMutationType' } & {
  updateComment: { __typename?: 'Comment' } & Pick<Comment, 'id'>;
};

export type ResolveCommentMutationVariables = {
  commentId: Scalars['ID'];
  sandboxId: Scalars['ID'];
};

export type ResolveCommentMutation = { __typename?: 'RootMutationType' } & {
  resolveComment: { __typename?: 'Comment' } & Pick<Comment, 'id'>;
};

export type UnresolveCommentMutationVariables = {
  commentId: Scalars['ID'];
  sandboxId: Scalars['ID'];
};

export type UnresolveCommentMutation = { __typename?: 'RootMutationType' } & {
  unresolveComment: { __typename?: 'Comment' } & Pick<Comment, 'id'>;
};

export type SandboxCommentQueryVariables = {
  sandboxId: Scalars['ID'];
  commentId: Scalars['ID'];
};

export type SandboxCommentQuery = { __typename?: 'RootQueryType' } & {
  sandbox: Maybe<
    { __typename?: 'Sandbox' } & {
      comment: Maybe<{ __typename?: 'Comment' } & CommentWithRepliesFragment>;
    }
  >;
};

export type SandboxCommentsQueryVariables = {
  sandboxId: Scalars['ID'];
};

export type SandboxCommentsQuery = { __typename?: 'RootQueryType' } & {
  sandbox: Maybe<
    { __typename?: 'Sandbox' } & {
      comments: Array<{ __typename?: 'Comment' } & CommentFragment>;
    }
  >;
};

export type CommentAddedSubscriptionVariables = {
  sandboxId: Scalars['ID'];
};

export type CommentAddedSubscription = {
  __typename?: 'RootSubscriptionType';
} & {
  commentAdded: { __typename?: 'Comment' } & {
    sandbox: { __typename?: 'Sandbox' } & Pick<Sandbox, 'id'>;
  } & CommentFragment;
};

export type CommentChangedSubscriptionVariables = {
  sandboxId: Scalars['ID'];
};

export type CommentChangedSubscription = {
  __typename?: 'RootSubscriptionType';
} & {
  commentChanged: { __typename?: 'Comment' } & {
    sandbox: { __typename?: 'Sandbox' } & Pick<Sandbox, 'id'>;
  } & CommentFragment;
};

export type CommentRemovedSubscriptionVariables = {
  sandboxId: Scalars['ID'];
};

export type CommentRemovedSubscription = {
  __typename?: 'RootSubscriptionType';
} & {
  commentRemoved: { __typename?: 'Comment' } & {
    sandbox: { __typename?: 'Sandbox' } & Pick<Sandbox, 'id'>;
  } & CommentFragment;
};

export type TeamsQueryVariables = {};

export type TeamsQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      teams: Array<{ __typename?: 'Team' } & Pick<Team, 'id' | 'name'>>;
    }
  >;
};

export type UnbookmarkTemplateFromDashboardMutationVariables = {
  template: Scalars['ID'];
  teamId: Maybe<Scalars['ID']>;
};

export type UnbookmarkTemplateFromDashboardMutation = {
  __typename?: 'RootMutationType';
} & {
  unbookmarkTemplate: Maybe<
    { __typename?: 'Template' } & Pick<Template, 'id'> & {
        bookmarked: Maybe<
          Array<
            Maybe<
              { __typename?: 'Bookmarked' } & Pick<
                Bookmarked,
                'isBookmarked'
              > & {
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
  'id' | 'name' | 'description' | 'creatorId'
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

export type TeamsSidebarQueryVariables = {};

export type TeamsSidebarQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      teams: Array<{ __typename?: 'Team' } & Pick<Team, 'id' | 'name'>>;
    }
  >;
};

export type CreateTeamMutationVariables = {
  name: Scalars['String'];
};

export type CreateTeamMutation = { __typename?: 'RootMutationType' } & {
  createTeam: Maybe<{ __typename?: 'Team' } & TeamFragment>;
};

export type PathedSandboxesFoldersQueryVariables = {
  teamId: Maybe<Scalars['ID']>;
};

export type PathedSandboxesFoldersQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      collections: Array<
        { __typename?: 'Collection' } & SidebarCollectionFragment
      >;
    }
  >;
};

export type CreateCollectionMutationVariables = {
  path: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
};

export type CreateCollectionMutation = { __typename?: 'RootMutationType' } & {
  createCollection: { __typename?: 'Collection' } & SidebarCollectionFragment;
};

export type DeleteCollectionMutationVariables = {
  path: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
};

export type DeleteCollectionMutation = { __typename?: 'RootMutationType' } & {
  deleteCollection: Array<
    { __typename?: 'Collection' } & SidebarCollectionFragment
  >;
};

export type RenameCollectionMutationVariables = {
  path: Scalars['String'];
  newPath: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
  newTeamId: Maybe<Scalars['ID']>;
};

export type RenameCollectionMutation = { __typename?: 'RootMutationType' } & {
  renameCollection: Array<
    { __typename?: 'Collection' } & SidebarCollectionFragment
  >;
};

export type AddToCollectionMutationVariables = {
  collectionPath: Scalars['String'];
  sandboxIds: Array<Scalars['ID']>;
  teamId: Maybe<Scalars['ID']>;
};

export type AddToCollectionMutation = { __typename?: 'RootMutationType' } & {
  addToCollection: { __typename?: 'Collection' } & {
    sandboxes: Array<{ __typename?: 'Sandbox' } & SandboxFragment>;
  };
};

export type DeleteSandboxesMutationVariables = {
  sandboxIds: Array<Scalars['ID']>;
};

export type DeleteSandboxesMutation = { __typename?: 'RootMutationType' } & {
  deleteSandboxes: Array<{ __typename?: 'Sandbox' } & SandboxFragment>;
};

export type SetSandboxesPrivacyMutationVariables = {
  sandboxIds: Array<Scalars['ID']>;
  privacy: Scalars['Int'];
};

export type SetSandboxesPrivacyMutation = {
  __typename?: 'RootMutationType';
} & {
  setSandboxesPrivacy: Array<{ __typename?: 'Sandbox' } & SandboxFragment>;
};

export type RenameSandboxMutationVariables = {
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type RenameSandboxMutation = { __typename?: 'RootMutationType' } & {
  renameSandbox: { __typename?: 'Sandbox' } & SandboxFragment;
};

export type PermanentlyDeleteSandboxesMutationVariables = {
  sandboxIds: Array<Scalars['ID']>;
};

export type PermanentlyDeleteSandboxesMutation = {
  __typename?: 'RootMutationType';
} & {
  permanentlyDeleteSandboxes: Array<
    { __typename?: 'Sandbox' } & Pick<Sandbox, 'id'>
  >;
};

export type PathedSandboxesQueryVariables = {
  path: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
};

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

export type RecentSandboxesQueryVariables = {
  orderField: Scalars['String'];
  orderDirection: Direction;
};

export type RecentSandboxesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      sandboxes: Array<{ __typename?: 'Sandbox' } & SandboxFragment>;
    }
  >;
};

export type SearchSandboxesQueryVariables = {};

export type SearchSandboxesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      sandboxes: Array<{ __typename?: 'Sandbox' } & SandboxFragment>;
    }
  >;
};

export type DeletedSandboxesQueryVariables = {};

export type DeletedSandboxesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      sandboxes: Array<{ __typename?: 'Sandbox' } & SandboxFragment>;
    }
  >;
};

export type TeamQueryVariables = {
  id: Scalars['ID'];
};

export type TeamQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      team: Maybe<{ __typename?: 'Team' } & TeamFragment>;
    }
  >;
};

export type LeaveTeamMutationVariables = {
  teamId: Scalars['ID'];
};

export type LeaveTeamMutation = { __typename?: 'RootMutationType' } & Pick<
  RootMutationType,
  'leaveTeam'
>;

export type RemoveFromTeamMutationVariables = {
  teamId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type RemoveFromTeamMutation = { __typename?: 'RootMutationType' } & {
  removeFromTeam: Maybe<{ __typename?: 'Team' } & TeamFragment>;
};

export type InviteToTeamMutationVariables = {
  teamId: Scalars['ID'];
  username: Scalars['String'];
};

export type InviteToTeamMutation = { __typename?: 'RootMutationType' } & {
  inviteToTeam: Maybe<{ __typename?: 'Team' } & TeamFragment>;
};

export type RevokeTeamInvitationMutationVariables = {
  teamId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type RevokeTeamInvitationMutation = {
  __typename?: 'RootMutationType';
} & { revokeTeamInvitation: Maybe<{ __typename?: 'Team' } & TeamFragment> };

export type AcceptTeamInvitationMutationVariables = {
  teamId: Scalars['ID'];
};

export type AcceptTeamInvitationMutation = {
  __typename?: 'RootMutationType';
} & { acceptTeamInvitation: Maybe<{ __typename?: 'Team' } & TeamFragment> };

export type RejectTeamInvitationMutationVariables = {
  teamId: Scalars['ID'];
};

export type RejectTeamInvitationMutation = {
  __typename?: 'RootMutationType';
} & Pick<RootMutationType, 'rejectTeamInvitation'>;

export type SetTeamDescriptionMutationVariables = {
  teamId: Scalars['ID'];
  description: Scalars['String'];
};

export type SetTeamDescriptionMutation = { __typename?: 'RootMutationType' } & {
  setTeamDescription: Maybe<{ __typename?: 'Team' } & TeamFragment>;
};

export type BookmarkTemplateV2MutationVariables = {
  template: Scalars['ID'];
  team: Maybe<Scalars['ID']>;
};

export type BookmarkTemplateV2Mutation = { __typename?: 'RootMutationType' } & {
  template: Maybe<{ __typename?: 'Template' } & BookmarkTemplateFieldsFragment>;
};

export type UnbookmarkTemplateV2MutationVariables = {
  template: Scalars['ID'];
  team: Maybe<Scalars['ID']>;
};

export type UnbookmarkTemplateV2Mutation = {
  __typename?: 'RootMutationType';
} & {
  template: Maybe<{ __typename?: 'Template' } & BookmarkTemplateFieldsFragment>;
};

export type BookmarkTemplateFieldsV2Fragment = {
  __typename?: 'Template';
} & Pick<Template, 'id'> & {
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

export type BookmarkedSandboxInfoV2QueryVariables = {
  sandboxId: Scalars['ID'];
};

export type BookmarkedSandboxInfoV2Query = { __typename?: 'RootQueryType' } & {
  sandbox: Maybe<
    { __typename?: 'Sandbox' } & Pick<Sandbox, 'id'> & {
        author: Maybe<
          { __typename?: 'User' } & Pick<User, 'id'> & {
              name: User['username'];
            }
        >;
        customTemplate: Maybe<
          { __typename?: 'Template' } & BookmarkTemplateFieldsV2Fragment
        >;
      }
  >;
};

export type BookmarkTemplateMutationVariables = {
  template: Scalars['ID'];
  team: Maybe<Scalars['ID']>;
};

export type BookmarkTemplateMutation = { __typename?: 'RootMutationType' } & {
  template: Maybe<{ __typename?: 'Template' } & BookmarkTemplateFieldsFragment>;
};

export type UnbookmarkTemplateMutationVariables = {
  template: Scalars['ID'];
  team: Maybe<Scalars['ID']>;
};

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

export type BookmarkedSandboxInfoQueryVariables = {
  sandboxId: Scalars['ID'];
};

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
