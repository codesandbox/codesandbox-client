import {
  _UnmakeSandboxesTemplateMutation,
  _UnmakeSandboxesTemplateMutationVariables,
  RenameFolderMutation,
  DeleteFolderMutation,
  DeleteFolderMutationVariables,
  RenameFolderMutationVariables,
  AddToFolderMutation,
  AddToFolderMutationVariables,
  MoveToTrashMutation,
  MoveToTrashMutationVariables,
  _PermanentlyDeleteSandboxesMutationVariables,
  ChangePrivacyMutation,
  ChangePrivacyMutationVariables,
  ChangeFrozenMutation,
  ChangeFrozenMutationVariables,
  _PermanentlyDeleteSandboxesMutation,
  _LeaveTeamMutationVariables,
  _LeaveTeamMutation,
  _RemoveFromTeamMutation,
  _RemoveFromTeamMutationVariables,
  _InviteToTeamMutation,
  _InviteToTeamMutationVariables,
  _InviteToTeamViaEmailMutation,
  _InviteToTeamViaEmailMutationVariables,
  _RevokeTeamInvitationMutation,
  _RevokeTeamInvitationMutationVariables,
  _AcceptTeamInvitationMutation,
  _AcceptTeamInvitationMutationVariables,
  _RejectTeamInvitationMutation,
  _RejectTeamInvitationMutationVariables,
  _SetTeamDescriptionMutation,
  _SetTeamDescriptionMutationVariables,
  _CreateTeamMutation,
  _CreateTeamMutationVariables,
  _RenameSandboxMutation,
  _RenameSandboxMutationVariables,
  _MakeSandboxesTemplateMutation,
  _MakeSandboxesTemplateMutationVariables,
  CreateFolderMutation,
  CreateFolderMutationVariables,
  SetTeamNameMutation,
  SetTeamNameMutationVariables,
  ChangeTeamMemberAuthorizationMutation,
  ChangeTeamMemberAuthorizationMutationVariables,
  CreateOrUpdateNpmRegistryMutation,
  CreateOrUpdateNpmRegistryMutationVariables,
  DeleteNpmRegistryMutation,
  DeleteNpmRegistryMutationVariables,
  DeleteWorkspaceMutation,
  DeleteWorkspaceMutationVariables,
  SetTeamMinimumPrivacyMutation,
  SetTeamMinimumPrivacyMutationVariables,
  SetWorkspaceSandboxSettingsMutation,
  SetWorkspaceSandboxSettingsMutationVariables,
  SetPreventSandboxesLeavingWorkspaceMutation,
  SetPreventSandboxesLeavingWorkspaceMutationVariables,
  SetPreventSandboxesExportMutation,
  SetPreventSandboxesExportMutationVariables,
  SetDefaultTeamMemberAuthorizationMutation,
  SetDefaultTeamMemberAuthorizationMutationVariables,
  DeleteCurrentUserMutation,
  DeleteCurrentUserMutationVariables,
  CancelDeleteCurrentUserMutation,
  CancelDeleteCurrentUserMutationVariables,
  UpdateSubscriptionBillingIntervalMutation,
  UpdateSubscriptionBillingIntervalMutationVariables,
  PreviewUpdateSubscriptionBillingIntervalMutation,
  PreviewUpdateSubscriptionBillingIntervalMutationVariables,
  SoftCancelSubscriptionMutation,
  SoftCancelSubscriptionMutationVariables,
  ReactivateSubscriptionMutation,
  ReactivateSubscriptionMutationVariables,
  UpdateCurrentUserMutation,
  UpdateCurrentUserMutationVariables,
  AddSandboxesToAlbumMutation,
  AddSandboxesToAlbumMutationVariables,
  RemoveSandboxesFromAlbumMutation,
  RemoveSandboxesFromAlbumMutationVariables,
  UpdateAlbumMutation,
  UpdateAlbumMutationVariables,
  CreateAlbumMutation,
  CreateAlbumMutationVariables,
  ImportProjectMutation,
  ImportProjectMutationVariables,
  DeleteProjectMutation,
  DeleteProjectMutationVariables,
  DeleteBranchMutation,
  DeleteBranchMutationVariables,
  CreateBranchMutation,
  CreateBranchMutationVariables,
} from 'app/graphql/types';
import { gql, Query } from 'overmind-graphql';

import {
  teamFragmentDashboard,
  sidebarCollectionDashboard,
  sandboxFragmentDashboard,
  currentTeamInfoFragment,
  npmRegistryFragment,
} from './fragments';

export const createTeam: Query<
  _CreateTeamMutation,
  _CreateTeamMutationVariables
