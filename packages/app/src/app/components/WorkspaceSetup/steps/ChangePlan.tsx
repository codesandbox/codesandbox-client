import React from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { Stack, Button, Text, Icon } from '@codesandbox/components';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';

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

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await actions.checkout.convertToUsageBilling({
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
            <Text>{checkout.totalCredits} VM credits</Text>
          </Stack>
          <Text size={6} color="#e5e5e5">
            ${checkout.totalPrice} / month
          </Text>
        </Stack>

        <Text>
          Additional VM credits are available on-demand for $0.018/credit.
          <br />
          Spending limit: ${checkout.spendingLimit} / month
        </Text>

        {checkout.convertProToUBBCharge && (
          <Stack direction="vertical" gap={2}>
            <Stack justify="space-between" gap={4}>
              <Stack direction="vertical">
                <Text size={6} color="#e5e5e5">
                  Current charge
                </Text>
                {checkout.convertProToUBBCharge.total > 0 && (
                  /** If amount charged is 0 show a single line */
                  <Text>Charge (excl. taxes)</Text>
                )}
              </Stack>
              <Stack direction="vertical" align="flex-end">
                <Text size={6} color="#e5e5e5">
                  ${checkout.convertProToUBBCharge.total}
                </Text>
                {checkout.convertProToUBBCharge.total > 0 && (
                  /** If amount charged is 0 show a single line */
                  <Text>
                    ${checkout.convertProToUBBCharge.totalExcludingTax}
                  </Text>
                )}
              </Stack>
            </Stack>
            <Stack css={{ color: '#A8BFFA' }} gap={1}>
              <Icon name="circleBang" size={20} />
              <Text>
                The charge has been prorated based on your existing plan.
                <br />
                Your new billing cycle will start now.
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
