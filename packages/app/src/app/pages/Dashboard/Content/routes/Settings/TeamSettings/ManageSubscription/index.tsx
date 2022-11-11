import React, { useEffect, useState } from 'react';
import { useAppState } from 'app/overmind';
import {
  SubscriptionStatus,
  TeamMemberAuthorization,
  SubscriptionPaymentProvider,
} from 'app/graphql/types';
import { useLocation, useHistory } from 'react-router-dom';

import { Stack, Text } from '@codesandbox/components';

import { useCreateCheckout } from 'app/hooks';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { Card } from '../../components';
import { Upgrade } from './upgrade';
import { Paddle } from './paddle';
import { Stripe } from './stripe';
import { ProcessingPayment } from '../../components/ProcessingPayment';

export const ManageSubscription = () => {
  const location = useLocation();
  const history = useHistory();
  const [checkout, createCheckout] = useCreateCheckout();
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

  const paidMembers = team.userAuthorizations.filter(({ authorization }) =>
    [TeamMemberAuthorization.Admin, TeamMemberAuthorization.Write].includes(
      authorization
    )
  );

  const renderProvider = () => {
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

          <Text variant="muted" size={3}>{`${paidMembers.length} paid seat${
            paidMembers.length > 1 ? 's' : ''
          }`}</Text>
        </Stack>

        {renderProvider()}
      </Stack>
    </Card>
  );
};
