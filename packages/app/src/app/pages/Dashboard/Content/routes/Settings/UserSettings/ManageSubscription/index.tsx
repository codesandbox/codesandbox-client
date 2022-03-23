import React from 'react';
import { useAppState } from 'app/overmind';
import {
  SubscriptionStatus,
  SubscriptionOrigin,
  SubscriptionPaymentProvider,
} from 'app/graphql/types';

import { Stack, Text } from '@codesandbox/components';
import { PatronPlan } from './PatronPlan';
import { PaddlePlan } from './PaddlePlan';
import { StripePlan } from './StripePlan';
import { PaddleDetails } from './PaddleDetails';
import { Upgrade } from './upgrade';

import { Card } from '../../components';

export const ManageSubscription = () => {
  const { activeTeamInfo, user } = useAppState();

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

  const renderPlanCardContent = () => {
    if (!activeSubscription) return null;
    if (isPatron) return <PatronPlan />;
    if (isPaddle) return <PaddlePlan />;
    if (isStripe) return <StripePlan />;

    return null;
  };

  const renderDetailsContent = () => {
    if (isPatron) {
      return (
        <Text size={3} variant="muted">
          USD {user?.subscription.amount}{' '}
        </Text>
      );
    }
    if (isPaddle) return <PaddleDetails />;

    if (isStripe) {
      return null;
    }

    return null;
  };

  return (
    <>
      <Card>
        <Stack direction="vertical" gap={2}>
          <Stack direction="vertical" gap={2}>
            <Text size={6} weight="bold" maxWidth="100%">
              Plan
            </Text>
            <Text size={3} maxWidth="100%" variant="muted">
              {activeSubscription ? 'Personal Pro' : 'Personal (free)'}
            </Text>

            {renderPlanCardContent()}
          </Stack>
        </Stack>
      </Card>

      {activeSubscription ? (
        <Card>
          <Stack direction="vertical" gap={2}>
            <Stack direction="vertical" gap={2}>
              <Text size={6} weight="bold" maxWidth="100%">
                Invoice details
              </Text>

              {renderDetailsContent()}

              <Text size={3} maxWidth="100%" variant="muted">
                Invoices are sent to
              </Text>
              <Text size={3} maxWidth="100%" variant="muted">
                {user.email}
              </Text>
            </Stack>
          </Stack>
        </Card>
      ) : (
        <Upgrade />
      )}
    </>
  );
};
