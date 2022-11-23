import {
  SubscriptionOrigin,
  SubscriptionPaymentProvider,
  SubscriptionStatus,
  SubscriptionType,
} from 'app/graphql/types';
import { useAppState } from 'app/overmind';
import { useWorkspaceAuthorization } from './useWorkspaceAuthorization';

export const useWorkspaceSubscription = (): WorkspaceSubscriptionReturn => {
  const { activeTeamInfo } = useAppState();
  const { isTeamSpace } = useWorkspaceAuthorization();

  if (!activeTeamInfo) {
    return {
      subscription: undefined,
      numberOfSeats: undefined,
      isPro: undefined,
      isFree: undefined,
      isEligibleForTrial: undefined,
      hasActiveTeamTrial: undefined,
      isPatron: undefined,
      isPaddle: undefined,
      isStripe: undefined,
    };
  }

  const subscription = activeTeamInfo.subscription;

  if (!subscription) {
    return {
      subscription: null,
      numberOfSeats: 0,
      isPro: false,
      isFree: true,
      isEligibleForTrial: true,
      hasActiveTeamTrial: false,
      isPatron: false,
      isPaddle: false,
      isStripe: false,
    };
  }

  /**
   * Subscription states
   */

  // There are different statuses for a subscription, but only ACTIVE and TRIALING
  // should be considered an active TeamPro subscription.
  // TODO: This might change based on how we use other statuses in the subscription (eg: PAUSED)
  const isPro =
    subscription.status === SubscriptionStatus.Active ||
    subscription.status === SubscriptionStatus.Trialing;

  const isFree = !isPro;
  const hasActiveTeamTrial =
    isTeamSpace && subscription.status === SubscriptionStatus.Trialing;

  const numberOfSeats = subscription.quantity || 1;

  const isPatron =
    subscription.origin === SubscriptionOrigin.Legacy ||
    subscription.origin === SubscriptionOrigin.Patron;

  const isPaddle =
    subscription.paymentProvider === SubscriptionPaymentProvider.Paddle;

  const isStripe =
    subscription.paymentProvider === SubscriptionPaymentProvider.Stripe;

  return {
    subscription: activeTeamInfo?.subscription,
    numberOfSeats,
    isPro,
    isFree,
    isEligibleForTrial: false,
    hasActiveTeamTrial,
    isPatron,
    isPaddle,
    isStripe,
  };
};

export type WorkspaceSubscriptionReturn =
  | {
      // No workspace selected
      subscription: undefined;
      numberOfSeats: undefined;
      isPro: undefined;
      isFree: undefined;
      isEligibleForTrial: undefined;
      hasActiveTeamTrial: undefined;
      isPatron: undefined;
      isPaddle: undefined;
      isStripe: undefined;
    }
  | {
      // No subscription for workspace
      subscription: null;
      numberOfSeats: 0;
      isPro: false;
      isFree: true;
      isEligibleForTrial: true;
      hasActiveTeamTrial: false;
      isPatron: false;
      isPaddle: false;
      isStripe: false;
    }
  | {
      subscription: {
        cancelAt?: string;
        status: SubscriptionStatus;
        type: SubscriptionType;
        trialEnd?: string;
        trialStart?: string;
      };
      numberOfSeats: number;
      isPro: boolean;
      isFree: boolean;
      isEligibleForTrial: false;
      hasActiveTeamTrial: boolean;
      isPatron: boolean;
      isPaddle: boolean;
      isStripe: boolean;
    };
