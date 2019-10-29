export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type Bookmarked = {
   __typename?: 'Bookmarked',
  entity: Maybe<BookmarkEntity>,
  isBookmarked: Maybe<Scalars['Boolean']>,
};

/** A team or the current user */
export type BookmarkEntity = Team | User;

export type Collection = {
   __typename?: 'Collection',
  id: Maybe<Scalars['ID']>,
  path: Maybe<Scalars['String']>,
  sandboxes: Maybe<Array<Maybe<Sandbox>>>,
  teamId: Maybe<Scalars['ID']>,
  user: Maybe<User>,
};

export type CurrentUser = {
   __typename?: 'CurrentUser',
  bookmarkedTemplates: Maybe<Array<Maybe<Template>>>,
  collection: Maybe<Collection>,
  collections: Maybe<Array<Maybe<Collection>>>,
  email: Maybe<Scalars['String']>,
  firstName: Maybe<Scalars['String']>,
  id: Maybe<Scalars['ID']>,
  lastName: Maybe<Scalars['String']>,
  notifications: Maybe<Array<Maybe<Notification>>>,
  sandboxes: Maybe<Array<Maybe<Sandbox>>>,
  team: Maybe<Team>,
  teams: Maybe<Array<Maybe<Team>>>,
  templates: Maybe<Array<Maybe<Template>>>,
  username: Maybe<Scalars['String']>,
};


export type CurrentUserCollectionArgs = {
  path: Scalars['String'],
  teamId: Maybe<Scalars['ID']>
};


export type CurrentUserCollectionsArgs = {
  teamId: Maybe<Scalars['ID']>
};


export type CurrentUserNotificationsArgs = {
  limit: Maybe<Scalars['Int']>,
  orderBy: Maybe<OrderBy>
};


export type CurrentUserSandboxesArgs = {
  limit: Maybe<Scalars['Int']>,
  orderBy: Maybe<OrderBy>,
  showDeleted: Maybe<Scalars['Boolean']>
};


export type CurrentUserTeamArgs = {
  id: Scalars['ID']
};


export type CurrentUserTemplatesArgs = {
  showAll: Maybe<Scalars['Boolean']>,
  teamId: Maybe<Scalars['ID']>
};

