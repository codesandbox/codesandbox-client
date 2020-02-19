import {
  SandboxCollaboratorsQuery,
  SandboxCollaboratorsQueryVariables,
  SandboxInvitationsQuery,
  SandboxInvitationsQueryVariables,
} from 'app/graphql/types';
import { Query } from 'app/overmind-graphql';
import gql from 'graphql-tag';

import { collaboratorFragment, sandboxInvitationFragment } from './fragments';

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
