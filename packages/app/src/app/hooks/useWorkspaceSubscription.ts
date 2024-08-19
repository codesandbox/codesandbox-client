import {
  CurrentTeamInfoFragmentFragment,
  SubscriptionStatus,
} from 'app/graphql/types';
import { useAppState } from 'app/overmind';
import { useControls } from 'leva';

export enum SubscriptionDebugStatus {
  'DEFAULT' = 'Default (use API data)',
  'NO_SUBSCRIPTION' = 'Free (without prior subscription)',
}

export const useWorkspaceSubscription = (): WorkspaceSubscriptionReturn => {
  const { activeTeamInfo, environment } = useAppState();

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
    return NO_SUBSCRIPTION;
  }

  const isPro =
    environment.isOnPrem || // On prem workspaces are pro by default
    subscription.status === SubscriptionStatus.Active;
  const isFree = !isPro;

  const hasPaymentMethod = subscription.paymentMethodAttached;

  return {
    subscription,
    isPro,
    isFree,
    hasPaymentMethod,
  };
};

const NO_WORKSPACE = {
  subscription: undefined,
  isPro: undefined,
  isFree: undefined,
  hasPaymentMethod: undefined,
};

const NO_SUBSCRIPTION = {
  subscription: null,
  isPro: false,
  isFree: true,
  hasPaymentMethod: false,
};

export type WorkspaceSubscriptionReturn =
  | typeof NO_WORKSPACE
  | typeof NO_SUBSCRIPTION
  | {
      subscription: CurrentTeamInfoFragmentFragment['subscription'];
      isPro: boolean;
      isFree: boolean;
      hasPaymentMethod: boolean;
    };