> = gql`
  mutation _CreateTeam($name: String!) {
    createTeam(name: $name) {
      ...teamFragmentDashboard
    }
  }
  ${teamFragmentDashboard}
`;

export const createFolder: Query<
  CreateFolderMutation,
  CreateFolderMutationVariables
> = gql`
  mutation createFolder($path: String!, $teamId: UUID4) {
    createCollection(path: $path, teamId: $teamId) {
      ...sidebarCollectionDashboard
    }
  }
  ${sidebarCollectionDashboard}
`;

export const deleteFolder: Query<
  DeleteFolderMutation,
  DeleteFolderMutationVariables
> = gql`
  mutation deleteFolder($path: String!, $teamId: UUID4) {
    deleteCollection(path: $path, teamId: $teamId) {
      ...sidebarCollectionDashboard
    }
  }
  ${sidebarCollectionDashboard}
`;

export const renameFolder: Query<
  RenameFolderMutation,
  RenameFolderMutationVariables
> = gql`
  mutation renameFolder(
    $path: String!
    $newPath: String!
    $teamId: UUID4
    $newTeamId: UUID4
  ) {
    renameCollection(
      path: $path
      newPath: $newPath
      teamId: $teamId
      newTeamId: $newTeamId
    ) {
      ...sidebarCollectionDashboard
    }
  }
  ${sidebarCollectionDashboard}
`;

export const addSandboxToFolder: Query<
  AddToFolderMutation,
  AddToFolderMutationVariables
> = gql`
  mutation AddToFolder(
    $collectionPath: String
    $sandboxIds: [ID!]!
    $teamId: UUID4
  ) {
    addToCollectionOrTeam(
      collectionPath: $collectionPath
      sandboxIds: $sandboxIds
      teamId: $teamId
    ) {
      ...sandboxFragmentDashboard
    }
  }
  ${sandboxFragmentDashboard}
`;

export const deleteSandboxes: Query<
  MoveToTrashMutation,
  MoveToTrashMutationVariables
> = gql`
  mutation MoveToTrash($sandboxIds: [ID!]!) {
    deleteSandboxes(sandboxIds: $sandboxIds) {
      ...sandboxFragmentDashboard
    }
  }
  ${sandboxFragmentDashboard}
`;

export const changePrivacy: Query<
  ChangePrivacyMutation,
  ChangePrivacyMutationVariables
> = gql`
  mutation changePrivacy($sandboxIds: [ID!]!, $privacy: Int!) {
    setSandboxesPrivacy(sandboxIds: $sandboxIds, privacy: $privacy) {
      ...sandboxFragmentDashboard
    }
  }
  ${sandboxFragmentDashboard}
`;

export const changeFrozen: Query<
  ChangeFrozenMutation,
  ChangeFrozenMutationVariables
> = gql`
  mutation changeFrozen($sandboxIds: [ID!]!, $isFrozen: Boolean!) {
    setSandboxesFrozen(sandboxIds: $sandboxIds, isFrozen: $isFrozen) {
      ...sandboxFragmentDashboard
    }
  }
  ${sandboxFragmentDashboard}
`;

export const renameSandbox: Query<
  _RenameSandboxMutation,
  _RenameSandboxMutationVariables
> = gql`
  mutation _RenameSandbox($id: ID!, $title: String!) {
    renameSandbox(id: $id, title: $title) {
      ...sandboxFragmentDashboard
    }
  }
  ${sandboxFragmentDashboard}
`;

export const permanentlyDeleteSandboxes: Query<
  _PermanentlyDeleteSandboxesMutation,
  _PermanentlyDeleteSandboxesMutationVariables
> = gql`
  mutation _PermanentlyDeleteSandboxes($sandboxIds: [ID!]!) {
    permanentlyDeleteSandboxes(sandboxIds: $sandboxIds) {
      id
    }
  }
`;

export const leaveTeam: Query<
  _LeaveTeamMutation,
  _LeaveTeamMutationVariables
> = gql`
  mutation _LeaveTeam($teamId: UUID4!) {
    leaveTeam(teamId: $teamId)
  }
`;

export const removeFromTeam: Query<
  _RemoveFromTeamMutation,
  _RemoveFromTeamMutationVariables
> = gql`
  mutation _RemoveFromTeam($teamId: UUID4!, $userId: UUID4!) {
    removeFromTeam(teamId: $teamId, userId: $userId) {
      ...teamFragmentDashboard
    }
  }
  ${teamFragmentDashboard}
`;

export const inviteToTeam: Query<
  _InviteToTeamMutation,
  _InviteToTeamMutationVariables
