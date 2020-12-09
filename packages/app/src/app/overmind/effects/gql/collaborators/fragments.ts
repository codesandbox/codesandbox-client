import { gql } from 'overmind-graphql';

export const collaboratorFragment = gql`
  fragment Collaborator on Collaborator {
    id
    authorization
    lastSeenAt
    warning
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

export const sandboxChangedFragment = gql`
  fragment SandboxChanged on Sandbox {
    id
    privacy
    title
    description
    authorization
  }
`;
