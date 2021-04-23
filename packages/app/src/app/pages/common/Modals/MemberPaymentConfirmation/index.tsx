import React from 'react';
import { Checkbox, Text, Button, Stack } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import { SubscriptionInterval } from 'app/graphql/types';
import { Alert } from '../Common/Alert';

export const MemberPaymentConfirmation: React.FC<{ title: string }> = ({
  title,
}) => {
  const { activeTeamInfo } = useAppState();
  const actions = useActions();

  const [confirmed, setConfirmed] = React.useState(false);

  const subscription = activeTeamInfo?.subscription!;

  const value =
    subscription.currency +
    ' ' +
    ((subscription.unitPrice || 0) / 100).toFixed(2) +
    '/' +
    subscription.billingInterval?.toLowerCase() +
    ' (excl. tax)';

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
                {value}
              </Text>{' '}
              for 1 seat will be added to the invoice
            </Text>
            {subscription.billingInterval === SubscriptionInterval.Yearly && (
              <Text variant="muted">
                {' '}
                (prorated for the days remaining in the billing cycle)
              </Text>
            )}
          </span>
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