> = gql`
  mutation _InviteToTeam(
    $teamId: UUID4!
    $username: String!
    $authorization: TeamMemberAuthorization
  ) {
    inviteToTeam(
      teamId: $teamId
      username: $username
      authorization: $authorization
    ) {
      ...currentTeamInfoFragment
    }
  }
  ${currentTeamInfoFragment}
`;

export const inviteToTeamViaEmail: Query<
  _InviteToTeamViaEmailMutation,
  _InviteToTeamViaEmailMutationVariables
> = gql`
  mutation _InviteToTeamViaEmail(
    $teamId: UUID4!
    $email: String!
    $authorization: TeamMemberAuthorization
  ) {
    inviteToTeamViaEmail(
      teamId: $teamId
      email: $email
      authorization: $authorization
    )
  }
`;

export const revokeTeamInvitation: Query<
  _RevokeTeamInvitationMutation,
  _RevokeTeamInvitationMutationVariables
> = gql`
  mutation _RevokeTeamInvitation($teamId: UUID4!, $userId: UUID4!) {
    revokeTeamInvitation(teamId: $teamId, userId: $userId) {
      ...currentTeamInfoFragment
    }
  }
  ${currentTeamInfoFragment}
`;

export const acceptTeamInvitation: Query<
  _AcceptTeamInvitationMutation,
  _AcceptTeamInvitationMutationVariables
> = gql`
  mutation _AcceptTeamInvitation($teamId: UUID4!) {
    acceptTeamInvitation(teamId: $teamId) {
      ...teamFragmentDashboard
    }
  }
  ${teamFragmentDashboard}
`;

export const rejectTeamInvitation: Query<
  _RejectTeamInvitationMutation,
  _RejectTeamInvitationMutationVariables
> = gql`
  mutation _RejectTeamInvitation($teamId: UUID4!) {
    rejectTeamInvitation(teamId: $teamId)
  }
`;

export const setTeamDescription: Query<
  _SetTeamDescriptionMutation,
  _SetTeamDescriptionMutationVariables
> = gql`
  mutation _SetTeamDescription($teamId: UUID4!, $description: String!) {
    setTeamDescription(teamId: $teamId, description: $description) {
      ...teamFragmentDashboard
    }
  }
  ${teamFragmentDashboard}
`;

export const unmakeSandboxesTemplate: Query<
  _UnmakeSandboxesTemplateMutation,
  _UnmakeSandboxesTemplateMutationVariables
> = gql`
  mutation _UnmakeSandboxesTemplate($sandboxIds: [ID!]!) {
    unmakeSandboxesTemplates(sandboxIds: $sandboxIds) {
      id
    }
  }
`;

export const makeSandboxesTemplate: Query<
  _MakeSandboxesTemplateMutation,
  _MakeSandboxesTemplateMutationVariables
> = gql`
  mutation _MakeSandboxesTemplate($sandboxIds: [ID!]!) {
    makeSandboxesTemplates(sandboxIds: $sandboxIds) {
      id
    }
  }
`;

export const setTeamName: Query<
  SetTeamNameMutation,
  SetTeamNameMutationVariables
> = gql`
  mutation _SetTeamName($teamId: UUID4!, $name: String!) {
    setTeamName(teamId: $teamId, name: $name) {
      ...teamFragmentDashboard
    }
  }
  ${teamFragmentDashboard}
`;

export const changeTeamMemberAuthorization: Query<
  ChangeTeamMemberAuthorizationMutation,
  ChangeTeamMemberAuthorizationMutationVariables
> = gql`
  mutation ChangeTeamMemberAuthorization(
    $teamId: UUID4!
    $userId: UUID4!
    $authorization: TeamMemberAuthorization!
    $teamManager: Boolean
  ) {
    changeTeamMemberAuthorizations(
      teamId: $teamId
      memberAuthorizations: {
        userId: $userId
        authorization: $authorization
        teamManager: $teamManager
      }
    ) {
      id
    }
  }
`;

export const createOrUpdateNpmRegistry: Query<
  CreateOrUpdateNpmRegistryMutation,
  CreateOrUpdateNpmRegistryMutationVariables
> = gql`
  mutation CreateOrUpdateNpmRegistry(
    $teamId: UUID4!
    $registryType: RegistryType!
    $registryUrl: String
    $registryAuthKey: String!
    $registryAuthType: AuthType
    $proxyEnabled: Boolean!
    $limitToScopes: Boolean!
    $enabledScopes: [String!]!
    $sandpackTrustedDomains: [String!]!
  ) {
    createOrUpdatePrivateNpmRegistry(
      teamId: $teamId
      registryType: $registryType
      registryUrl: $registryUrl
      registryAuthKey: $registryAuthKey
      authType: $registryAuthType
      proxyEnabled: $proxyEnabled
      limitToScopes: $limitToScopes
      enabledScopes: $enabledScopes
      sandpackTrustedDomains: $sandpackTrustedDomains
    ) {
      ...npmRegistry
    }
  }
  ${npmRegistryFragment}
`;

