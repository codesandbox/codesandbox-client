import React, { useEffect, useState } from 'react';
import { useAppState } from 'app/overmind';
import { useLocation, useHistory } from 'react-router-dom';
import { Stack, Text } from '@codesandbox/components';

import { useCreateCheckout } from 'app/hooks';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { Patron } from './Patron';
import { Stripe } from './Stripe';
import { Paddle } from './Paddle';
import { Upgrade } from './Upgrade';

import { Card } from '../../components';
import { ProcessingPayment } from '../../components/ProcessingPayment';

export const ManageSubscription = () => {
  const { activeTeamInfo, user } = useAppState();
  const { isFree, isPaddle, isPatron, isStripe } = useWorkspaceSubscription();
  const [checkout, createCheckout] = useCreateCheckout();
  const location = useLocation();
  const history = useHistory();

  const [paymentPending, setPaymentPending] = useState(false);

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
        loading={checkout.status === 'loading'}
        onUpgrade={() => {
          createCheckout({
            team_id: activeTeamInfo.id,
            recurring_interval: 'month',
            success_path: dashboard.recent(activeTeamInfo.id),
            cancel_path: dashboard.settings(activeTeamInfo.id),
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
