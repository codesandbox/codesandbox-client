import React from 'react';
import { useOvermind } from 'app/overmind';
import { Stack, Text, Button } from '@codesandbox/components';
import css from '@styled-system/css';

export const ConfirmBillingInterval: React.FC = () => {
  const {
    state: {
      pro: { seats, selectedPlan, paymentPreview, updatingSubscription },
    },
    actions,
    effects,
  } = useOvermind();

  React.useEffect(() => {
    actions.pro.previewUpdateSubscriptionBillingInterval({
      billingInterval: selectedPlan.billingInterval,
    });
  }, []);

  if (!paymentPreview) return null;

  const changeBillingInterval = async () => {
    try {
      await actions.pro.updateSubscriptionBillingInterval({
        billingInterval: selectedPlan.billingInterval,
      });
    } catch {
      effects.notificationToast.error(
        'There was a problem updating your billing interval. Please email us at hello@codesandbox.io'
      );
    }
  };

  return (
    <div style={{ paddingBottom: 64, width: 500 }}>
      <Text size={7} as="h1" block align="center" marginBottom={12}>
        Change Billing Interval
      </Text>

      <Stack direction="vertical" gap={10}>
        <Stack
          direction="vertical"
          gap={2}
          css={css({
            padding: 4,
            marginBottom: 8,
            border: '1px solid',
            borderColor: 'grays.500',
            borderRadius: 'small',
            overflow: 'hidden',
          })}
        >
          <Text size={3}>Workspace editors</Text>
          <Stack justify="space-between">
            <Text variant="muted" size={3}>
              {seats} {seats === 1 ? 'seat' : 'seats'}
              <Text size={2}> ✕ </Text>
              {paymentPreview.nextPayment.currency}{' '}
              {(paymentPreview.nextPayment.amount / 100 / seats).toFixed(2)}
            </Text>
            <Text variant="muted" size={3}>
              {paymentPreview.nextPayment.currency}{' '}
              {(paymentPreview.nextPayment.amount / 100).toFixed(2)}
            </Text>
          </Stack>
          <Stack justify="space-between">
            <Text variant="muted" size={3}>
              Proration for days left in subscription
            </Text>
            <Text variant="muted" size={3}>
              - {paymentPreview.nextPayment.currency}{' '}
              {(
                (paymentPreview.nextPayment.amount -
                  paymentPreview.immediatePayment.amount) /
                100
              ).toFixed(2)}
            </Text>
          </Stack>
          <Stack
            justify="space-between"
            css={css({
              borderTop: '1px solid',
              borderColor: 'grays.500',
              paddingTop: 10,
            })}
          >
            <Text size={3}>Total</Text>
            <Text weight="bold">
              {paymentPreview.immediatePayment.currency}{' '}
              {(paymentPreview.immediatePayment.amount / 100).toFixed(2)} (incl.
              tax)
            </Text>
          </Stack>
        </Stack>
        <Button
          onClick={changeBillingInterval}
          loading={updatingSubscription}
          disabled={updatingSubscription}
          css={css({
            fontSize: 3,
            height: 10,
            fontFamily: 'Lato, sans-serif',
            fontWeight: 700,
          })}
        >
          Update billing interval
        </Button>
      </Stack>
    </div>
  );
};
