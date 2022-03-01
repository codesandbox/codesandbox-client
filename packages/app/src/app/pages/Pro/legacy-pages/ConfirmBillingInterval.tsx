import React from 'react';
import { useAppState, useActions, useEffects } from 'app/overmind';
import { Stack, Text, Button } from '@codesandbox/components';
import css from '@styled-system/css';

export const ConfirmBillingInterval: React.FC = () => {
  const {
    seats,
    selectedPlan,
    paymentPreview,
    updatingSubscription,
  } = useAppState().pro;
  const { notificationToast } = useEffects();
  const {
    previewUpdateSubscriptionBillingInterval,
    updateSubscriptionBillingInterval,
  } = useActions().pro;

  React.useEffect(() => {
    previewUpdateSubscriptionBillingInterval({
      billingInterval: selectedPlan.billingInterval,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!paymentPreview) return null;

  const changeBillingInterval = async () => {
    try {
      await updateSubscriptionBillingInterval({
        billingInterval: selectedPlan.billingInterval,
      });
    } catch {
      notificationToast.error(
        'There was a problem updating your billing interval. Please email us at support@codesandbox.io'
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
          <Text size={3}>Team editors</Text>
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
