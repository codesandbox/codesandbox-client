import React from 'react';
import { Stack, Text, SkeletonText } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { useAppState, useActions, useEffects } from 'app/overmind';
import { SubscriptionInterval } from 'app/graphql/types';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

import {
  StyledCard,
  StyledSubscriptionLink,
} from '../components/SubscriptionCard';

// Base unit to calculate price from cents to full currency.
const BASE_UNIT = 100;

export const ConfirmBillingInterval: React.FC = () => {
  const { seats, paymentPreview, updatingSubscription } = useAppState().pro;
  const { notificationToast } = useEffects();
  const {
    previewUpdateSubscriptionBillingInterval,
    updateSubscriptionBillingInterval,
  } = useActions().pro;

  const { subscription } = useWorkspaceSubscription();

  if (!paymentPreview) {
    previewUpdateSubscriptionBillingInterval({
      billingInterval: SubscriptionInterval.Yearly,
    });
  }

  const updateBillingInterval = async () => {
    track('legacy subscription page - update billing interval', {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    try {
      await updateSubscriptionBillingInterval({
        billingInterval: SubscriptionInterval.Yearly,
      });
    } catch {
      notificationToast.error(
        'There was a problem updating your billing interval. Please email us at support@codesandbox.io'
      );
    }
  };

  return (
    <div>
      <Stack gap={10} direction="vertical">
        <Stack gap={3} direction="vertical" align="center">
          <Text
            as="h1"
            fontFamily="everett"
            size={48}
            weight="500"
            align="center"
            lineHeight="56px"
            margin={0}
          >
            Change to yearly billing.
          </Text>
        </Stack>

        <Stack justify="center">
          <StyledCard isHighlighted>
            <Stack direction="vertical" gap={9}>
              <Stack direction="vertical" gap={6}>
                <Stack direction="vertical" gap={1}>
                  <Stack justify="space-between" gap={2}>
                    <Text>
                      {subscription.quantity}{' '}
                      {subscription.quantity === 1 ? 'seat' : 'seats'}
                    </Text>
                    {paymentPreview ? (
                      <Text>
                        {paymentPreview.nextPayment.currency}{' '}
                        {(
                          paymentPreview.nextPayment.amount /
                          BASE_UNIT /
                          seats
                        ).toFixed(2)}
                      </Text>
                    ) : (
                      <SkeletonText css={{ width: '50px' }} />
                    )}
                  </Stack>
                  <Stack justify="space-between" gap={2}>
                    <Text>Proration for days left in subscription</Text>
                    {paymentPreview ? (
                      <Text>
                        - {paymentPreview.nextPayment.currency}{' '}
                        {(
                          (paymentPreview.nextPayment.amount -
                            paymentPreview.immediatePayment.amount) /
                          BASE_UNIT
                        ).toFixed(2)}
                      </Text>
                    ) : (
                      <SkeletonText css={{ width: '50px' }} />
                    )}
                  </Stack>
                </Stack>
                <Stack justify="space-between" gap={2}>
                  <Text weight="bold" size={4}>
                    Total
                  </Text>
                  {paymentPreview ? (
                    <Text weight="bold" size={4}>
                      {paymentPreview.immediatePayment.currency}{' '}
                      {(
                        paymentPreview.immediatePayment.amount / BASE_UNIT
                      ).toFixed(2)}{' '}
                      (incl. tax)
                    </Text>
                  ) : (
                    <SkeletonText css={{ width: '100px' }} />
                  )}
                </Stack>
              </Stack>
              <StyledSubscriptionLink
                as="button"
                onClick={updateBillingInterval}
                variant="highlight"
                disabled={updatingSubscription}
              >
                {!paymentPreview || updatingSubscription
                  ? 'Loading...'
                  : 'Update billing interval'}
              </StyledSubscriptionLink>
            </Stack>
          </StyledCard>
        </Stack>
      </Stack>
    </div>
  );
};
