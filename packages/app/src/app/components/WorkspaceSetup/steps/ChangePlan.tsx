import React, { useEffect } from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { Stack, Button, Text, Icon } from '@codesandbox/components';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';

import {
  SubscriptionInterval,
  SubscriptionUpdateMoment,
} from 'app/graphql/types';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { useActions, useAppState } from 'app/overmind';
import { StepProps } from '../types';
import { StepHeader } from '../StepHeader';
import { AnimatedStep } from '../elements';

export const ChangePlan: React.FC<StepProps> = ({
  onPrevStep,
  onDismiss,
  currentStep,
  numberOfSteps,
}) => {
  const actions = useActions();
  const { checkout } = useAppState();
  const { getQueryParam } = useURLSearchParams();
  const urlWorkspaceId = getQueryParam('workspace');

  useEffect(() => {
    actions.checkout.calculateSubscriptionUpdateCharge({
      workspaceId: urlWorkspaceId,
    });
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await actions.checkout.updateSubscriptionPlan({
      workspaceId: urlWorkspaceId,
    });
    if (result.success) {
      track('Checkout - Change Pro Plan');
      window.location.href = dashboardUrls.portalOverview(urlWorkspaceId);
    } else {
      actions.addNotification({
        message: result.error,
        type: 'error',
        timeAlive: 10,
      });
    }
  };

  return (
    <AnimatedStep>
      <Stack direction="vertical" gap={12} as="form" onSubmit={handleSubmit}>
        <StepHeader
          onPrevStep={onPrevStep}
          onDismiss={onDismiss}
          currentStep={currentStep}
          numberOfSteps={numberOfSteps}
          title="Review plan"
        />

        <Text color="#e5e5e5">You are switching to the following plan:</Text>

        <Stack justify="space-between" gap={4}>
          <Stack direction="vertical">
            <Text size={6} color="#e5e5e5">
              Pro plan
            </Text>
            <Text>{checkout.newSubscription.totalCredits} VM credits</Text>
          </Stack>
          <Text size={6} color="#e5e5e5">
            ${checkout.newSubscription.totalPrice} /{' '}
            {checkout.newSubscription.billingInterval ===
            SubscriptionInterval.Monthly
              ? 'month'
              : 'year'}
          </Text>
        </Stack>

        <Text>
          Additional VM credits are available on-demand for $0.015/credit.
          <br />
          Spending limit: ${checkout.spendingLimit} / month
        </Text>

        {checkout.convertPlanCharge && (
          <Stack direction="vertical" gap={2}>
            <Stack justify="space-between" gap={4}>
              <Stack direction="vertical">
                <Text size={6} color="#e5e5e5">
                  Current charge
                </Text>
                {checkout.convertPlanCharge.total > 0 && (
                  /** If amount charged is 0 show a single line */
                  <Text>Charge (excl. taxes)</Text>
                )}
              </Stack>
              <Stack direction="vertical" align="flex-end">
                <Text size={6} color="#e5e5e5">
                  ${checkout.convertPlanCharge.total}
                </Text>
                {checkout.convertPlanCharge.total > 0 && (
                  /** If amount charged is 0 show a single line */
                  <Text>${checkout.convertPlanCharge.totalExcludingTax}</Text>
                )}
              </Stack>
            </Stack>
            <Stack css={{ color: '#A8BFFA' }} gap={1}>
              <Icon name="circleBang" size={20} />
              <Text>
                The charge has been prorated based on your existing plan.
                <br />
                {checkout.convertPlanCharge.updateMoment ===
                SubscriptionUpdateMoment.Immediately
                  ? 'Your new billing cycle will start now.'
                  : 'The change will take effect when your current billing cycle will end.'}
              </Text>
            </Stack>
          </Stack>
        )}

        <Button autoWidth size="large" type="submit">
          Accept changes
        </Button>
      </Stack>
    </AnimatedStep>
  );
};
