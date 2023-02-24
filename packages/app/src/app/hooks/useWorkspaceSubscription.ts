import {
  SubscriptionOrigin,
  SubscriptionPaymentProvider,
  SubscriptionStatus,
  SubscriptionType,
} from 'app/graphql/types';
import { useAppState } from 'app/overmind';
import { isBefore, startOfToday } from 'date-fns';
import { useWorkspaceAuthorization } from './useWorkspaceAuthorization';

export const useWorkspaceSubscription = (): WorkspaceSubscriptionReturn => {
  const { activeTeamInfo } = useAppState();
  const { isTeamSpace } = useWorkspaceAuthorization();

  if (!activeTeamInfo) {
    return NO_WORKSPACE;
  }

  const subscription = activeTeamInfo.subscription;

  if (!subscription) {
    return {
      ...NO_SUBSCRIPTION,
      isEligibleForTrial: isTeamSpace, // Currently, only teams are eligible for trial.
    };
  }

  const isPro =
    subscription.status === SubscriptionStatus.Active ||
    subscription.status === SubscriptionStatus.Trialing;
  const isFree = !isPro;

  const hasPaymentMethod = subscription.paymentMethodAttached;

  const hasActiveTeamTrial =
    isTeamSpace && subscription.status === SubscriptionStatus.Trialing;

  const today = startOfToday();
  const hasExpiredTeamTrial =
    isTeamSpace && // is a team
    subscription.status !== SubscriptionStatus.Active && // the subscription isn't active
    !hasPaymentMethod && // there's no payment method attached
    isBefore(new Date(subscription.trialEnd), today); // the trial ended before today;

  const numberOfSeats =
    (isFree ? activeTeamInfo.limits.maxEditors : subscription.quantity) || 1;

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
    isEligibleForTrial: false, // Teams with an active or past subscription are not eligible for trial.
    hasActiveTeamTrial,
    hasExpiredTeamTrial,
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
  hasExpiredTeamTrial: undefined,
  hasPaymentMethod: undefined,
  isPatron: undefined,
  isPaddle: undefined,
  isStripe: undefined,
};

const NO_SUBSCRIPTION = {
  subscription: null,
  numberOfSeats: 0,
  isPro: false,
  isFree: true,
  hasActiveTeamTrial: false,
  hasExpiredTeamTrial: false,
  hasPaymentMethod: false,
  isPatron: false,
  isPaddle: false,
  isStripe: false,
};

export type WorkspaceSubscriptionReturn =
  | typeof NO_WORKSPACE
  | (typeof NO_SUBSCRIPTION & { isEligibleForTrial: boolean })
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
      hasExpiredTeamTrial: boolean;
      hasPaymentMethod: boolean;
      isPatron: boolean;
      isPaddle: boolean;
      isStripe: boolean;
    };
