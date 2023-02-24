import React, { useEffect } from 'react';
import { Checkbox, Text, Button, Stack } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { formatCurrency } from 'app/utils/currency';

import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { Alert } from '../Common/Alert';

export const MemberPaymentConfirmation: React.FC<{ title: string }> = ({
  title,
}) => {
  const {
    pro: { prices },
  } = useAppState();
  const actions = useActions();
  const { isTeamSpace } = useWorkspaceAuthorization();
  const { isPaddle, subscription } = useWorkspaceSubscription();

  const [confirmed, setConfirmed] = React.useState(false);

  const getValue = () => {
    if (isPaddle) {
      return (
        subscription.currency +
        ' ' +
        ((subscription.unitPrice || 0) / 100).toFixed(2) +
        '/' +
        subscription.billingInterval?.toLowerCase()
      );
    }

    if (!prices) return null;

    const period =
      subscription.billingInterval === 'MONTHLY' ? 'month' : 'year';
    const proType = isTeamSpace ? 'team' : 'individual';
    const price = prices[proType][period];

    if (!price) return null;

    return `${formatCurrency({
      amount: price.usd,
      currency: 'USD',
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
