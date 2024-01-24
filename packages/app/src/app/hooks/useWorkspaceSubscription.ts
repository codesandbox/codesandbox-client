import {
  CurrentTeamInfoFragmentFragment,
  SubscriptionPaymentProvider,
  SubscriptionStatus,
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
  const { activeTeamInfo, userCanStartTrial, environment } = useAppState();
  const { isBillingManager } = useWorkspaceAuthorization();

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
      isEligibleForTrial: userCanStartTrial,
    };
  }

  const isPro =
    environment.isOnPrem || // On prem workspaces are pro by default
    subscription.status === SubscriptionStatus.Active ||
    subscription.status === SubscriptionStatus.Trialing;
  const isFree = !isPro;

  const isEligibleForTrial = userCanStartTrial && !!isBillingManager;

  const hasPaymentMethod = subscription.paymentMethodAttached;

  const hasActiveTeamTrial =
    subscription.status === SubscriptionStatus.Trialing;

  const today = startOfToday();
  const hasExpiredTeamTrial =
    subscription.status !== SubscriptionStatus.Active && // the subscription isn't active
    !hasPaymentMethod && // there's no payment method attached
    isBefore(new Date(subscription.trialEnd), today); // the trial ended before today;

  const isPaddle =
    subscription.paymentProvider === SubscriptionPaymentProvider.Paddle;

  return {
    subscription,
    isEligibleForTrial,
    isPro,
    isFree,
    hasActiveTeamTrial,
    hasExpiredTeamTrial,
    hasPaymentMethod,
    isPaddle,
  };
};

const NO_WORKSPACE = {
  subscription: undefined,
  isPro: undefined,
  isFree: undefined,
  isEligibleForTrial: undefined,
  hasActiveTeamTrial: undefined,
  hasExpiredTeamTrial: undefined,
  hasPaymentMethod: undefined,
  isPaddle: undefined,
};

const NO_SUBSCRIPTION = {
  subscription: null,
  isPro: false,
  isFree: true,
  hasActiveTeamTrial: false,
  hasExpiredTeamTrial: false,
  hasPaymentMethod: false,
  isPaddle: false,
};

export type WorkspaceSubscriptionReturn =
  | typeof NO_WORKSPACE
  | (typeof NO_SUBSCRIPTION & {
      isEligibleForTrial: boolean;
    })
  | {
      subscription: CurrentTeamInfoFragmentFragment['subscription'];
      isPro: boolean;
      isFree: boolean;
      isEligibleForTrial: boolean;
      hasActiveTeamTrial: boolean;
      hasExpiredTeamTrial: boolean;
      hasPaymentMethod: boolean;
      isPaddle: boolean;
    };
