import React from 'react';
import { useAppState } from 'app/overmind';
import {
  SubscriptionStatus,
  TeamMemberAuthorization,
  SubscriptionOrigin,
  SubscriptionPaymentProvider,
} from 'app/graphql/types';

import { Stack, Text } from '@codesandbox/components';

import { Card } from '../../components';
import { Upgrade } from './upgrade';
import { Pilot } from './pilot';
import { Paddle } from './paddle';
import { Stripe } from './stripe';

export const ManageSubscription = () => {
  const { activeTeamInfo: team, activeWorkspaceAuthorization } = useAppState();

  if (activeWorkspaceAuthorization !== TeamMemberAuthorization.Admin) {
    return null;
  }

  if (team?.subscription?.status !== SubscriptionStatus.Active) {
    return <Upgrade />;
  }

  const paidMembers = team.userAuthorizations.filter(({ authorization }) =>
    [TeamMemberAuthorization.Admin, TeamMemberAuthorization.Write].includes(
      authorization
    )
  );

  const renderProvider = () => {
    if (team.subscription.origin === SubscriptionOrigin.Pilot) {
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
    <Card css={{ minWidth: 350, flex: 1 }}>
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
