import gql from 'graphql-tag';

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
