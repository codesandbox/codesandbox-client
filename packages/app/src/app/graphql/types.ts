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
  path: Maybe<Scalars['String']>;
  sandboxes: Maybe<Array<Maybe<Sandbox>>>;
  team: Maybe<Team>;
  teamId: Maybe<Scalars['ID']>;
  user: Maybe<User>;
};

export type CurrentUser = {
  __typename?: 'CurrentUser';
  bookmarkedTemplates: Maybe<Array<Maybe<Template>>>;
  collection: Maybe<Collection>;
  collections: Maybe<Array<Maybe<Collection>>>;
  email: Maybe<Scalars['String']>;
  firstName: Maybe<Scalars['String']>;
  id: Maybe<Scalars['ID']>;
  lastName: Maybe<Scalars['String']>;
  notifications: Maybe<Array<Maybe<Notification>>>;
  recentlyUsedTemplates: Maybe<Array<Maybe<Template>>>;
  sandboxes: Maybe<Array<Maybe<Sandbox>>>;
  team: Maybe<Team>;
  teams: Maybe<Array<Maybe<Team>>>;
  templates: Maybe<Array<Maybe<Template>>>;
  username: Maybe<Scalars['String']>;
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

export type RootMutationType = {
  __typename?: 'RootMutationType';
  /** Accept an invitation to a team */
  acceptTeamInvitation: Maybe<Team>;
  /** Add a collaborator */
  addCollaborator: Collaborator;
  /** Add sandboxes to a collection */
  addToCollection: Maybe<Collection>;
  /** bookmark a template */
  bookmarkTemplate: Maybe<Template>;
  /** Change authorization of a collaborator */
  changeCollaboratorAuthorization: Collaborator;
  changeSandboxInvitationAuthorization: Invitation;
  /** Clear notification unread count */
  clearNotificationCount: Maybe<User>;
  /** Create a collection */
  createCollection: Maybe<Collection>;
  createSandboxInvitation: Invitation;
  /** Create a team */
  createTeam: Maybe<Team>;
  /** Delete a collection and all subfolders */
  deleteCollection: Maybe<Array<Maybe<Collection>>>;
  /** Delete sandboxes */
  deleteSandboxes: Maybe<Array<Maybe<Sandbox>>>;
  /** Invite someone to a team */
  inviteToTeam: Maybe<Team>;
  /** Leave a team */
  leaveTeam: Maybe<Scalars['String']>;
  /** Make templates from sandboxes */
  makeSandboxesTemplates: Maybe<Array<Maybe<Template>>>;
  permanentlyDeleteSandboxes: Maybe<Array<Maybe<Sandbox>>>;
  redeemSandboxInvitation: Invitation;
  /** Reject an invitation to a team */
  rejectTeamInvitation: Maybe<Scalars['String']>;
  /** Remove a collaborator */
  removeCollaborator: Collaborator;
  /** Remove someone from a team */
  removeFromTeam: Maybe<Team>;
  /** Rename a collection and all subfolders */
  renameCollection: Maybe<Array<Maybe<Collection>>>;
  renameSandbox: Maybe<Sandbox>;
  revokeSandboxInvitation: Invitation;
  /** Revoke an invitation to a team */
  revokeTeamInvitation: Maybe<Team>;
  setSandboxesPrivacy: Maybe<Array<Maybe<Sandbox>>>;
  /** Set the description of the team */
  setTeamDescription: Maybe<Team>;
  /** Unbookmark a template */
  unbookmarkTemplate: Maybe<Template>;
  /** Convert templates back to sandboxes */
  unmakeSandboxesTemplates: Maybe<Array<Maybe<Template>>>;
};

export type RootMutationTypeAcceptTeamInvitationArgs = {
  teamId: Scalars['ID'];
};

export type RootMutationTypeAddCollaboratorArgs = {
  authorization: Authorization;
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
};

export type RootMutationTypeAddToCollectionArgs = {
  collectionPath: Scalars['String'];
  sandboxIds: Array<Maybe<Scalars['ID']>>;
  teamId: Maybe<Scalars['ID']>;
};

export type RootMutationTypeBookmarkTemplateArgs = {
  teamId: Maybe<Scalars['ID']>;
  templateId: Scalars['ID'];
};

export type RootMutationTypeChangeCollaboratorAuthorizationArgs = {
  authorization: Authorization;
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
};

export type RootMutationTypeChangeSandboxInvitationAuthorizationArgs = {
  authorization: Authorization;
  invitationId: Scalars['ID'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeCreateCollectionArgs = {
  path: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
};

export type RootMutationTypeCreateSandboxInvitationArgs = {
  authorization: Authorization;
  email: Scalars['String'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeCreateTeamArgs = {
  name: Scalars['String'];
};

export type RootMutationTypeDeleteCollectionArgs = {
  path: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
};

export type RootMutationTypeDeleteSandboxesArgs = {
  sandboxIds: Array<Maybe<Scalars['ID']>>;
};

export type RootMutationTypeInviteToTeamArgs = {
  teamId: Scalars['ID'];
  username: Maybe<Scalars['String']>;
};

export type RootMutationTypeLeaveTeamArgs = {
  teamId: Scalars['ID'];
};

export type RootMutationTypeMakeSandboxesTemplatesArgs = {
  sandboxIds: Array<Maybe<Scalars['ID']>>;
};

export type RootMutationTypePermanentlyDeleteSandboxesArgs = {
  sandboxIds: Array<Maybe<Scalars['ID']>>;
};

export type RootMutationTypeRedeemSandboxInvitationArgs = {
  invitationToken: Scalars['String'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeRejectTeamInvitationArgs = {
  teamId: Scalars['ID'];
};

export type RootMutationTypeRemoveCollaboratorArgs = {
  sandboxId: Scalars['ID'];
  username: Scalars['String'];
};

export type RootMutationTypeRemoveFromTeamArgs = {
  teamId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type RootMutationTypeRenameCollectionArgs = {
  newPath: Scalars['String'];
  newTeamId: Maybe<Scalars['ID']>;
  path: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
};

export type RootMutationTypeRenameSandboxArgs = {
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type RootMutationTypeRevokeSandboxInvitationArgs = {
  invitationId: Scalars['ID'];
  sandboxId: Scalars['ID'];
};

export type RootMutationTypeRevokeTeamInvitationArgs = {
  teamId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type RootMutationTypeSetSandboxesPrivacyArgs = {
  privacy: Maybe<Scalars['Int']>;
  sandboxIds: Array<Maybe<Scalars['ID']>>;
};

export type RootMutationTypeSetTeamDescriptionArgs = {
  description: Scalars['String'];
  teamId: Scalars['ID'];
};

export type RootMutationTypeUnbookmarkTemplateArgs = {
  teamId: Maybe<Scalars['ID']>;
  templateId: Scalars['ID'];
};

export type RootMutationTypeUnmakeSandboxesTemplatesArgs = {
  sandboxIds: Array<Maybe<Scalars['ID']>>;
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
  screenshotOutdated: Maybe<Scalars['Boolean']>;
  screenshotUrl: Maybe<Scalars['String']>;
  source: Source;
  title: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type Source = {
  __typename?: 'Source';
  id: Maybe<Scalars['ID']>;
  template: Maybe<Scalars['String']>;
};

export type Team = {
  __typename?: 'Team';
  bookmarkedTemplates: Maybe<Array<Maybe<Template>>>;
  collections: Maybe<Array<Maybe<Collection>>>;
  creatorId: Maybe<Scalars['ID']>;
  description: Maybe<Scalars['String']>;
  id: Maybe<Scalars['ID']>;
  invitees: Maybe<Array<Maybe<User>>>;
  name: Maybe<Scalars['String']>;
  templates: Maybe<Array<Maybe<Template>>>;
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
  avatarUrl: Maybe<Scalars['String']>;
  firstName: Maybe<Scalars['String']>;
  id: Maybe<Scalars['ID']>;
  lastName: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  username: Maybe<Scalars['String']>;
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
      templates: Maybe<
        Array<Maybe<{ __typename?: 'Template' } & TemplateFragment>>
      >;
      recentlyUsedTemplates: Maybe<
        Array<
          Maybe<
            { __typename?: 'Template' } & {
              sandbox: Maybe<
                { __typename?: 'Sandbox' } & {
                  git: Maybe<
                    { __typename?: 'Git' } & Pick<
                      Git,
                      | 'id'
                      | 'username'
                      | 'commitSha'
                      | 'path'
                      | 'repo'
                      | 'branch'
                    >
                  >;
                }
              >;
            } & TemplateFragment
          >
        >
      >;
      bookmarkedTemplates: Maybe<
        Array<Maybe<{ __typename?: 'Template' } & TemplateFragment>>
      >;
      teams: Maybe<
        Array<
          Maybe<
            { __typename?: 'Team' } & Pick<Team, 'id' | 'name'> & {
                bookmarkedTemplates: Maybe<
                  Array<Maybe<{ __typename?: 'Template' } & TemplateFragment>>
                >;
                templates: Maybe<
                  Array<Maybe<{ __typename?: 'Template' } & TemplateFragment>>
                >;
              }
          >
        >
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
      templates: Maybe<
        Array<Maybe<{ __typename?: 'Template' } & TemplateFragment>>
      >;
      teams: Maybe<
        Array<
          Maybe<
            { __typename?: 'Team' } & Pick<Team, 'id' | 'name'> & {
                templates: Maybe<
                  Array<Maybe<{ __typename?: 'Template' } & TemplateFragment>>
                >;
              }
          >
        >
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
      teams: Maybe<
        Array<
          Maybe<
            { __typename?: 'Team' } & Pick<Team, 'id' | 'name'> & {
                bookmarkedTemplates: Maybe<
                  Array<Maybe<{ __typename?: 'Template' } & TemplateFragment>>
                >;
              }
          >
        >
      >;
      bookmarkedTemplates: Maybe<
        Array<Maybe<{ __typename?: 'Template' } & TemplateFragment>>
      >;
    }
  >;
};

export type MakeSandboxesTemplateMutationVariables = {
  sandboxIds: Array<Maybe<Scalars['ID']>>;
};

export type MakeSandboxesTemplateMutation = {
  __typename?: 'RootMutationType';
} & {
  makeSandboxesTemplates: Maybe<
    Array<Maybe<{ __typename?: 'Template' } & Pick<Template, 'id'>>>
  >;
};

export type UnmakeSandboxesTemplateMutationVariables = {
  sandboxIds: Array<Maybe<Scalars['ID']>>;
};

export type UnmakeSandboxesTemplateMutation = {
  __typename?: 'RootMutationType';
} & {
  unmakeSandboxesTemplates: Maybe<
    Array<Maybe<{ __typename?: 'Template' } & Pick<Template, 'id'>>>
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
    invitees: Maybe<
      Array<
        Maybe<
          { __typename?: 'User' } & Pick<
            User,
            'id' | 'name' | 'username' | 'avatarUrl'
          >
        >
      >
    >;
  };

export type TeamsSidebarQueryVariables = {};

export type TeamsSidebarQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      teams: Maybe<
        Array<Maybe<{ __typename?: 'Team' } & Pick<Team, 'id' | 'name'>>>
      >;
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
      collections: Maybe<
        Array<Maybe<{ __typename?: 'Collection' } & SidebarCollectionFragment>>
      >;
    }
  >;
};

export type CreateCollectionMutationVariables = {
  path: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
};

export type CreateCollectionMutation = { __typename?: 'RootMutationType' } & {
  createCollection: Maybe<
    { __typename?: 'Collection' } & SidebarCollectionFragment
  >;
};

export type DeleteCollectionMutationVariables = {
  path: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
};

export type DeleteCollectionMutation = { __typename?: 'RootMutationType' } & {
  deleteCollection: Maybe<
    Array<Maybe<{ __typename?: 'Collection' } & SidebarCollectionFragment>>
  >;
};

export type RenameCollectionMutationVariables = {
  path: Scalars['String'];
  newPath: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
  newTeamId: Maybe<Scalars['ID']>;
};

export type RenameCollectionMutation = { __typename?: 'RootMutationType' } & {
  renameCollection: Maybe<
    Array<Maybe<{ __typename?: 'Collection' } & SidebarCollectionFragment>>
  >;
};

export type AddToCollectionMutationVariables = {
  collectionPath: Scalars['String'];
  sandboxIds: Array<Maybe<Scalars['ID']>>;
  teamId: Maybe<Scalars['ID']>;
};

export type AddToCollectionMutation = { __typename?: 'RootMutationType' } & {
  addToCollection: Maybe<
    { __typename?: 'Collection' } & {
      sandboxes: Maybe<
        Array<Maybe<{ __typename?: 'Sandbox' } & SandboxFragment>>
      >;
    }
  >;
};

export type DeleteSandboxesMutationVariables = {
  sandboxIds: Array<Maybe<Scalars['ID']>>;
};

export type DeleteSandboxesMutation = { __typename?: 'RootMutationType' } & {
  deleteSandboxes: Maybe<
    Array<Maybe<{ __typename?: 'Sandbox' } & SandboxFragment>>
  >;
};

export type SetSandboxesPrivacyMutationVariables = {
  sandboxIds: Array<Maybe<Scalars['ID']>>;
  privacy: Scalars['Int'];
};

export type SetSandboxesPrivacyMutation = {
  __typename?: 'RootMutationType';
} & {
  setSandboxesPrivacy: Maybe<
    Array<Maybe<{ __typename?: 'Sandbox' } & SandboxFragment>>
  >;
};

export type RenameSandboxMutationVariables = {
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type RenameSandboxMutation = { __typename?: 'RootMutationType' } & {
  renameSandbox: Maybe<{ __typename?: 'Sandbox' } & SandboxFragment>;
};

export type PermanentlyDeleteSandboxesMutationVariables = {
  sandboxIds: Array<Maybe<Scalars['ID']>>;
};

export type PermanentlyDeleteSandboxesMutation = {
  __typename?: 'RootMutationType';
} & {
  permanentlyDeleteSandboxes: Maybe<
    Array<Maybe<{ __typename?: 'Sandbox' } & SandboxFragment>>
  >;
};

export type PathedSandboxesQueryVariables = {
  path: Scalars['String'];
  teamId: Maybe<Scalars['ID']>;
};

export type PathedSandboxesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      collections: Maybe<
        Array<Maybe<{ __typename?: 'Collection' } & SidebarCollectionFragment>>
      >;
      collection: Maybe<
        { __typename?: 'Collection' } & Pick<Collection, 'id' | 'path'> & {
            sandboxes: Maybe<
              Array<Maybe<{ __typename?: 'Sandbox' } & SandboxFragment>>
            >;
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
      sandboxes: Maybe<
        Array<Maybe<{ __typename?: 'Sandbox' } & SandboxFragment>>
      >;
    }
  >;
};

export type SearchSandboxesQueryVariables = {};

export type SearchSandboxesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      sandboxes: Maybe<
        Array<Maybe<{ __typename?: 'Sandbox' } & SandboxFragment>>
      >;
    }
  >;
};

export type DeletedSandboxesQueryVariables = {};

export type DeletedSandboxesQuery = { __typename?: 'RootQueryType' } & {
  me: Maybe<
    { __typename?: 'CurrentUser' } & {
      sandboxes: Maybe<
        Array<Maybe<{ __typename?: 'Sandbox' } & SandboxFragment>>
      >;
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
