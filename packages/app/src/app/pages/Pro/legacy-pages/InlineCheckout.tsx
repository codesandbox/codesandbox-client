import React from 'react';
import { Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import { useScript } from 'app/hooks';
import { PADDLE_VENDOR_ID } from './plans';

export const InlineCheckout: React.FC = () => {
  const { updateSummary, paddleInitialised } = useActions().pro;
  const {
    user,
    activeTeam,
    pro: { seats, selectedPlan, summary },
  } = useAppState();

  const [scriptLoaded] = useScript('https://cdn.paddle.com/paddle/paddle.js');

  React.useEffect(() => {
    if (!scriptLoaded) return;

    // @ts-ignore 3rd party integration with global
    const Paddle = window.Paddle;

    Paddle.Setup({
      vendor: PADDLE_VENDOR_ID,
      eventCallback: event => {
        if (event?.eventData?.checkout) {
          const customSummary = event.eventData.checkout.prices.customer;
          updateSummary({
            unitPrice: customSummary.unit_price,
            unit: customSummary.unit,
            unitTax: customSummary.unit_tax,
            totalTax: customSummary.total_tax,
            currency: customSummary.currency,
            total: customSummary.total,
          });
        }
      },
    });

    // @ts-ignore 3rd party integration with global
    window.loadCallback = () => paddleInitialised();

    Paddle.Checkout.open({
      method: 'inline',
      product: selectedPlan.id,
      quantity: seats,
      email: user.email,
      frameTarget: 'checkout-container', // The className of your checkout <div>
      loadCallback: 'loadCallback',
      success: '/pro/success',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded, seats, user.email, selectedPlan]);

  const unitPricePreTax =
    summary && (summary.unit - summary.unitTax).toFixed(2);
  const totalPricePreTax =
    summary && (summary.total - summary.totalTax).toFixed(2);

  return (
    <div style={{ paddingBottom: 64, width: 500 }}>
      <Text size={7} as="h1" block align="center" marginBottom={12}>
        Upgrade to Pro
      </Text>
      {summary && (
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
          <Text size={3}>Team editors</Text>
          <Stack justify="space-between">
            <Text variant="muted" size={3}>
              {seats} {seats === 1 ? 'seat' : 'seats'}
              <Text size={2}> ✕ </Text>
              <span>
                {summary.currency} {unitPricePreTax}
              </span>
              {summary.currency !== 'USD' ? (
                <span>
                  {' '}
                  ({selectedPlan.currency}{' '}
                  {selectedPlan.unit * selectedPlan.multiplier})
                </span>
              ) : null}
            </Text>
            <Text variant="muted" size={3}>
              {summary.currency} {totalPricePreTax}
            </Text>
          </Stack>
          <Stack justify="space-between">
            <Text variant="muted" size={3}>
              Tax
            </Text>
            <Text variant="muted" size={3}>
              {summary.currency} {summary.totalTax}
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
              {summary.currency} {summary.total}
            </Text>
          </Stack>
        </Stack>
      )}

      <div className="checkout-container" />
    </div>
  );
};
