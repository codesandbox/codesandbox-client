import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { Stack, Text } from '@codesandbox/components';

import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { SubscriptionInterval } from 'app/graphql/types';
import { Card } from '../../components';
import { Upgrade } from './upgrade';
import { Paddle } from './paddle';
import { Stripe } from './stripe';
import { ProcessingPayment } from '../../components/ProcessingPayment';

export const ManageSubscription = () => {
  const location = useLocation();
  const history = useHistory();
  const {
    isFree,
    hasActiveTeamTrial,
    numberOfSeats,
    isPaddle,
    isStripe,
    subscription,
    hasPaymentMethod,
  } = useWorkspaceSubscription();
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
  if (isFree) {
    if (paymentPending) {
      return <ProcessingPayment />;
    }

    return <Upgrade />;
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
          <Text size={4} maxWidth="100%" weight="500">
            Team Pro {hasActiveTeamTrial ? 'trial' : ''}
          </Text>

          {hasPaymentMethod ? (
            <Stack direction="vertical" gap={1}>
              <Text variant="muted" size={3}>{`${numberOfSeats} paid seat${
                numberOfSeats > 1 ? 's' : ''
              }`}</Text>

              {/* TODO: the logic for figuring out a canceled vs an active trial should be revisited */}
              {hasActiveTeamTrial && !subscription.cancelAt ? (
                <Text variant="muted" size={3}>
                  Your free trial ends on{' '}
                  {printLocalDateFormat(subscription.trialEnd)}.{' '}
                  {hasPaymentMethod
                    ? `After this period you'll be automatically charged per ${
                        subscription.billingInterval ===
                        SubscriptionInterval.Monthly
                          ? 'month'
                          : 'year'
                      }.`
                    : null}
                </Text>
              ) : null}
            </Stack>
          ) : (
            <Text variant="muted" size={3}>
              {`Your trial ends on ${printLocalDateFormat(
                subscription.trialEnd
              )}. After this period, you'll need to update your payment method to continue using Pro features.`}
            </Text>
          )}
        </Stack>

        {renderProvider()}
      </Stack>
    </Card>
  );
};

const printLocalDateFormat = (date: string) =>
  new Date(date).toLocaleDateString();
