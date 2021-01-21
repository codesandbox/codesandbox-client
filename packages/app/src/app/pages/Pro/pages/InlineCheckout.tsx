import React from 'react';
import { Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { useScript } from 'app/hooks';
import { Plan, PADDLE_VENDOR_ID } from '../plans';

export const InlineCheckout: React.FC<{
  plan: Plan;
  seats: number;
  setPaddleInitialised: (value: boolean) => void;
}> = ({ plan, seats = 1, setPaddleInitialised }) => {
  const {
    state: { user, activeTeam },
  } = useOvermind();

  const [scriptLoaded] = useScript('https://cdn.paddle.com/paddle/paddle.js');
  const [prices, updatePrices] = React.useState(null);

  const unitPricePreTax = prices && (prices.unit - prices.unit_tax).toFixed(2);
  const totalPricePreTax =
    prices && (prices.total - prices.total_tax).toFixed(2);

  React.useEffect(() => {
    if (!scriptLoaded) return;

    // @ts-ignore 3rd party integration with global
    const Paddle = window.Paddle;

    Paddle.Environment.set('sandbox');
    Paddle.Setup({
      vendor: PADDLE_VENDOR_ID,
      eventCallback: event => {
        if (event.event === 'Checkout.Location.Submit') {
          updatePrices(event.eventData.checkout.prices.customer);
        }
      },
    });

    // @ts-ignore 3rd party integration with global
    window.loadCallback = () => setPaddleInitialised(true);

    Paddle.Checkout.open({
      method: 'inline',
      product: plan.id, // Replace with your Product or Plan ID
      quantity: seats,
      email: user.email,
      frameTarget: 'checkout-container', // The className of your checkout <div>
      loadCallback: 'loadCallback',
      success: '/pro/success?v=2',
      passthrough: JSON.stringify({ team_id: activeTeam, user_id: user.id }),
      allowQuantity: true,
      disableLogout: true,
      frameInitialHeight: 416,
      frameStyle: `
        width: 500px;
        min-width: 500px;
        background-color:
        transparent; border: none;
      `,
    });
  }, [scriptLoaded, setPaddleInitialised, seats, user.email, plan.id]);

  return (
    <div style={{ paddingBottom: 64 }}>
      <Text size={7} as="h1" block align="center" marginBottom={12}>
        Upgrade to Pro
      </Text>
      {prices && (
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
              {prices.currency} {unitPricePreTax} ({plan.currency}{' '}
              {plan.unit * plan.multiplier})
            </Text>
            <Text variant="muted" size={3}>
              {prices.currency} {totalPricePreTax}
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
      )}

      <div className="checkout-container" />
    </div>
  );
};
