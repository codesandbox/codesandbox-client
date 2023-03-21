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

    const userAuthorization = team.userAuthorizations.find(
      auth => auth.userId === userId
    );

    return (
      userAuthorization?.authorization === TeamMemberAuthorization.Admin ||
      userAuthorization?.teamManager
    );
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
