import React, { useEffect, useState } from 'react';
import { useAppState } from 'app/overmind';
import { useLocation, useHistory } from 'react-router-dom';
import { Stack, Text } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useCreateCheckout } from 'app/hooks';
import { Patron } from './Patron';
import { Stripe } from './Stripe';
import { Paddle } from './Paddle';
import { Upgrade } from './Upgrade';

import { Card } from '../../components';
import { ProcessingPayment } from '../../components/ProcessingPayment';

export const ManageSubscription = () => {
  const { user } = useAppState();
  const { isFree, isPaddle, isPatron, isStripe } = useWorkspaceSubscription();
  const location = useLocation();
  const history = useHistory();

  const [paymentPending, setPaymentPending] = useState(false);

  const [checkout, createCheckout] = useCreateCheckout();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.has('payment_pending')) {
      setPaymentPending(true);
      queryParams.delete('payment_pending');
      history.replace({ search: queryParams.toString() });
    }
  }, [location, history]);

  if (isFree) {
    if (paymentPending) {
      return <ProcessingPayment />;
    }

    return (
      <Upgrade
        disabled={checkout.status === 'loading'}
        onUpgrade={() => {
          track('User settings - Upgrade to Pro clicked', {
            codesandbox: 'V1',
            event_source: 'UI',
          });

          createCheckout({
            utm_source: 'user_settings',
          });
        }}
      />
    );
  }

  const renderDetailsContent = () => {
    if (isPatron) return <Patron />;
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
