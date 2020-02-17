import gql from 'graphql-tag';
import { Query } from 'app/overmind-graphql';
import {
  SandboxCollaboratorsQuery,
  SandboxCollaboratorsQueryVariables,
  OnCollaboratorAddedSubscription,
  OnCollaboratorAddedSubscriptionVariables,
  ChangeCollaboratorAuthorizationMutation,
  ChangeCollaboratorAuthorizationMutationVariables,
  OnCollaboratorChangedSubscription,
  OnCollaboratorChangedSubscriptionVariables,
  RemoveCollaboratorMutation,
  RemoveCollaboratorMutationVariables,
  AddCollaboratorMutation,
  AddCollaboratorMutationVariables,
  OnCollaboratorRemovedSubscription,
  OnCollaboratorRemovedSubscriptionVariables,
  InviteCollaboratorMutation,
  InviteCollaboratorMutationVariables,
  SandboxInvitationsQuery,
  SandboxInvitationsQueryVariables,
  RevokeSandboxInvitationMutation,
  RevokeSandboxInvitationMutationVariables,
  ChangeSandboxInvitationAuthorizationMutation,
  ChangeSandboxInvitationAuthorizationMutationVariables,
  OnInvitationCreatedSubscription,
  OnInvitationCreatedSubscriptionVariables,
  OnInvitationRemovedSubscription,
  OnInvitationRemovedSubscriptionVariables,
  OnInvitationChangedSubscription,
  OnInvitationChangedSubscriptionVariables,
  RedeemSandboxInvitationMutation,
  RedeemSandboxInvitationMutationVariables,
} from 'app/graphql/types';

export const collaboratorFragment = gql`
  fragment Collaborator on Collaborator {
    id
    authorization
    lastSeenAt
    user {
      id
      username
      avatarUrl
    }
  }
`;

export const sandboxInvitationFragment = gql`
  fragment Invitation on Invitation {
    id
    authorization
    email
  }
`;

export const collaborators: Query<
  SandboxCollaboratorsQuery,
  SandboxCollaboratorsQueryVariables
> = gql`
  query SandboxCollaborators($sandboxId: ID!) {
    sandbox(sandboxId: $sandboxId) {
      collaborators {
        ...Collaborator
      }
    }
  }
  ${collaboratorFragment}
`;

export const addCollaborator: Query<
  AddCollaboratorMutation,
  AddCollaboratorMutationVariables
> = gql`
  mutation AddCollaborator(
    $sandboxId: ID!
    $username: String!
    $authorization: Authorization!
  ) {
    addCollaborator(
      sandboxId: $sandboxId
      username: $username
      authorization: $authorization
    ) {
      ...Collaborator
    }
  }
  ${collaboratorFragment}
`;

export const removeCollaborator: Query<
  RemoveCollaboratorMutation,
  RemoveCollaboratorMutationVariables
> = gql`
  mutation RemoveCollaborator($sandboxId: ID!, $username: String!) {
    removeCollaborator(sandboxId: $sandboxId, username: $username) {
      ...Collaborator
    }
  }
  ${collaboratorFragment}
`;

export const changeCollaboratorAuthorization: Query<
  ChangeCollaboratorAuthorizationMutation,
  ChangeCollaboratorAuthorizationMutationVariables
> = gql`
  mutation ChangeCollaboratorAuthorization(
    $sandboxId: ID!
    $username: String!
    $authorization: Authorization!
  ) {
    changeCollaboratorAuthorization(
      sandboxId: $sandboxId
      username: $username
      authorization: $authorization
    ) {
      ...Collaborator
    }
  }
  ${collaboratorFragment}
`;

export const onCollaboratorAdded: Query<
  OnCollaboratorAddedSubscription,
  OnCollaboratorAddedSubscriptionVariables
> = gql`
  subscription OnCollaboratorAdded($sandboxId: ID!) {
    collaboratorAdded(sandboxId: $sandboxId) {
      ...Collaborator
    }
  }
  ${collaboratorFragment}
`;

