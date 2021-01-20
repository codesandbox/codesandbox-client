import React, { FunctionComponent, useState } from 'react';
import { Checkbox, Text, Button, Stack } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { SubscriptionBillingInterval } from 'app/graphql/types';
import { Alert } from '../Common/Alert';

export const AddMemberToWorkspace: FunctionComponent = () => {
  const {
    actions: { dashboard, modalClosed },
    state: {
      activeTeamInfo,
      currentModalMessage,
      activeWorkspaceAuthorization,
    },
  } = useOvermind();

  const [confirmed, setConfirmed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const inviteValue = currentModalMessage;

  const onSubmit = async () => {
    setLoading(true);
    await dashboard.inviteToTeam(inviteValue);
    setLoading(false);
    modalClosed();
  };

  const subscription = activeTeamInfo.subscription;

  const value =
    subscription.currency +
    ' ' +
    (subscription.unitPrice / 100).toFixed(2) +
    '/' +
    subscription.billingInterval.toLowerCase() +
    ' (excl. tax)';

  let message = `By adding an extra editor, I confirm an additional ${value} for 1 seat will be added to the invoice`;
  if (subscription.billingInterval === SubscriptionBillingInterval.Yearly) {
    message += ' (prorated for the days remaining in the billing cycle)';
  }

  return (
    <Alert title="Add New Member">
      <Text size={3} block marginTop={4} marginBottom={10}>
        <Checkbox
          checked={confirmed}
          onChange={e => setConfirmed(e.target.checked)}
          label={message}
        />
      </Text>
      <Stack gap={2} justify="flex-end">
        <Button autoWidth variant="secondary" onClick={modalClosed}>
          Cancel
        </Button>
        <Button
          loading={loading}
          autoWidth
          disabled={!confirmed}
          onClick={onSubmit}
        >
          Add Member
        </Button>
      </Stack>
    </Alert>
  );
};
