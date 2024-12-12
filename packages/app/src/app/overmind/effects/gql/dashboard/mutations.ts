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
  _AcceptTeamInvitationMutation,
  _AcceptTeamInvitationMutationVariables,
  _RejectTeamInvitationMutation,
  _RejectTeamInvitationMutationVariables,
  _CreateTeamMutation,
  _CreateTeamMutationVariables,
  _RenameSandboxMutation,
  _RenameSandboxMutationVariables,
  _MakeSandboxesTemplateMutation,
  _MakeSandboxesTemplateMutationVariables,
  CreateFolderMutation,
  CreateFolderMutationVariables,
  _SetTeamNameMutation,
  _SetTeamNameMutationVariables,
  DeleteWorkspaceMutation,
  DeleteWorkspaceMutationVariables,
  SetTeamMinimumPrivacyMutation,
  SetTeamMinimumPrivacyMutationVariables,
  SetPreventSandboxesLeavingWorkspaceMutation,
  SetPreventSandboxesLeavingWorkspaceMutationVariables,
  SetPreventSandboxesExportMutation,
  SetPreventSandboxesExportMutationVariables,
  DeleteCurrentUserMutation,
  DeleteCurrentUserMutationVariables,
  CancelDeleteCurrentUserMutation,
  CancelDeleteCurrentUserMutationVariables,
  UpdateCurrentUserMutation,
  UpdateCurrentUserMutationVariables,
  ImportProjectMutation,
  ImportProjectMutationVariables,
  DeleteProjectMutation,
  DeleteProjectMutationVariables,
  DeleteBranchMutation,
  DeleteBranchMutationVariables,
  CreateBranchMutation,
  CreateBranchMutationVariables,
  SetTeamLimitsMutation,
  SetTeamLimitsMutationVariables,
  PreviewConvertToUsageBillingMutation,
  PreviewConvertToUsageBillingMutationVariables,
  ConvertToUsageBillingMutation,
  ConvertToUsageBillingMutationVariables,
  UpdateProjectVmTierMutationVariables,
  UpdateProjectVmTierMutation,
  UpdateSubscriptionPlanMutationVariables,
  UpdateSubscriptionPlanMutation,
  SetTeamMetadataMutation,
  SetTeamMetadataMutationVariables,
  JoinEligibleWorkspaceMutation,
  JoinEligibleWorkspaceMutationVariables,
  PreviewUpdateUsageSubscriptionPlanMutationVariables,
  PreviewUpdateUsageSubscriptionPlanMutation,
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
    $privacy: Int
  ) {
    addToCollectionOrTeam(
      collectionPath: $collectionPath
      sandboxIds: $sandboxIds
      teamId: $teamId
      privacy: $privacy
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
  _SetTeamNameMutation,
  _SetTeamNameMutationVariables
> = gql`
  mutation _SetTeamName($teamId: UUID4!, $name: String!) {
    setTeamName(teamId: $teamId, name: $name) {
      ...teamFragmentDashboard
    }
  }
  ${teamFragmentDashboard}
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

export const setTeamLimits: Query<
  SetTeamLimitsMutation,
  SetTeamLimitsMutationVariables
> = gql`
  mutation SetTeamLimits($teamId: UUID4!, $onDemandSpendingLimit: Int!) {
    setTeamLimits(
      teamId: $teamId
      onDemandSpendingLimit: $onDemandSpendingLimit
    )
  }
`;

export const previewConvertToUsageBilling: Query<
  PreviewConvertToUsageBillingMutation,
  PreviewConvertToUsageBillingMutationVariables
> = gql`
  mutation PreviewConvertToUsageBilling(
    $teamId: UUID4!
    $addons: [String!]!
    $plan: String!
    $billingInterval: SubscriptionInterval
  ) {
    previewConvertToUsageBilling(
      plan: $plan
      addons: $addons
      teamId: $teamId
      billingInterval: $billingInterval
    ) {
      total
      totalExcludingTax
    }
  }
`;

export const convertToUsageBilling: Query<
  ConvertToUsageBillingMutation,
  ConvertToUsageBillingMutationVariables
> = gql`
  mutation ConvertToUsageBilling(
    $teamId: UUID4!
    $addons: [String!]!
    $plan: String!
    $billingInterval: SubscriptionInterval
  ) {
    convertToUsageBilling(
      plan: $plan
      addons: $addons
      teamId: $teamId
      billingInterval: $billingInterval
    )
  }
`;

export const previewUpdateSubscriptionPlan: Query<
  PreviewUpdateUsageSubscriptionPlanMutation,
  PreviewUpdateUsageSubscriptionPlanMutationVariables
> = gql`
  mutation PreviewUpdateUsageSubscriptionPlan(
    $teamId: UUID4!
    $plan: String!
    $billingInterval: SubscriptionInterval
  ) {
    previewUpdateUsageSubscriptionPlan(
      plan: $plan
      teamId: $teamId
      billingInterval: $billingInterval
    ) {
      total
      totalExcludingTax
      updateMoment
    }
  }
`;

export const updateSubscriptionPlan: Query<
  UpdateSubscriptionPlanMutation,
  UpdateSubscriptionPlanMutationVariables
> = gql`
  mutation UpdateSubscriptionPlan(
    $teamId: UUID4!
    $plan: String!
    $billingInterval: SubscriptionInterval
  ) {
    updateUsageSubscriptionPlan(
      plan: $plan
      teamId: $teamId
      billingInterval: $billingInterval
    )
  }
`;

export const updateProjectVmTier: Query<
  UpdateProjectVmTierMutation,
  UpdateProjectVmTierMutationVariables
> = gql`
  mutation UpdateProjectVmTier($projectId: UUID4!, $vmTier: Int!) {
    updateProjectVmTier(projectId: $projectId, vmTier: $vmTier) {
      cpu
      memory
      storage
    }
  }
`;

export const setTeamMetadata: Query<
  SetTeamMetadataMutation,
  SetTeamMetadataMutationVariables
> = gql`
  mutation SetTeamMetadata($teamId: UUID4!, $useCases: [String!]!) {
    setTeamMetadata(teamId: $teamId, metadata: { useCases: $useCases }) {
      ...teamFragmentDashboard
    }
  }
  ${teamFragmentDashboard}
`;

export const joinEligibleWorkspace: Query<
  JoinEligibleWorkspaceMutation,
  JoinEligibleWorkspaceMutationVariables
> = gql`
  mutation JoinEligibleWorkspace($workspaceId: ID!) {
    joinEligibleWorkspace(workspaceId: $workspaceId) {
      id
    }
  }
`;