export const deleteNpmRegistry: Query<
  DeleteNpmRegistryMutation,
  DeleteNpmRegistryMutationVariables
> = gql`
  mutation DeleteNpmRegistry($teamId: UUID4!) {
    deletePrivateNpmRegistry(teamId: $teamId) {
      ...npmRegistry
    }
  }
  ${npmRegistryFragment}
`;

export const deleteWorkspace: Query<
  DeleteWorkspaceMutation,
  DeleteWorkspaceMutationVariables
> = gql`
  mutation DeleteWorkspace($teamId: UUID4!) {
    deleteWorkspace(teamId: $teamId)
  }
`;

export const setTeamMinimumPrivacy: Query<
  SetTeamMinimumPrivacyMutation,
  SetTeamMinimumPrivacyMutationVariables
> = gql`
  mutation SetTeamMinimumPrivacy(
    $teamId: UUID4!
    $minimumPrivacy: Int!
    $updateDrafts: Boolean!
  ) {
    setTeamMinimumPrivacy(
      teamId: $teamId
      minimumPrivacy: $minimumPrivacy
      updateDrafts: $updateDrafts
    ) {
      minimumPrivacy
    }
  }
`;

export const setWorkspaceSandboxSettings: Query<
  SetWorkspaceSandboxSettingsMutation,
  SetWorkspaceSandboxSettingsMutationVariables
> = gql`
  mutation setWorkspaceSandboxSettings(
    $teamId: UUID4!
    $preventSandboxLeaving: Boolean!
    $preventSandboxExport: Boolean!
  ) {
    setWorkspaceSandboxSettings(
      teamId: $teamId
      preventSandboxLeaving: $preventSandboxLeaving
      preventSandboxExport: $preventSandboxExport
    ) {
      preventSandboxLeaving
      preventSandboxExport
    }
  }
`;

export const setPreventSandboxesLeavingWorkspace: Query<
  SetPreventSandboxesLeavingWorkspaceMutation,
  SetPreventSandboxesLeavingWorkspaceMutationVariables
> = gql`
  mutation setPreventSandboxesLeavingWorkspace(
    $sandboxIds: [ID!]!
    $preventSandboxLeaving: Boolean!
  ) {
    setPreventSandboxesLeavingWorkspace(
      sandboxIds: $sandboxIds
      preventSandboxLeaving: $preventSandboxLeaving
    ) {
      id
    }
  }
`;

export const setPreventSandboxesExport: Query<
  SetPreventSandboxesExportMutation,
  SetPreventSandboxesExportMutationVariables
> = gql`
  mutation setPreventSandboxesExport(
    $sandboxIds: [ID!]!
    $preventSandboxExport: Boolean!
  ) {
    setPreventSandboxesExport(
      sandboxIds: $sandboxIds
      preventSandboxExport: $preventSandboxExport
    ) {
      id
    }
  }
`;

export const setDefaultTeamMemberAuthorization: Query<
  SetDefaultTeamMemberAuthorizationMutation,
  SetDefaultTeamMemberAuthorizationMutationVariables
> = gql`
  mutation setDefaultTeamMemberAuthorization(
    $teamId: UUID4!
    $defaultAuthorization: TeamMemberAuthorization!
  ) {
    setDefaultTeamMemberAuthorization(
      teamId: $teamId
      defaultAuthorization: $defaultAuthorization
    ) {
      defaultAuthorization
    }
  }
`;

export const deleteAccount: Query<
  DeleteCurrentUserMutation,
  DeleteCurrentUserMutationVariables
> = gql`
  mutation deleteCurrentUser {
    deleteCurrentUser
  }
`;

export const undoDeleteAccount: Query<
  CancelDeleteCurrentUserMutation,
  CancelDeleteCurrentUserMutationVariables
> = gql`
  mutation cancelDeleteCurrentUser {
    cancelDeleteCurrentUser
  }
`;

export const updateSubscriptionBillingInterval: Query<
  UpdateSubscriptionBillingIntervalMutation,
  UpdateSubscriptionBillingIntervalMutationVariables
