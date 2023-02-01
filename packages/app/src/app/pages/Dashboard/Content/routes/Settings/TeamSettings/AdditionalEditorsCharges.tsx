import { MessageStripe } from '@codesandbox/components';
import { SubscriptionPaymentProvider } from 'app/graphql/types';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useActions, useAppState } from 'app/overmind';
import { formatCurrency } from 'app/utils/currency';
import React from 'react';

export const AdditionalEditorsCharges: React.FC = () => {
  const {
    activeTeam,
    personalWorkspaceId,
    pro: { prices },
  } = useAppState();
  const {
    pro: { pageMounted },
  } = useActions();
  const { subscription } = useWorkspaceSubscription();

  const getValue = () => {
    if (subscription?.paymentProvider === SubscriptionPaymentProvider.Paddle) {
      return (
        subscription.currency +
        ' ' +
        ((subscription.unitPrice || 0) / 100).toFixed(2) +
        '/' +
        subscription.billingInterval?.toLowerCase()
      );
    }

    if (!prices) return null;

    const workspaceType =
      (activeTeam === personalWorkspaceId ? 'pro' : 'teamPro') ?? 'pro';
    const period =
      subscription.billingInterval === 'MONTHLY' ? 'month' : 'year';

    const price = prices[workspaceType][period];

    if (!price) return null;

    return `${formatCurrency({
      amount: price.unitAmount,
      currency: price.currency,
    })}/${subscription.billingInterval?.toLowerCase()}`;
  };

  const value = getValue();

  React.useEffect(() => {
    pageMounted();
  }, [pageMounted]);

  return (
    <MessageStripe>
      An additional {value ?? 'seat'} (excl. tax), will be charged for each
      additional editor. Discounts or prorated charges may apply.
    </MessageStripe>
  );
};
