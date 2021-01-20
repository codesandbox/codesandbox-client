import React, { FunctionComponent, useState } from 'react';
import {
  Input,
  Checkbox,
  Text,
  Label,
  Button,
  Stack,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { Alert } from '../Common/Alert';

export const AddMemberToWorkspace: FunctionComponent = () => {
  const {
    actions: { dashboard, modalClosed },
    state: { activeTeamInfo, currentModalMessage },
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
    subscription.details.currency +
    ' ' +
    (subscription.details.unitPrice / 100).toFixed(2) +
    '/' +
    subscription.details.billingInterval.toLowerCase();

  return (
    <Alert title="Add New Member">
      <Text size={3} block marginTop={4} marginBottom={10}>
        <Checkbox
          checked={confirmed}
          onChange={e => setConfirmed(e.target.checked)}
          label={`By adding an extra editor, I confirm ${value} will be added to my invoice.`}
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
