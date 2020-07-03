import {
  UnmakeSandboxesTemplateMutation,
  UnmakeSandboxesTemplateMutationVariables,
  RenameFolderMutation,
  DeleteFolderMutation,
  DeleteFolderMutationVariables,
  RenameFolderMutationVariables,
  AddToFolderMutation,
  AddToFolderMutationVariables,
  MoveToTrashMutation,
  MoveToTrashMutationVariables,
  ChangePrivacyMutationVariables,
  _PermanentlyDeleteSandboxesMutationVariables,
  ChangePrivacyMutation,
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
  MakeSandboxesTemplateMutation,
  MakeSandboxesTemplateMutationVariables,
  CreateFolderMutation,
  CreateFolderMutationVariables,
  SetTeamNameMutation,
  SetTeamNameMutationVariables,
} from 'app/graphql/types';
import { gql, Query } from 'overmind-graphql';

import {
  teamFragmentDashboard,
  sidebarCollectionDashboard,
  sandboxFragmentDashboard,
} from './fragments';

export const createTeam: Query<
  _CreateTeamMutation,
  _CreateTeamMutationVariables
> = gql`
  mutation _CreateTeam($name: String!, $pilot: Boolean) {
    createTeam(name: $name, pilot: $pilot) {
      ...teamFragmentDashboard
    }
  }
  ${teamFragmentDashboard}
`;

export const createFolder: Query<
  CreateFolderMutation,
  CreateFolderMutationVariables
> = gql`
  mutation createFolder($path: String!, $teamId: ID) {
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
  mutation deleteFolder($path: String!, $teamId: ID) {
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
    $teamId: ID
    $newTeamId: ID
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
    $teamId: ID
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
  mutation _LeaveTeam($teamId: ID!) {
    leaveTeam(teamId: $teamId)
  }
`;

export const removeFromTeam: Query<
  _RemoveFromTeamMutation,
  _RemoveFromTeamMutationVariables
> = gql`
  mutation _RemoveFromTeam($teamId: ID!, $userId: ID!) {
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
  mutation _InviteToTeam($teamId: ID!, $username: String!) {
    inviteToTeam(teamId: $teamId, username: $username) {
      ...teamFragmentDashboard
    }
  }
  ${teamFragmentDashboard}
`;

export const inviteToTeamVieEmail: Query<
  _InviteToTeamViaEmailMutation,
  _InviteToTeamViaEmailMutationVariables
> = gql`
  mutation _InviteToTeamViaEmail($teamId: ID!, $email: String!) {
    inviteToTeamViaEmail(teamId: $teamId, email: $email)
  }
`;

export const revokeTeamInvitation: Query<
  _RevokeTeamInvitationMutation,
  _RevokeTeamInvitationMutationVariables
> = gql`
  mutation _RevokeTeamInvitation($teamId: ID!, $userId: ID!) {
    revokeTeamInvitation(teamId: $teamId, userId: $userId) {
      ...teamFragmentDashboard
    }
  }
  ${teamFragmentDashboard}
`;

export const acceptTeamInvitation: Query<
  _AcceptTeamInvitationMutation,
  _AcceptTeamInvitationMutationVariables
> = gql`
  mutation _AcceptTeamInvitation($teamId: ID!) {
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
  mutation _RejectTeamInvitation($teamId: ID!) {
    rejectTeamInvitation(teamId: $teamId)
  }
`;

export const setTeamDescription: Query<
  _SetTeamDescriptionMutation,
  _SetTeamDescriptionMutationVariables
> = gql`
  mutation _SetTeamDescription($teamId: ID!, $description: String!) {
    setTeamDescription(teamId: $teamId, description: $description) {
      ...teamFragmentDashboard
    }
  }
  ${teamFragmentDashboard}
`;

export const unmakeSandboxesTemplate: Query<
  UnmakeSandboxesTemplateMutation,
  UnmakeSandboxesTemplateMutationVariables
> = gql`
  mutation _UnmakeSandboxesTemplate($sandboxIds: [ID!]!) {
    unmakeSandboxesTemplates(sandboxIds: $sandboxIds) {
      id
    }
  }
`;

export const makeSandboxesTemplate: Query<
  MakeSandboxesTemplateMutation,
  MakeSandboxesTemplateMutationVariables
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
  mutation _SetTeamName($teamId: ID!, $name: String!) {
    setTeamName(teamId: $teamId, name: $name) {
      ...teamFragmentDashboard
    }
  }
  ${teamFragmentDashboard}
`;
