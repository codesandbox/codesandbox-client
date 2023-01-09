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
    return NO_WORKSPACE;
  }

  const subscription = activeTeamInfo.subscription;

  if (!subscription) {
    return NO_SUBSCRIPTION;
  }

  const isPro =
    subscription.status === SubscriptionStatus.Active ||
    subscription.status === SubscriptionStatus.Trialing;

  const isFree = !isPro;
  const hasActiveTeamTrial =
    isTeamSpace && subscription.status === SubscriptionStatus.Trialing;

  const numberOfSeats = subscription.quantity || 1;

  const hasPaymentMethod = subscription.paymentMethodAttached;

  const isPatron =
    subscription.origin === SubscriptionOrigin.Legacy ||
    subscription.origin === SubscriptionOrigin.Patron;

  const isPaddle =
    subscription.paymentProvider === SubscriptionPaymentProvider.Paddle;

  const isStripe =
    subscription.paymentProvider === SubscriptionPaymentProvider.Stripe;

  return {
    subscription,
    numberOfSeats,
    isPro,
    isFree,
    isEligibleForTrial: false,
    hasActiveTeamTrial,
    hasPaymentMethod,
    isPatron,
    isPaddle,
    isStripe,
  };
};

const NO_WORKSPACE = {
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

const NO_SUBSCRIPTION = {
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

export type WorkspaceSubscriptionReturn =
  | typeof NO_WORKSPACE
  | typeof NO_SUBSCRIPTION
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
      hasPaymentMethod: boolean;
      isPatron: boolean;
      isPaddle: boolean;
      isStripe: boolean;
    };
