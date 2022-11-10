import {
  SubscriptionStatus,
  SubscriptionType,
  TeamMemberAuthorization,
} from 'app/graphql/types';
import { useAppState } from 'app/overmind';

export const useSubscription = () => {
  const {
    activeTeam,
    activeTeamInfo,
    personalWorkspaceId,
    activeWorkspaceAuthorization,
  } = useAppState();

  /**
   * Personal states
   */
  const isPersonalSpace = activeTeam === personalWorkspaceId;

  /**
   * Team states
   */
  const isTeamSpace = !isPersonalSpace;

  const isTeamAdmin =
    isTeamSpace &&
    activeWorkspaceAuthorization === TeamMemberAuthorization.Admin;

  /**
   * Subscription states
   */

  // There are different statuses for a subscription, but only ACTIVE and TRIALING
  // should be considered an active TeamPro subscription.
  // TODO: This might change based on how we use other statuses in the subscription (eg: PAUSED)
  const hasActiveSubscription =
    activeTeamInfo?.subscription?.status === SubscriptionStatus.Active ||
    activeTeamInfo?.subscription?.status === SubscriptionStatus.Trialing;

  const hasPastSubscription = Boolean(activeTeamInfo?.subscription?.status);

  /**
   * Trial states
   */
  const hasActiveTeamTrial =
    isTeamSpace &&
    activeTeamInfo?.subscription?.type === SubscriptionType.TeamPro &&
    activeTeamInfo?.subscription?.status === SubscriptionStatus.Trialing;

  const isEligibleForTrial = !isPersonalSpace && !hasPastSubscription;

  return {
    subscription: activeTeamInfo?.subscription,
    isPersonalSpace,
    isTeamSpace: !isPersonalSpace,
    isTeamAdmin,
    hasActiveSubscription,
    hasActiveTeamTrial,
    hasPastSubscription,
    isEligibleForTrial,
  };
};
