import {
  SubscriptionOrigin,
  SubscriptionPaymentProvider,
  SubscriptionStatus,
  SubscriptionType,
  TeamMemberAuthorization,
} from 'app/graphql/types';
import { useAppState } from 'app/overmind';
import { useWorkspaceAuthorization } from './useWorkspaceAuthorization';

export const useSubscription = () => {
  const { activeTeamInfo } = useAppState();
  const { isTeamSpace } = useWorkspaceAuthorization();

  /**
   * Subscription states
   */

  // There are different statuses for a subscription, but only ACTIVE and TRIALING
  // should be considered an active TeamPro subscription.
  // TODO: This might change based on how we use other statuses in the subscription (eg: PAUSED)
  const hasActiveSubscription =
    activeTeamInfo?.subscription?.status === SubscriptionStatus.Active ||
    activeTeamInfo?.subscription?.status === SubscriptionStatus.Trialing;

  const hasPastOrActiveSubscription = Boolean(
    activeTeamInfo?.subscription?.status
  );

  const isPatron = activeTeamInfo?.subscription?.origin
    ? [SubscriptionOrigin.Legacy, SubscriptionOrigin.Patron].includes(
        activeTeamInfo.subscription.origin
      )
    : false;

  const isPaddle =
    activeTeamInfo?.subscription?.paymentProvider ===
    SubscriptionPaymentProvider.Paddle;

  const isStripe =
    activeTeamInfo?.subscription?.paymentProvider ===
    SubscriptionPaymentProvider.Stripe;

  /**
   * Trial states
   */

  const hasActiveTeamTrial =
    isTeamSpace &&
    activeTeamInfo?.subscription?.type === SubscriptionType.TeamPro &&
    activeTeamInfo?.subscription?.status === SubscriptionStatus.Trialing;

  const isEligibleForTrial = isTeamSpace && !hasPastOrActiveSubscription;

  const numberOfEditors = isTeamSpace
    ? activeTeamInfo?.userAuthorizations?.filter(
        ({ authorization }) =>
          authorization === TeamMemberAuthorization.Admin ||
          authorization === TeamMemberAuthorization.Write
      ).length
    : 1; // Personal

  /**
   * Usage states
   */

  const numberOfSeats = activeTeamInfo?.subscription?.quantity || 1;

  const hasMaxNumberOfEditors =
    !hasActiveSubscription &&
    numberOfEditors &&
    activeTeamInfo?.limits?.maxEditors &&
    numberOfEditors === activeTeamInfo?.limits?.maxEditors;

  const numberOfEditorsIsOverTheLimit =
    !hasActiveSubscription &&
    numberOfEditors &&
    activeTeamInfo?.limits?.maxEditors &&
    numberOfEditors > activeTeamInfo?.limits?.maxEditors;

  const publicProjectsQuantity = activeTeamInfo?.usage?.publicProjectsQuantity;
  const maxPublicProjects = activeTeamInfo?.limits?.maxPublicProjects;

  const hasMaxPublicRepositories =
    isTeamSpace &&
    publicProjectsQuantity &&
    maxPublicProjects &&
    publicProjectsQuantity >= maxPublicProjects;

  const publicSandboxesQuantity =
    activeTeamInfo?.usage?.publicSandboxesQuantity;
  const maxPublicSandboxes = activeTeamInfo?.limits?.maxPublicSandboxes;

  const hasMaxPublicSandboxes =
    publicSandboxesQuantity &&
    maxPublicSandboxes &&
    publicSandboxesQuantity >= maxPublicSandboxes;

  return {
    subscription: activeTeamInfo?.subscription,
    hasActiveSubscription,
    hasActiveTeamTrial,
    hasPastOrActiveSubscription,
    isEligibleForTrial,
    numberOfSeats,
    numberOfEditors,
    hasMaxNumberOfEditors,
    numberOfEditorsIsOverTheLimit,
    isPatron,
    isPaddle,
    isStripe,
    hasMaxPublicRepositories,
    hasMaxPublicSandboxes,
  };
};

// Soft limit of maximum amount of pro
// editor a team can have. Above this,
// we should prompt CTAs to enable
// custom pricing.
export const MAX_PRO_EDITORS = 20;
