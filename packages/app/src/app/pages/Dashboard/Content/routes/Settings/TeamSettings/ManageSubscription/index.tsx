import React, { useEffect, useState } from 'react';
import { useAppState } from 'app/overmind';
import {
  SubscriptionStatus,
  TeamMemberAuthorization,
  SubscriptionOrigin,
  SubscriptionPaymentProvider,
} from 'app/graphql/types';
import { useLocation, useHistory } from 'react-router-dom';

import { Stack, Text } from '@codesandbox/components';

import { Card } from '../../components';
import { Upgrade } from './upgrade';
import { Pilot } from './pilot';
import { Paddle } from './paddle';
import { Stripe } from './stripe';
import { ProcessingPayment } from '../../components/ProcessingPayment';

export const ManageSubscription = () => {
  const location = useLocation();
  const history = useHistory();
  const { activeTeamInfo: team, activeWorkspaceAuthorization } = useAppState();
  const [paymentPending, setPaymentPending] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.has('payment_pending')) {
      setPaymentPending(true);
      queryParams.delete('payment_pending');
      history.replace({ search: queryParams.toString() });
    }
  }, [location, history]);

  if (activeWorkspaceAuthorization !== TeamMemberAuthorization.Admin) {
    return null;
  }

  // If the subscription is active or the team/user is still in the trial period
  // we skip the payment processing/upgrade to pro screen.
  if (
    ![SubscriptionStatus.Active, SubscriptionStatus.Trialing].includes(
      team.subscription?.status
    )
  ) {
    if (paymentPending) {
      return <ProcessingPayment />;
    }

    return <Upgrade />;
  }

  const paidMembers = team.userAuthorizations.filter(({ authorization }) =>
    [TeamMemberAuthorization.Admin, TeamMemberAuthorization.Write].includes(
      authorization
    )
  );

  const renderProvider = () => {
    if (team.subscription?.origin === SubscriptionOrigin.Pilot) {
      return <Pilot />;
    }

    if (
      team?.subscription?.paymentProvider === SubscriptionPaymentProvider.Paddle
    ) {
      return <Paddle />;
    }

    if (
      team?.subscription?.paymentProvider === SubscriptionPaymentProvider.Stripe
    ) {
      return <Stripe />;
    }

    return null;
  };

  return (
    <Card>
      <Stack direction="vertical" gap={2}>
        <Stack direction="vertical" gap={4}>
          <Text size={6} weight="bold" maxWidth="100%">
            Team Pro
          </Text>

          <Text variant="muted" size={3}>{`${paidMembers.length} paid seat${
            paidMembers.length > 1 ? 's' : ''
          }`}</Text>

          {renderProvider()}
        </Stack>
      </Stack>
    </Card>
  );
};
