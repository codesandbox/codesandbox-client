type TeamId = string;

export interface IAddTeamMemberProps {
  teamId: TeamId;
}

export interface IMutationVariables {
  teamId: TeamId;
  email?: string;
  username?: string;
}
