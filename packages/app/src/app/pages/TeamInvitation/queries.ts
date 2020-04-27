import gql from 'graphql-tag';

export const teamByToken = gql`
  query TeamByToken($inviteToken: String!) {
    teamByToken(inviteToken: $inviteToken) {
      name
    }
  }
`;

export const joinTeamMutation = gql`
  mutation JoinTeamByToken($inviteToken: String!) {
    redeemTeamInviteToken(inviteToken: $inviteToken) {
      id
      name
    }
  }
`;
