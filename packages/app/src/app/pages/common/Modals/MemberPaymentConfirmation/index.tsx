import React, { useEffect } from 'react';
import { Checkbox, Text, Button, Stack } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { usePriceCalculation } from 'app/hooks/usePriceCalculation';
import { Alert } from '../Common/Alert';

export const MemberPaymentConfirmation: React.FC<{ title: string }> = ({
  title,
}) => {
  const {
    pro: { prices },
  } = useAppState();
  const actions = useActions();
  const {
    isPaddle,
    subscription,
    numberOfSeats = 1,
  } = useWorkspaceSubscription();

  const smallTeamSeatPrice = usePriceCalculation({
    billingInterval:
      subscription?.billingInterval === 'MONTHLY' ? 'month' : 'year',
    maxSeats: 3,
  });

  const largeTeamSeatPrice = usePriceCalculation({
    billingInterval:
      subscription?.billingInterval === 'MONTHLY' ? 'month' : 'year',
    maxSeats: null,
  });

  const [confirmed, setConfirmed] = React.useState(false);

  const getPaddleValue = () => {
    // This shouldn't occur on this page, but it is still possible that this
    // value is undefined or null, coming from the hook.
    if (!subscription) return null;

    if (isPaddle) {
      return (
        subscription.currency +
        ' ' +
        ((subscription.unitPrice || 0) / 100).toFixed(2) +
        '/' +
        subscription.billingInterval?.toLowerCase()
      );
    }
  };

  const nextSeat = numberOfSeats + 1;

  const nextProSeatLabel =
    nextSeat <= 3 ? (
      <Text>
        By adding a {nextSeat}
        {nextSeat === 2 ? 'nd' : 'rd'} editor, I confirm an additional{' '}
        <Text weight="semibold" css={{ whiteSpace: 'nowrap' }}>
          {smallTeamSeatPrice} (excl. tax)
        </Text>{' '}
        will be added to the invoice.
      </Text>
    ) : (
      <Text>
        By adding an extra editor, I confirm an additional{' '}
        <Text weight="semibold" css={{ whiteSpace: 'nowrap' }}>
          {largeTeamSeatPrice} (excl. tax)
        </Text>{' '}
        for 1 seat will be added to the invoice.
      </Text>
    );

  const priceLabel = isPaddle ? (
    <Text>
      By adding an extra editor, I confirm an additional{' '}
      <Text weight="semibold" css={{ whiteSpace: 'nowrap' }}>
        {getPaddleValue()} (excl. tax)
      </Text>{' '}
      for 1 seat will be added to the invoice.
    </Text>
  ) : (
    nextProSeatLabel
  );

  useEffect(() => {
    actions.pro.pageMounted();
  }, [actions]);

  if (!prices) return null;

  const smallProTeam = numberOfSeats < 3 && !isPaddle;

  return (
    <Alert title={title}>
      <Text size={3} block marginTop={4} marginBottom={10}>
        <Stack as="label">
          <Checkbox
            checked={confirmed}
            onChange={e => setConfirmed(e.target.checked)}
          />

          {priceLabel}
        </Stack>

        {/** When the team is small, inform the user of the large team pricing as well */}
        {smallProTeam && (
          <Stack>
            <Text size={3} block marginTop={4} marginLeft={6}>
              When the team reaches 4+ editors, I confirm an additional{' '}
              <Text weight="semibold" css={{ whiteSpace: 'nowrap' }}>
                {largeTeamSeatPrice} (excl. tax)
              </Text>{' '}
              for 1 seat will be added to the invoice.
            </Text>
          </Stack>
        )}

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
