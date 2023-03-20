import {
  SubscriptionType,
  TeamFragmentDashboardFragment,
  TeamMemberAuthorization,
} from 'app/graphql/types';

export const getUpgradeableTeams = ({
  teams,
  personalWorkspaceId,
  userId,
}: {
  teams: TeamFragmentDashboardFragment[];
  personalWorkspaceId: string | undefined;
  userId: string | undefined;
}) =>
  teams.filter(team => {
    if (
      team.id === personalWorkspaceId ||
      team.subscription?.type === SubscriptionType.TeamPro
    ) {
      return false;
    }

    const billingManagers = team.userAuthorizations
      .filter(
        ({ authorization, teamManager }) =>
          authorization === TeamMemberAuthorization.Admin || teamManager
      )
      .map(auth => auth.userId);

    return billingManagers.includes(userId);
  });

export const getTrialEligibleTeams = ({
  teams,
  personalWorkspaceId,
}: {
  teams: TeamFragmentDashboardFragment[];
  personalWorkspaceId: string | undefined;
}) =>
  teams.filter(team => {
    if (team.id === personalWorkspaceId || Boolean(team.subscription)) {
      return false;
    }

    return true;
  });