> = gql`
  mutation updateSubscriptionBillingInterval(
    $teamId: UUID4!
    $subscriptionId: UUID4!
    $billingInterval: SubscriptionInterval!
  ) {
    updateSubscriptionBillingInterval(
      teamId: $teamId
      subscriptionId: $subscriptionId
      billingInterval: $billingInterval
    ) {
      id
    }
  }
`;

export const previewUpdateSubscriptionBillingInterval: Query<
  PreviewUpdateSubscriptionBillingIntervalMutation,
  PreviewUpdateSubscriptionBillingIntervalMutationVariables
> = gql`
  mutation previewUpdateSubscriptionBillingInterval(
    $teamId: UUID4!
    $subscriptionId: UUID4!
    $billingInterval: SubscriptionInterval!
  ) {
    previewUpdateSubscriptionBillingInterval(
      teamId: $teamId
      subscriptionId: $subscriptionId
      billingInterval: $billingInterval
    ) {
      immediatePayment {
        amount
        currency
      }
      nextPayment {
        amount
        currency
      }
    }
  }
`;

export const softCancelSubscription: Query<
  SoftCancelSubscriptionMutation,
  SoftCancelSubscriptionMutationVariables
> = gql`
  mutation softCancelSubscription($teamId: UUID4!, $subscriptionId: UUID4!) {
    softCancelSubscription(teamId: $teamId, subscriptionId: $subscriptionId) {
      id
      cancelAt
    }
  }
`;

export const reactivateSubscription: Query<
  ReactivateSubscriptionMutation,
  ReactivateSubscriptionMutationVariables
> = gql`
  mutation reactivateSubscription($teamId: UUID4!, $subscriptionId: UUID4!) {
    reactivateSubscription(teamId: $teamId, subscriptionId: $subscriptionId) {
      id
    }
  }
`;

export const updateCurrentUser: Query<
  UpdateCurrentUserMutation,
  UpdateCurrentUserMutationVariables
> = gql`
  mutation updateCurrentUser(
    $username: String!
    $name: String
    $bio: String
    $socialLinks: [String!]
  ) {
    updateCurrentUser(
      username: $username
      name: $name
      bio: $bio
      socialLinks: $socialLinks
    ) {
      username
      name
      bio
      socialLinks
    }
  }
`;

export const addSandboxesToAlbum: Query<
  AddSandboxesToAlbumMutation,
  AddSandboxesToAlbumMutationVariables
> = gql`
  mutation addSandboxesToAlbum($albumId: ID!, $sandboxIds: [ID!]!) {
    addSandboxesToAlbum(albumId: $albumId, sandboxIds: $sandboxIds) {
      id
    }
  }
`;

export const removeSandboxesFromAlbum: Query<
  RemoveSandboxesFromAlbumMutation,
  RemoveSandboxesFromAlbumMutationVariables
> = gql`
  mutation removeSandboxesFromAlbum($albumId: ID!, $sandboxIds: [ID!]!) {
    removeSandboxesFromAlbum(albumId: $albumId, sandboxIds: $sandboxIds) {
      id
    }
  }
`;

export const createAlbum: Query<
  CreateAlbumMutation,
  CreateAlbumMutationVariables
> = gql`
  mutation createAlbum($title: String!) {
    createAlbum(title: $title) {
      id
      title
    }
  }
`;

export const updateAlbum: Query<
  UpdateAlbumMutation,
  UpdateAlbumMutationVariables
> = gql`
  mutation updateAlbum($id: ID!, $title: String!) {
    updateAlbum(id: $id, title: $title) {
      id
    }
  }
`;

export const importProject: Query<
  ImportProjectMutation,
  ImportProjectMutationVariables
> = gql`
  mutation importProject($owner: String!, $name: String!, $teamId: ID!) {
    importProject(provider: GITHUB, owner: $owner, name: $name, team: $teamId) {
      id
      defaultBranch {
        name
      }
    }
  }
`;

export const deleteProject: Query<
  DeleteProjectMutation,
  DeleteProjectMutationVariables
> = gql`
  mutation deleteProject($owner: String!, $name: String!, $teamId: ID!) {
    deleteProject(provider: GITHUB, owner: $owner, name: $name, team: $teamId)
  }
`;

export const deleteBranch: Query<
  DeleteBranchMutation,
  DeleteBranchMutationVariables
> = gql`
  mutation deleteBranch($branchId: String!) {
    deleteBranch(id: $branchId)
  }
`;

export const createBranch: Query<
  CreateBranchMutation,
  CreateBranchMutationVariables
> = gql`
  mutation createBranch($owner: String!, $name: String!, $teamId: ID!) {
    createBranch(provider: GITHUB, owner: $owner, name: $name, team: $teamId) {
      id
      name
    }
  }
`;
