import React from 'react';
import { useAppState } from 'app/overmind';
import {
  SubscriptionType,
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
    <div>
      {team?.subscription?.type === SubscriptionType.TeamPro && (
        <Card>
          <Stack direction="vertical" gap={2}>
            <Stack direction="vertical" gap={4}>
              <Text size={6} weight="bold" maxWidth="100%">
                Invoice details
              </Text>

              {renderProvider()}
            </Stack>
          </Stack>
        </Card>
      )}
    </div>
  );
};
