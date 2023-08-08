import { TEAM_FREE_LIMITS } from 'app/constants';
import {
  SubscriptionInterval,
  SubscriptionPaymentProvider,
  SubscriptionStatus,
  SubscriptionType,
} from 'app/graphql/types';
import { useAppState } from 'app/overmind';
import { isBefore, startOfToday } from 'date-fns';
import { useControls } from 'leva';
import { useWorkspaceAuthorization } from './useWorkspaceAuthorization';

export enum SubscriptionDebugStatus {
  'DEFAULT' = 'Default (use API data)',
  'NO_SUBSCRIPTION' = 'Free (without prior subscription)',
}

export const useWorkspaceSubscription = (): WorkspaceSubscriptionReturn => {
  const { activeTeamInfo } = useAppState();
  const { isTeamSpace } = useWorkspaceAuthorization();
  const isPersonalSpace = !isTeamSpace;

  const options: SubscriptionDebugStatus[] = [SubscriptionDebugStatus.DEFAULT];

  if (activeTeamInfo) {
    options.push(SubscriptionDebugStatus.NO_SUBSCRIPTION);
  }

  const { debugStatus } = useControls(
    'Subscription',
    {
      debugStatus: {
        label: 'Status',
        value: SubscriptionDebugStatus.DEFAULT,
        options,
      },
    },
    [options]
  );

  if (!activeTeamInfo) {
    return NO_WORKSPACE;
  }

  const subscription =
    debugStatus === SubscriptionDebugStatus.NO_SUBSCRIPTION
      ? null
      : activeTeamInfo.subscription;

  if (!subscription) {
    return {
      ...NO_SUBSCRIPTION,
      isLegacyFreeTeam: isTeamSpace,
      isEligibleForTrial: isTeamSpace,
      numberOfSeats:
        activeTeamInfo.limits.maxEditors ?? TEAM_FREE_LIMITS.editors,
    };
  }

  const isLegacySpace = activeTeamInfo.legacy;

  const isPro =
    subscription.status === SubscriptionStatus.Active ||
    subscription.status === SubscriptionStatus.Trialing;
  const isFree = !isPro;

  const isInactiveTeam =
    isTeamSpace &&
    !isLegacySpace &&
    (subscription.status === SubscriptionStatus.Cancelled ||
      subscription.status === SubscriptionStatus.IncompleteExpired);

  const isLegacyPersonalPro = isPro && isPersonalSpace && isLegacySpace;
  const isLegacyFreeTeam = isFree && isTeamSpace && isLegacySpace;

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

  const isPaddle =
    subscription.paymentProvider === SubscriptionPaymentProvider.Paddle;

  const isStripe =
    subscription.paymentProvider === SubscriptionPaymentProvider.Stripe;

  return {
    subscription,
    numberOfSeats,
    isPro,
    isFree,
    isLegacyPersonalPro,
    isLegacyFreeTeam,
    isInactiveTeam,
    isEligibleForTrial: false, // Teams with an active or past subscription are not eligible for trial.
    hasActiveTeamTrial,
    hasExpiredTeamTrial,
    hasPaymentMethod,
    isPaddle,
    isStripe,
  };
};

const NO_WORKSPACE = {
  subscription: undefined,
  numberOfSeats: undefined,
  isPro: undefined,
  isFree: undefined,
  isLegacyPersonalPro: undefined,
  isLegacyFreeTeam: undefined,
  isInactiveTeam: undefined,
  isEligibleForTrial: undefined,
  hasActiveTeamTrial: undefined,
  hasExpiredTeamTrial: undefined,
  hasPaymentMethod: undefined,
  isPaddle: undefined,
  isStripe: undefined,
};

const NO_SUBSCRIPTION = {
  subscription: null,
  isPro: false,
  isFree: true,
  isLegacyPersonalPro: false,
  isLegacyFreeTeam: false,
  isInactiveTeam: false,
  hasActiveTeamTrial: false,
  hasExpiredTeamTrial: false,
  hasPaymentMethod: false,
  isPaddle: false,
  isStripe: false,
};

export type WorkspaceSubscriptionReturn =
  | typeof NO_WORKSPACE
  | (typeof NO_SUBSCRIPTION & {
      isEligibleForTrial: boolean;
      numberOfSeats: number;
    })
  | {
      subscription: {
        cancelAt?: string;
        billingInterval?: SubscriptionInterval | null;
        status: SubscriptionStatus;
        type: SubscriptionType;
        trialEnd?: string;
        trialStart?: string;
      };
      numberOfSeats: number;
      isPro: boolean;
      isFree: boolean;
      isLegacyPersonalPro: boolean;
      isLegacyFreeTeam: boolean;
      isInactiveTeam: boolean;
      isEligibleForTrial: false;
      hasActiveTeamTrial: boolean;
      hasExpiredTeamTrial: boolean;
      hasPaymentMethod: boolean;
      isPaddle: boolean;
      isStripe: boolean;
    };