export enum Direction {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Notification = {
   __typename?: 'Notification',
  data: Maybe<Scalars['String']>,
  id: Maybe<Scalars['ID']>,
  read: Maybe<Scalars['Boolean']>,
  type: Maybe<Scalars['String']>,
};

export type OrderBy = {
  direction: Direction,
  field: Scalars['String'],
};

export type RootMutationType = {
   __typename?: 'RootMutationType',
  /** Accept an invitation to a team */
  acceptTeamInvitation: Maybe<Team>,
  /** Add sandboxes to a collection */
  addToCollection: Maybe<Collection>,
  /** bookmark a template */
  bookmarkTemplate: Maybe<Template>,
  /** Clear notification unread count */
  clearNotificationCount: Maybe<User>,
  /** Create a collection */
  createCollection: Maybe<Collection>,
  /** Create a team */
  createTeam: Maybe<Team>,
  /** Delete a collection and all subfolders */
  deleteCollection: Maybe<Array<Maybe<Collection>>>,
  /** Delete sandboxes */
  deleteSandboxes: Maybe<Array<Maybe<Sandbox>>>,
  /** Invite someone to a team */
  inviteToTeam: Maybe<Team>,
  /** Leave a team */
  leaveTeam: Maybe<Scalars['String']>,
  /** Make templates from sandboxes */
  makeSandboxesTemplates: Maybe<Array<Maybe<Template>>>,
  permanentlyDeleteSandboxes: Maybe<Array<Maybe<Sandbox>>>,
  /** Reject an invitation to a team */
  rejectTeamInvitation: Maybe<Scalars['String']>,
  /** Remove someone from a team */
  removeFromTeam: Maybe<Team>,
  /** Rename a collection and all subfolders */
  renameCollection: Maybe<Array<Maybe<Collection>>>,
  renameSandbox: Maybe<Sandbox>,
  /** Revoke an invitation to a team */
  revokeTeamInvitation: Maybe<Team>,
  setSandboxesPrivacy: Maybe<Array<Maybe<Sandbox>>>,
  /** Set the description of the team */
  setTeamDescription: Maybe<Team>,
  /** Unbookmark a template */
  unbookmarkTemplate: Maybe<Template>,
  /** Convert templates back to sandboxes */
  unmakeSandboxesTemplates: Maybe<Array<Maybe<Template>>>,
};


export type RootMutationTypeAcceptTeamInvitationArgs = {
  teamId: Scalars['ID']
};


export type RootMutationTypeAddToCollectionArgs = {
  collectionPath: Scalars['String'],
  sandboxIds: Array<Maybe<Scalars['ID']>>,
  teamId: Maybe<Scalars['ID']>
};


export type RootMutationTypeBookmarkTemplateArgs = {
  teamId: Maybe<Scalars['ID']>,
  templateId: Scalars['ID']
};


export type RootMutationTypeCreateCollectionArgs = {
  path: Scalars['String'],
  teamId: Maybe<Scalars['ID']>
};


export type RootMutationTypeCreateTeamArgs = {
  name: Scalars['String']
};


export type RootMutationTypeDeleteCollectionArgs = {
  path: Scalars['String'],
  teamId: Maybe<Scalars['ID']>
};


export type RootMutationTypeDeleteSandboxesArgs = {
  sandboxIds: Array<Maybe<Scalars['ID']>>
};


export type RootMutationTypeInviteToTeamArgs = {
  teamId: Scalars['ID'],
  username: Maybe<Scalars['String']>
};


export type RootMutationTypeLeaveTeamArgs = {
  teamId: Scalars['ID']
};


export type RootMutationTypeMakeSandboxesTemplatesArgs = {
  sandboxIds: Array<Maybe<Scalars['ID']>>
};


export type RootMutationTypePermanentlyDeleteSandboxesArgs = {
  sandboxIds: Array<Maybe<Scalars['ID']>>
};


export type RootMutationTypeRejectTeamInvitationArgs = {
  teamId: Scalars['ID']
};


export type RootMutationTypeRemoveFromTeamArgs = {
  teamId: Scalars['ID'],
  userId: Scalars['ID']
};


export type RootMutationTypeRenameCollectionArgs = {
  newPath: Scalars['String'],
  newTeamId: Maybe<Scalars['ID']>,
  path: Scalars['String'],
  teamId: Maybe<Scalars['ID']>
};


export type RootMutationTypeRenameSandboxArgs = {
  id: Scalars['ID'],
  title: Scalars['String']
};


export type RootMutationTypeRevokeTeamInvitationArgs = {
  teamId: Scalars['ID'],
  userId: Scalars['ID']
};


export type RootMutationTypeSetSandboxesPrivacyArgs = {
  privacy: Maybe<Scalars['Int']>,
  sandboxIds: Array<Maybe<Scalars['ID']>>
};


export type RootMutationTypeSetTeamDescriptionArgs = {
  description: Scalars['String'],
  teamId: Scalars['ID']
};


export type RootMutationTypeUnbookmarkTemplateArgs = {
  teamId: Maybe<Scalars['ID']>,
  templateId: Scalars['ID']
};


export type RootMutationTypeUnmakeSandboxesTemplatesArgs = {
  sandboxIds: Array<Maybe<Scalars['ID']>>
};

export type RootQueryType = {
   __typename?: 'RootQueryType',
  /** Get current user */
  me: Maybe<CurrentUser>,
  /** Get a sandbox */
  sandbox: Maybe<Sandbox>,
};


export type RootQueryTypeSandboxArgs = {
  sandboxId: Scalars['ID']
};

/** A Sandbox */
export type Sandbox = {
   __typename?: 'Sandbox',
  alias: Maybe<Scalars['String']>,
  author: Maybe<User>,
  collection: Maybe<Collection>,
  /** If the sandbox is a template this will be set */
  customTemplate: Maybe<Template>,
  description: Maybe<Scalars['String']>,
  forkedTemplate: Maybe<Template>,
  id: Maybe<Scalars['ID']>,
  insertedAt: Maybe<Scalars['String']>,
  privacy: Maybe<Scalars['Int']>,
  removedAt: Maybe<Scalars['String']>,
  screenshotOutdated: Maybe<Scalars['Boolean']>,
  screenshotUrl: Maybe<Scalars['String']>,
  source: Maybe<Source>,
  title: Maybe<Scalars['String']>,
  updatedAt: Maybe<Scalars['String']>,
};

export type Source = {
   __typename?: 'Source',
  id: Maybe<Scalars['ID']>,
  template: Maybe<Scalars['String']>,
};

export type Team = {
   __typename?: 'Team',
  bookmarkedTemplates: Maybe<Array<Maybe<Template>>>,
  collections: Maybe<Array<Maybe<Collection>>>,
  creatorId: Maybe<Scalars['ID']>,
  description: Maybe<Scalars['String']>,
  id: Maybe<Scalars['ID']>,
  invitees: Maybe<Array<Maybe<User>>>,
  name: Maybe<Scalars['String']>,
  users: Maybe<Array<Maybe<User>>>,
};

/** A Template */
export type Template = {
   __typename?: 'Template',
  bookmarked: Maybe<Array<Maybe<Bookmarked>>>,
  color: Maybe<Scalars['String']>,
  description: Maybe<Scalars['String']>,
  iconUrl: Maybe<Scalars['String']>,
  id: Maybe<Scalars['ID']>,
  insertedAt: Maybe<Scalars['String']>,
  published: Maybe<Scalars['Boolean']>,
  sandbox: Maybe<Sandbox>,
  title: Maybe<Scalars['String']>,
  updatedAt: Maybe<Scalars['String']>,
};

/** A CodeSandbox User */
export type User = {
   __typename?: 'User',
  avatarUrl: Maybe<Scalars['String']>,
  email: Maybe<Scalars['String']>,
  firstName: Maybe<Scalars['String']>,
  id: Maybe<Scalars['ID']>,
  lastName: Maybe<Scalars['String']>,
  name: Maybe<Scalars['String']>,
  username: Maybe<Scalars['String']>,
};

export type TemplateFieldsFragment = (
  { __typename?: 'Template' }
  & Pick<Template, 'id'>
  & { bookmarked: Maybe<Array<Maybe<(
    { __typename?: 'Bookmarked' }
    & Pick<Bookmarked, 'isBookmarked'>
    & { entity: Maybe<(
      { __typename: 'Team' }
      & Pick<Team, 'id' | 'name'>
    ) | (
      { __typename: 'User' }
      & Pick<User, 'id'>
      & { name: User['username'] }
    )> }
  )>>> }
);

export type BookmarkTemplateFromCardMutationVariables = {
  template: Scalars['ID'],
  team: Maybe<Scalars['ID']>
};


export type BookmarkTemplateFromCardMutation = (
  { __typename?: 'RootMutationType' }
  & { template: Maybe<(
    { __typename?: 'Template' }
    & TemplateFieldsFragment
  )> }
);

export type UnbookmarkTemplateFromCardMutationVariables = {
  template: Scalars['ID'],
  team: Maybe<Scalars['ID']>
};


export type UnbookmarkTemplateFromCardMutation = (
  { __typename?: 'RootMutationType' }
  & { template: Maybe<(
    { __typename?: 'Template' }
    & TemplateFieldsFragment
  )> }
);

export type IsBookmarkedQueryVariables = {
  id: Scalars['ID']
};


export type IsBookmarkedQuery = (
  { __typename?: 'RootQueryType' }
  & { sandbox: Maybe<(
    { __typename?: 'Sandbox' }
    & { customTemplate: Maybe<(
      { __typename?: 'Template' }
      & { bookmarked: Maybe<Array<Maybe<(
        { __typename?: 'Bookmarked' }
        & Pick<Bookmarked, 'isBookmarked'>
        & { entity: Maybe<{ __typename: 'Team' } | { __typename: 'User' }> }
      )>>> }
    )> }
  )> }
);

export type SandboxFragment = (
  { __typename?: 'Sandbox' }
  & Pick<Sandbox, 'id' | 'alias' | 'title' | 'description' | 'insertedAt' | 'updatedAt' | 'privacy' | 'screenshotUrl' | 'screenshotOutdated'>
  & { source: Maybe<(
    { __typename?: 'Source' }
    & Pick<Source, 'template'>
  )>, customTemplate: Maybe<(
    { __typename?: 'Template' }
    & Pick<Template, 'id'>
  )>, forkedTemplate: Maybe<(
    { __typename?: 'Template' }
    & Pick<Template, 'id' | 'color'>
  )>, collection: Maybe<(
    { __typename?: 'Collection' }
    & Pick<Collection, 'path' | 'teamId'>
  )> }
);

export type TemplateFragment = (
  { __typename?: 'Template' }
  & Pick<Template, 'id' | 'color' | 'iconUrl' | 'published'>
  & { sandbox: Maybe<(
    { __typename?: 'Sandbox' }
    & SandboxFragment
  )> }
);

export type ListFollowedTemplatesQueryVariables = {};


export type ListFollowedTemplatesQuery = (
  { __typename?: 'RootQueryType' }
  & { me: Maybe<(
    { __typename?: 'CurrentUser' }
    & { teams: Maybe<Array<Maybe<(
      { __typename?: 'Team' }
      & Pick<Team, 'id' | 'name'>
      & { bookmarkedTemplates: Maybe<Array<Maybe<(
        { __typename?: 'Template' }
        & TemplateFragment
      )>>> }
    )>>>, bookmarkedTemplates: Maybe<Array<Maybe<(
      { __typename?: 'Template' }
      & TemplateFragment
    )>>> }
  )> }
);

export type ListTemplatesQueryVariables = {
  teamId: Maybe<Scalars['ID']>,
  showAll: Maybe<Scalars['Boolean']>
};


export type ListTemplatesQuery = (
  { __typename?: 'RootQueryType' }
  & { me: Maybe<(
    { __typename?: 'CurrentUser' }
    & { templates: Maybe<Array<Maybe<(
      { __typename?: 'Template' }
      & Pick<Template, 'id' | 'color' | 'iconUrl' | 'published'>
      & { sandbox: Maybe<(
        { __typename?: 'Sandbox' }
        & { author: Maybe<(
          { __typename?: 'User' }
          & Pick<User, 'username'>
        )> }
        & SandboxFragment
      )> }
    )>>> }
  )> }
);

export type UnbookmarkTemplateeMutationVariables = {
  template: Scalars['ID'],
  team: Maybe<Scalars['ID']>
};


export type UnbookmarkTemplateeMutation = (
  { __typename?: 'RootMutationType' }
  & { unbookmarkTemplate: Maybe<(
    { __typename?: 'Template' }
    & Pick<Template, 'id'>
    & { bookmarked: Maybe<Array<Maybe<(
      { __typename?: 'Bookmarked' }
      & Pick<Bookmarked, 'isBookmarked'>
      & { entity: Maybe<(
        { __typename: 'Team' }
        & Pick<Team, 'id' | 'name'>
      ) | (
        { __typename: 'User' }
        & Pick<User, 'id'>
        & { name: User['username'] }
      )> }
    )>>> }
  )> }
);

export type TemplateFieldsFragment = (
  { __typename?: 'Template' }
  & Pick<Template, 'id'>
  & { bookmarked: Maybe<Array<Maybe<(
    { __typename?: 'Bookmarked' }
    & Pick<Bookmarked, 'isBookmarked'>
    & { entity: Maybe<(
      { __typename: 'Team' }
      & Pick<Team, 'id' | 'name'>
    ) | (
      { __typename: 'User' }
      & Pick<User, 'id'>
      & { name: User['username'] }
    )> }
  )>>> }
);

export type BookmarkTemplateMutationVariables = {
  template: Scalars['ID'],
  team: Maybe<Scalars['ID']>
};


export type BookmarkTemplateMutation = (
  { __typename?: 'RootMutationType' }
  & { template: Maybe<(
    { __typename?: 'Template' }
    & TemplateFieldsFragment
  )> }
);

export type UnbookmarkTemplateMutationVariables = {
  template: Scalars['ID'],
  team: Maybe<Scalars['ID']>
};


export type UnbookmarkTemplateMutation = (
  { __typename?: 'RootMutationType' }
  & { template: Maybe<(
    { __typename?: 'Template' }
    & TemplateFieldsFragment
  )> }
);

export type GetSandboxInfoQueryVariables = {
  id: Scalars['ID']
};


export type GetSandboxInfoQuery = (
  { __typename?: 'RootQueryType' }
  & { sandbox: Maybe<(
    { __typename?: 'Sandbox' }
    & Pick<Sandbox, 'id'>
    & { author: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id'>
      & { name: User['username'] }
    )>, customTemplate: Maybe<(
      { __typename?: 'Template' }
      & Pick<Template, 'id'>
      & { bookmarked: Maybe<Array<Maybe<(
        { __typename?: 'Bookmarked' }
        & Pick<Bookmarked, 'isBookmarked'>
        & { entity: Maybe<(
          { __typename: 'Team' }
          & Pick<Team, 'id' | 'name'>
        ) | (
          { __typename: 'User' }
          & Pick<User, 'id'>
          & { name: User['username'] }
        )> }
      )>>> }
    )> }
  )> }
);
