import {
  SubscriptionType,
  SubscriptionStatus,
  TeamFragmentDashboardFragment,
  TeamMemberAuthorization,
  TeamType,
} from 'app/graphql/types';

export const getUpgradeableTeams = ({
  teams,
  userId,
}: {
  teams: TeamFragmentDashboardFragment[];
  userId: string | undefined;
}) =>
  teams.filter(team => {
    if (
      team.type === TeamType.Team &&
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

export const getTrialEligibleTeams = (teams: TeamFragmentDashboardFragment[]) =>
  teams.filter(team => {
    if (team.type === TeamType.Personal || Boolean(team.subscription)) {
      return false;
    }

    return true;
  });

/**
 * Use this function when displaying a list a teams
 * For the current active workspace, use the `useWorkspaceSubscription` to get all relevant data
 * @param team
 */
export const determineSpecialBadges = (
  team: TeamFragmentDashboardFragment,
  isOnPrem = false
) => {
  if (isOnPrem) {
    return {
      isPersonalProLegacy: false,
      isTeamFreeLegacy: false,
      isInactive: false,
    };
  }

  const subscriptionStatus = team.subscription?.status;
  const isPersonalSpace = team.type === TeamType.Personal;
  const isLegacySpace = team.legacy;
  const hasActiveSubscription =
    subscriptionStatus === SubscriptionStatus.Active ||
    subscriptionStatus === SubscriptionStatus.Trialing;
  const hasCancelledSubscription =
    subscriptionStatus === SubscriptionStatus.Cancelled ||
    subscriptionStatus === SubscriptionStatus.IncompleteExpired;

  const isPersonalProLegacy =
    isPersonalSpace && hasActiveSubscription && isLegacySpace;
  const isTeamFreeLegacy =
    !isPersonalSpace && !hasActiveSubscription && isLegacySpace;
  const isInactive =
    !isLegacySpace && !isPersonalSpace && hasCancelledSubscription;

  return {
    isPersonalProLegacy,
    isTeamFreeLegacy,
    isInactive,
  };
};
