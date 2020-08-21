import {
  AddCollaboratorMutation,
  AddCollaboratorMutationVariables,
  ChangeCollaboratorAuthorizationMutation,
  ChangeCollaboratorAuthorizationMutationVariables,
  ChangeSandboxInvitationAuthorizationMutation,
  ChangeSandboxInvitationAuthorizationMutationVariables,
  InviteCollaboratorMutation,
  InviteCollaboratorMutationVariables,
  RedeemSandboxInvitationMutation,
  RedeemSandboxInvitationMutationVariables,
  RemoveCollaboratorMutation,
  RemoveCollaboratorMutationVariables,
  RevokeSandboxInvitationMutation,
  RevokeSandboxInvitationMutationVariables,
} from 'app/graphql/types';
import { gql, Query } from 'overmind-graphql';

import { collaboratorFragment, sandboxInvitationFragment } from './fragments';

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
  mutation RevokeSandboxInvitation($sandboxId: ID!, $invitationId: UUID4!) {
    revokeSandboxInvitation(
      sandboxId: $sandboxId
      invitationId: $invitationId
    ) {
      ...Invitation
    }
  }
  ${sandboxInvitationFragment}
`;

export const changeSandboxInvitationAuthorization: Query<
  ChangeSandboxInvitationAuthorizationMutation,
  ChangeSandboxInvitationAuthorizationMutationVariables
> = gql`
  mutation ChangeSandboxInvitationAuthorization(
    $sandboxId: ID!
    $invitationId: UUID4!
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
