import {
  OnCollaboratorAddedSubscription,
  OnCollaboratorAddedSubscriptionVariables,
  OnCollaboratorChangedSubscription,
  OnCollaboratorChangedSubscriptionVariables,
  OnCollaboratorRemovedSubscription,
  OnCollaboratorRemovedSubscriptionVariables,
  OnInvitationChangedSubscription,
  OnInvitationChangedSubscriptionVariables,
  OnInvitationCreatedSubscription,
  OnInvitationCreatedSubscriptionVariables,
  OnInvitationRemovedSubscription,
  OnInvitationRemovedSubscriptionVariables,
} from 'app/graphql/types';
import { Query } from 'app/overmind-graphql/effect';
import gql from 'graphql-tag';

import { collaboratorFragment, sandboxInvitationFragment } from './fragments';

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
