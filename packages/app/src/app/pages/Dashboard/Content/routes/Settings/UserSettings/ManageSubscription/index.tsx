import React, { useEffect, useState } from 'react';
import { useAppState } from 'app/overmind';
import {
  SubscriptionStatus,
  SubscriptionOrigin,
  SubscriptionPaymentProvider,
} from 'app/graphql/types';
import { useLocation, useHistory } from 'react-router-dom';
import { Stack, Text } from '@codesandbox/components';

import { Patron } from './Patron';
import { Stripe } from './Stripe';
import { Paddle } from './Paddle';
import { Upgrade } from './upgrade';

import { Card } from '../../components';
import { ProcessingPayment } from '../../components/ProcessingPayment';

export const ManageSubscription = () => {
  const { activeTeamInfo, user } = useAppState();
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

  const activeSubscription =
    activeTeamInfo?.subscription?.status === SubscriptionStatus.Active;

  const isPatron = [
    SubscriptionOrigin.Legacy,
    SubscriptionOrigin.Patron,
  ].includes(activeTeamInfo?.subscription?.origin);
  const isPaddle =
    activeTeamInfo?.subscription?.paymentProvider ===
    SubscriptionPaymentProvider.Paddle;

  const isStripe =
    activeTeamInfo?.subscription?.paymentProvider ===
    SubscriptionPaymentProvider.Stripe;

  const renderDetailsContent = () => {
    if (isPatron) return <Patron />;
    if (isPaddle) return <Paddle />;
    if (isStripe) return <Stripe />;

    return null;
  };

  if (!activeSubscription) {
    if (paymentPending) {
      return <ProcessingPayment />;
    }

    return <Upgrade />;
  }

  return (
    <Card>
      <Stack direction="vertical" gap={2}>
        <Stack direction="vertical" gap={2}>
          <Text size={6} weight="bold" maxWidth="100%">
            Personal Pro
          </Text>

          <Text size={3} maxWidth="100%" variant="muted">
            Invoices are sent to
          </Text>
          <Text size={3} maxWidth="100%" variant="muted">
            {user.email}
          </Text>

          <Stack direction="vertical" gap={2} marginTop={4}>
            {renderDetailsContent()}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};
