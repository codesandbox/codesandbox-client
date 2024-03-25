import React from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { Stack, Button, Text, Element } from '@codesandbox/components';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';

import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { useActions, useAppState } from 'app/overmind';
import { AddonItem } from 'app/overmind/namespaces/checkout/types';
import { StepProps } from '../types';
import { StepHeader } from '../StepHeader';
import { AnimatedStep } from '../elements';

export const ChangeAddons: React.FC<StepProps> = ({
  onPrevStep,
  onDismiss,
  currentStep,
  numberOfSteps,
}) => {
  const { checkout } = useAppState();
  const { getQueryParam } = useURLSearchParams();
  const urlWorkspaceId = getQueryParam('workspace');

  const handleSubmit = async e => {
    e.preventDefault();
    // const result = await actions.checkout.convertToUsageBilling({
    //   workspaceId: urlWorkspaceId,
    // });
    // if (result.success) {
    //   track('Checkout - Change Pro Plan');
    //   window.location.href = dashboardUrls.portalOverview(urlWorkspaceId);
    // } else {
    //   actions.addNotification({
    //     message: result.error,
    //     type: 'error',
    //     timeAlive: 10,
    //   });
    // }
  };

  return (
    <AnimatedStep>
      <Stack
        direction="vertical"
        css={{ minWidth: '400px' }}
        gap={12}
        as="form"
        onSubmit={handleSubmit}
      >
        <StepHeader
          onPrevStep={onPrevStep}
          onDismiss={onDismiss}
          currentStep={currentStep}
          numberOfSteps={numberOfSteps}
          title="Review changes"
        />

        <Stack direction="vertical" gap={6}>
          <Stack justify="space-between" gap={4}>
            <Text size={5} color="#e5e5e5">
              Current plan (per month)
            </Text>
            <Text size={5} color="#e5e5e5">
              ${checkout.currentSubscriptionTotalPrice}
            </Text>
          </Stack>

          {checkout.addonChanges.map(change => {
            const changePrefix = change.quantity > 0 ? 'Added' : 'Removed';
            const changeSign = change.quantity > 0 ? '+' : '-';

            return (
              <Stack justify="space-between" key={change.addon.id} gap={4}>
                <Text size={5} color="#e5e5e5">
                  {changePrefix}{' '}
                  {Math.abs(change.quantity) > 1
                    ? `${Math.abs(change.quantity)} x `
                    : ''}
                  {change.addon.credits} VM credits
                </Text>
                <Text
                  size={5}
                  color={change.quantity > 0 ? '#A3EC98' : '#DD5F5F'}
                >
                  {changeSign}${change.addon.price * Math.abs(change.quantity)}
                </Text>
              </Stack>
            );
          })}

          <Element as="hr" css={{ width: '100%' }} />

          <Stack justify="space-between" gap={4}>
            <Text size={5} color="#e5e5e5">
              New total (per month)
            </Text>
            <Text size={5} color="#e5e5e5">
              ${checkout.totalPrice}
            </Text>
          </Stack>
        </Stack>

        <Button autoWidth size="large" type="submit">
          Confirm changes
        </Button>
      </Stack>
    </AnimatedStep>
  );
};
