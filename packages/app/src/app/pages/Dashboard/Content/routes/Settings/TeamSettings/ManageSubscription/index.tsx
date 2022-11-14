import React, { useEffect, useState } from 'react';
import { useAppState } from 'app/overmind';
import { useLocation, useHistory } from 'react-router-dom';

import { Stack, Text } from '@codesandbox/components';

import { useCreateCheckout } from 'app/hooks';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useSubscription } from 'app/hooks/useSubscription';
import { Card } from '../../components';
import { Upgrade } from './upgrade';
import { Paddle } from './paddle';
import { Stripe } from './stripe';
import { ProcessingPayment } from '../../components/ProcessingPayment';

export const ManageSubscription = () => {
  const location = useLocation();
  const history = useHistory();
  const [checkout, createCheckout] = useCreateCheckout();
  const { activeTeamInfo: team } = useAppState();
  const {
    hasActiveSubscription,
    numberOfSeats,
    isPaddle,
    isStripe,
  } = useSubscription();
  const { isTeamAdmin } = useWorkspaceAuthorization();

  const [paymentPending, setPaymentPending] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.has('payment_pending')) {
      setPaymentPending(true);
      queryParams.delete('payment_pending');
      history.replace({ search: queryParams.toString() });
    }
  }, [location, history]);

  if (!isTeamAdmin) {
    return null;
  }

  // If the subscription is active or the team/user is still in the trial period
  // we skip the payment processing/upgrade to pro screen.
  if (!hasActiveSubscription) {
    if (paymentPending) {
      return <ProcessingPayment />;
    }

    return (
      <Upgrade
        loading={checkout.status === 'loading'}
        onUpgrade={() => {
          createCheckout({
            team_id: team.id,
            recurring_interval: 'month',
            success_path: dashboard.recent(team.id),
            cancel_path: dashboard.settings(team.id),
          });
        }}
      />
    );
  }

  const renderProvider = () => {
    if (isPaddle) {
      return <Paddle />;
    }

    if (isStripe) {
      return <Stripe />;
    }

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
        <Stack direction="vertical" gap={4}>
          <Text size={4} weight="bold" maxWidth="100%">
            Team Pro
          </Text>

          <Text variant="muted" size={3}>{`${numberOfSeats} paid seat${
            numberOfSeats > 1 ? 's' : ''
          }`}</Text>
        </Stack>

        {renderProvider()}
      </Stack>
    </Card>
  );
};
