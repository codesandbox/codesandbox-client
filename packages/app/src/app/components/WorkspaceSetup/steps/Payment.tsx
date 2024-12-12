import React, { useEffect, useState } from 'react';
import { Stack, Button, Text, Icon } from '@codesandbox/components';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { useActions, useAppState, useEffects } from 'app/overmind';
import { dashboard as dashboardURLs } from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';
import { SubscriptionInterval } from 'app/graphql/types';
import { StepProps } from '../types';
import { StepHeader } from '../StepHeader';
import { AnimatedStep } from '../elements';

type CheckoutStatus =
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'error'; error: string };

export const Payment: React.FC<StepProps> = ({
  onPrevStep,
  onDismiss,
  currentStep,
  numberOfSteps,
}) => {
  const { api } = useEffects();
  const {
    checkout: { newSubscription },
  } = useAppState();
  const actions = useActions();
  const { getQueryParam } = useURLSearchParams();
  const workspaceId = getQueryParam('workspace');

  const [checkout, setCheckout] = useState<CheckoutStatus>({
    status: 'loading',
  });

  async function createCheckout() {
    setCheckout({ status: 'loading' });
    const successPath = dashboardURLs.portalRelativePath(workspaceId);
    const cancelPath = dashboardURLs.recent(workspaceId);

    if (!workspaceId) {
      // Shouldn't happen
      setCheckout({
        status: 'error',
        error: 'Invalid workspace',
      });
      return;
    }

    try {
      const payload = await api.stripeCreateUBBCheckout({
        success_path: successPath,
        cancel_path: cancelPath,
        team_id: workspaceId,
        plan: newSubscription.basePlan.id,
        billing_interval:
          newSubscription.billingInterval === SubscriptionInterval.Monthly
            ? 'monthly'
            : 'yearly',
        addons: actions.checkout.getFlatAddonsList(),
      });

      if (payload.stripeCheckoutUrl) {
        setCheckout({ status: 'success' });
        track('Subscription - Checkout successfully created');

        window.location.href = payload.stripeCheckoutUrl;
      } else {
        track('Subscription - Failed to create checkout');

        setCheckout({
          status: 'error',
          error: 'Could not generate a checkout URL. Please try again later.',
        });
      }
    } catch (e) {
      setCheckout({
        status: 'error',
        error:
          e?.message ||
          'Could not generate a checkout URL. Please try again later.',
      });
    }
  }

  useEffect(() => {
    createCheckout();
  }, []);

  return (
    <AnimatedStep>
      <Stack direction="vertical" gap={6}>
        <StepHeader
          onPrevStep={onPrevStep}
          onDismiss={onDismiss}
          currentStep={currentStep}
          numberOfSteps={numberOfSteps}
          title={
            checkout.status !== 'error'
              ? 'Redirecting to payment to provider'
              : 'Cannot redirect to payment provider'
          }
        />

        {checkout.status === 'error' ? (
          <>
            <Text variant="danger">{checkout.error} </Text>
            <Stack direction="horizontal" gap={4}>
              <Button size="large" autoWidth onClick={() => createCheckout()}>
                Retry checkout
              </Button>
              <Button
                size="large"
                autoWidth
                variant="secondary"
                onClick={onDismiss}
              >
                Abandon checkout
              </Button>
            </Stack>
          </>
        ) : (
          <Icon size={32} name="spinner" />
        )}
      </Stack>
    </AnimatedStep>
  );
};
