import {
  SubscriptionStatus,
  TeamFragmentDashboardFragment,
} from 'app/graphql/types';

/**
 * Use this function when displaying a list a teams
 * For the current active workspace, use the `useWorkspaceSubscription` to get all relevant data
 * @param team
 */
export const determineSpecialBadges = (
  team: TeamFragmentDashboardFragment,
  isOnPrem = false
): {
  isTeamFreeLegacy: boolean;
  isInactive: boolean;
} => {
  if (isOnPrem) {
    return {
      isTeamFreeLegacy: false,
      isInactive: false,
    };
  }

  const subscriptionStatus = team.subscription?.status;
  const isLegacySpace = team.legacy;
  const hasActiveSubscription =
    subscriptionStatus === SubscriptionStatus.Active ||
    subscriptionStatus === SubscriptionStatus.Trialing;
  const hasCancelledSubscription =
    subscriptionStatus === SubscriptionStatus.Cancelled ||
    subscriptionStatus === SubscriptionStatus.IncompleteExpired;

  const isTeamFreeLegacy = !hasActiveSubscription && isLegacySpace;
  const isInactive = !isLegacySpace && hasCancelledSubscription;

  return {
    isTeamFreeLegacy,
    isInactive,
  };
};
