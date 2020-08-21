import * as t from 'app/graphql/types';
import { gql, Query } from 'overmind-graphql';

import {
  collaboratorFragment,
  sandboxChangedFragment,
  sandboxInvitationFragment,
} from './fragments';

export const onCollaboratorAdded: Query<
  t.OnCollaboratorAddedSubscription,
  t.OnCollaboratorAddedSubscriptionVariables
> = gql`
  subscription OnCollaboratorAdded($sandboxId: ID!) {
    collaboratorAdded(sandboxId: $sandboxId) {
      ...Collaborator
    }
  }
  ${collaboratorFragment}
`;

export const onCollaboratorChanged: Query<
  t.OnCollaboratorChangedSubscription,
  t.OnCollaboratorChangedSubscriptionVariables
> = gql`
  subscription OnCollaboratorChanged($sandboxId: ID!) {
    collaboratorChanged(sandboxId: $sandboxId) {
      ...Collaborator
    }
  }
  ${collaboratorFragment}
`;

export const onCollaboratorRemoved: Query<
  t.OnCollaboratorRemovedSubscription,
  t.OnCollaboratorRemovedSubscriptionVariables
> = gql`
  subscription OnCollaboratorRemoved($sandboxId: ID!) {
    collaboratorRemoved(sandboxId: $sandboxId) {
      ...Collaborator
    }
  }
  ${collaboratorFragment}
`;

export const onInvitationCreated: Query<
  t.OnInvitationCreatedSubscription,
  t.OnInvitationCreatedSubscriptionVariables
> = gql`
  subscription OnInvitationCreated($sandboxId: ID!) {
    invitationCreated(sandboxId: $sandboxId) {
      ...Invitation
    }
  }
  ${sandboxInvitationFragment}
`;

export const onInvitationRemoved: Query<
  t.OnInvitationRemovedSubscription,
  t.OnInvitationRemovedSubscriptionVariables
> = gql`
  subscription OnInvitationRemoved($sandboxId: ID!) {
    invitationRemoved(sandboxId: $sandboxId) {
      ...Invitation
    }
  }
  ${sandboxInvitationFragment}
`;

export const onInvitationChanged: Query<
  t.OnInvitationChangedSubscription,
  t.OnInvitationChangedSubscriptionVariables
> = gql`
  subscription OnInvitationChanged($sandboxId: ID!) {
    invitationChanged(sandboxId: $sandboxId) {
      ...Invitation
    }
  }
  ${sandboxInvitationFragment}
`;

export const onSandboxChangged: Query<
  t.OnSandboxChangedSubscription,
  t.OnSandboxChangedSubscriptionVariables
> = gql`
  subscription OnSandboxChanged($sandboxId: ID!) {
    sandboxChanged(sandboxId: $sandboxId) {
      ...SandboxChanged
    }
  }
  ${sandboxChangedFragment}
`;
