import React, { useEffect } from 'react';
import { Checkbox, Text, Button, Stack } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import { SubscriptionPaymentProvider } from 'app/graphql/types';

import { formatCurrency } from 'app/utils/currency';
import { Alert } from '../Common/Alert';

export const MemberPaymentConfirmation: React.FC<{ title: string }> = ({
  title,
}) => {
  const {
    activeTeamInfo,
    personalWorkspaceId,
    pro: { prices },
  } = useAppState();
  const actions = useActions();

  const [confirmed, setConfirmed] = React.useState(false);

  const subscription = activeTeamInfo?.subscription!;

  const getValue = () => {
    if (
      activeTeamInfo?.subscription?.paymentProvider ===
      SubscriptionPaymentProvider.Paddle
    ) {
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
      (activeTeamInfo?.id === personalWorkspaceId ? 'pro' : 'teamPro') ?? 'pro';
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

  useEffect(() => {
    actions.pro.pageMounted();
  }, [actions]);

  if (!prices) return null;

  return (
    <Alert title={title}>
      <Text size={3} block marginTop={4} marginBottom={10}>
        <Stack as="label">
          <Checkbox
            checked={confirmed}
            onChange={e => setConfirmed(e.target.checked)}
          />
          <span>
            <Text>
              By adding an extra editor, I confirm an additional{' '}
              <Text weight="semibold" css={{ whiteSpace: 'nowrap' }}>
                {value} (excl. tax)
              </Text>{' '}
              for 1 seat will be added to the invoice
            </Text>
          </span>
        </Stack>

        <Stack>
          <Text size={3} block marginTop={4} marginLeft={6}>
            Discounts or prorated charges may apply.
          </Text>
        </Stack>
      </Text>

      <Stack gap={2} justify="flex-end">
        <Button
          autoWidth
          variant="secondary"
          onClick={() => actions.modals.alertModal.close(false)}
        >
          Cancel
        </Button>
        <Button
          autoWidth
          disabled={!confirmed}
          onClick={() => actions.modals.alertModal.close(true)}
        >
          Confirm
        </Button>
      </Stack>
    </Alert>
  );
};
