import React from 'react';
import { useAppState } from 'app/overmind';
import { Stack, Text } from '@codesandbox/components';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

import { Stripe } from './Stripe';
import { Paddle } from './Paddle';
import { Upgrade } from './Upgrade';

import { Card } from '../../components';
import { ProcessingPayment } from '../../components/ProcessingPayment';

export const ManageSubscription = () => {
  const { user, isProcessingPayment, userCanStartTrial } = useAppState();
  const { isFree, isPaddle, isStripe } = useWorkspaceSubscription();

  if (isFree) {
    if (isProcessingPayment) {
      return <ProcessingPayment />;
    }

    return <Upgrade userCanStartTrial={userCanStartTrial} />;
  }

  // Legacy Personal Pro

  const renderDetailsContent = () => {
    if (isPaddle) return <Paddle />;
    if (isStripe) return <Stripe />;

    return null;
  };

  return (
    <Card>
      <Stack
        direction="vertical"
        gap={2}
        justify="space-between"
        css={{ height: '100%' }}
      >
        <Stack direction="vertical" gap={1}>
          <Text size={4} weight="bold" maxWidth="100%">
            Personal Pro
          </Text>

          <Text size={3} maxWidth="100%" variant="muted">
            Invoices are sent to
          </Text>
          <Text size={3} maxWidth="100%" variant="muted">
            {user.email}
          </Text>
        </Stack>
        <Stack direction="vertical" gap={2}>
          {renderDetailsContent()}
        </Stack>
      </Stack>
    </Card>
  );
};
