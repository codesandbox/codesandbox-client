import React from 'react';
import { useOvermind } from 'app/overmind';
import { Stack, Text, Button } from '@codesandbox/components';
import css from '@styled-system/css';
import { Plan } from '../plans';

export const ConfirmBillingInterval: React.FC<{
  plan: Plan;
  seats: number;
  setBillingAmountLoaded: (loaded: boolean) => void;
}> = ({ plan, seats = 1, setBillingAmountLoaded }) => {
  const { actions, effects } = useOvermind();
  const [prices, setPrices] = React.useState(null);

  React.useEffect(() => {
    // actions.fetchPrices();
    // setPrices(null);
    // setBillingAmountLoaded()
  }, []);

  if (!prices) return null;

  const changeBillingInterval = async () => {
    try {
      await actions.dashboard.changeSubscriptionBillingInterval();
      location.href = '/pro/success?v=2';
    } catch {
      effects.notificationToast.error(
        'There was a problem updating your billing interval. Please email us at hello@codesandbox.io'
      );
    }
  };

  return (
    <div style={{ paddingBottom: 64 }}>
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
            marginX: 3,
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
              {prices.currency} {prices.unitPrice} ({plan.currency}{' '}
              {plan.unit * plan.multiplier})
            </Text>
            <Text variant="muted" size={3}>
              {prices.currency} {prices.total}
            </Text>
          </Stack>
          <Stack justify="space-between">
            <Text variant="muted" size={3}>
              Tax
            </Text>
            <Text variant="muted" size={3}>
              {prices.currency} {prices.total_tax}
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
              {prices.currency} {prices.total}
            </Text>
          </Stack>
        </Stack>
        <Button
          onClick={changeBillingInterval}
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