export const onCollaboratorChanged: Query<
  OnCollaboratorChangedSubscription,
  OnCollaboratorChangedSubscriptionVariables
> = gql`
  subscription OnCollaboratorChanged($sandboxId: ID!) {
    collaboratorChanged(sandboxId: $sandboxId) {
      ...Collaborator
    }
  }
  ${collaboratorFragment}
`;

export const onCollaboratorRemoved: Query<
  OnCollaboratorRemovedSubscription,
  OnCollaboratorRemovedSubscriptionVariables
> = gql`
  subscription OnCollaboratorRemoved($sandboxId: ID!) {
    collaboratorRemoved(sandboxId: $sandboxId) {
      ...Collaborator
    }
  }
  ${collaboratorFragment}
`;

export const invitations: Query<
  SandboxInvitationsQuery,
  SandboxInvitationsQueryVariables
> = gql`
  query SandboxInvitations($sandboxId: ID!) {
    sandbox(sandboxId: $sandboxId) {
      invitations {
        ...Invitation
      }
    }
  }
  ${sandboxInvitationFragment}
`;

export const inviteCollaborator: Query<
  InviteCollaboratorMutation,
  InviteCollaboratorMutationVariables
> = gql`
  mutation InviteCollaborator(
    $sandboxId: ID!
    $authorization: Authorization!
    $email: String!
  ) {
    createSandboxInvitation(
      sandboxId: $sandboxId
      authorization: $authorization
      email: $email
    ) {
      ...Invitation
    }
  }
  ${sandboxInvitationFragment}
`;

export const revokeInvitation: Query<
  RevokeSandboxInvitationMutation,
  RevokeSandboxInvitationMutationVariables
> = gql`
  mutation RevokeSandboxInvitation($sandboxId: ID!, $invitationId: ID!) {
    revokeSandboxInvitation(
      sandboxId: $sandboxId
      invitationId: $invitationId
    ) {
      ...Invitation
    }
  }
  ${sandboxInvitationFragment}
`;

export const changeInvitationAuthorization: Query<
  ChangeSandboxInvitationAuthorizationMutation,
  ChangeSandboxInvitationAuthorizationMutationVariables
> = gql`
  mutation ChangeSandboxInvitationAuthorization(
    $sandboxId: ID!
    $invitationId: ID!
    $authorization: Authorization!
  ) {
    changeSandboxInvitationAuthorization(
      sandboxId: $sandboxId
      invitationId: $invitationId
      authorization: $authorization
    ) {
      ...Invitation
    }
  }
  ${sandboxInvitationFragment}
`;

export const redeemSandboxInvitation: Query<
  RedeemSandboxInvitationMutation,
  RedeemSandboxInvitationMutationVariables
> = gql`
  mutation RedeemSandboxInvitation($sandboxId: ID!, $invitationToken: String!) {
    redeemSandboxInvitation(
      sandboxId: $sandboxId
      invitationToken: $invitationToken
    ) {
      ...Invitation
    }
  }
  ${sandboxInvitationFragment}
`;

export const onInvitationCreated: Query<
  OnInvitationCreatedSubscription,
  OnInvitationCreatedSubscriptionVariables
> = gql`
  subscription OnInvitationCreated($sandboxId: ID!) {
    invitationCreated(sandboxId: $sandboxId) {
      ...Invitation
    }
  }
  ${sandboxInvitationFragment}
`;

export const onInvitationRemoved: Query<
  OnInvitationRemovedSubscription,
  OnInvitationRemovedSubscriptionVariables
> = gql`
  subscription OnInvitationRemoved($sandboxId: ID!) {
    invitationRemoved(sandboxId: $sandboxId) {
      ...Invitation
    }
  }
  ${sandboxInvitationFragment}
`;

export const onInvitationChanged: Query<
  OnInvitationChangedSubscription,
  OnInvitationChangedSubscriptionVariables
> = gql`
  subscription OnInvitationChanged($sandboxId: ID!) {
    invitationChanged(sandboxId: $sandboxId) {
      ...Invitation
    }
  }
  ${sandboxInvitationFragment}
`;
