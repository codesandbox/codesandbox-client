import React from 'react';
import { format } from 'date-fns';
import { Stack, Text, Tooltip, Icon } from '@codesandbox/components';
import { useAppState } from 'app/overmind';

export const PaddleDetails = () => {
  const { activeTeamInfo } = useAppState();

  if (activeTeamInfo?.subscription.cancelAt) {
    return null;
  }

  return (
    <div>
      <Tooltip
        label={`Next invoice of ${activeTeamInfo?.subscription.currency} ${(
          (activeTeamInfo?.subscription.quantity *
            activeTeamInfo?.subscription.unitPrice) /
          100
        ).toFixed(2)} (excl. tax) scheduled for ${format(
          new Date(activeTeamInfo?.subscription.nextBillDate),
          'PP'
        )}`}
      >
        <Stack align="center" gap={1}>
          <Text size={3} variant="muted">
            Next invoice: {activeTeamInfo?.subscription.currency}{' '}
            {(
              (activeTeamInfo?.subscription.quantity *
                activeTeamInfo?.subscription.unitPrice) /
              100
            ).toFixed(2)}{' '}
          </Text>
          <Text variant="muted">
            <Icon name="info" size={12} />
          </Text>
        </Stack>
      </Tooltip>
    </div>
  );
};
