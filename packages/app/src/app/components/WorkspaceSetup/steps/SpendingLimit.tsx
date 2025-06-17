import React from 'react';
import { Stack, Button, Text } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { InputText } from 'app/components/dashboard/InputText';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { useActions, useAppState } from 'app/overmind';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { StepProps } from '../types';
import { StepHeader } from '../StepHeader';
import { AnimatedStep } from '../elements';

export const SpendingLimit: React.FC<StepProps> = ({
  onNextStep,
  onPrevStep,
  onDismiss,
  currentStep,
  numberOfSteps,
  flow,
}) => {
  const actions = useActions();
  const { checkout } = useAppState();
  const { getQueryParam } = useURLSearchParams();
  const urlWorkspaceId = getQueryParam('workspace');
  const [error, setError] = React.useState<React.ReactNode>('');
  const { isPro } = useWorkspaceSubscription();
  const maxSpendingLimit = isPro ? 1000 : 100;

  const handleChange = e => {
    setError('');
    const value = Number(e.target.value);
    if (Number.isNaN(value) || value < 0) {
      setError(`Please enter a valid amount between 0 and ${maxSpendingLimit}`);
    } else if (value > maxSpendingLimit) {
      setError(
        <>
          For the first two billing cycles, the maximum limit is $
          {maxSpendingLimit}. If you need a higher limit,{' '}
          <Text as="a" href="mailto:support@codesandbox.io">
            contact us
          </Text>
          .
        </>
      );
    }
  };

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const spendingLimit = e.target.value;
    const spendingLimitNumber = parseInt(spendingLimit, 10);

    if (Number.isNaN(spendingLimitNumber)) {
      return;
    }

    await actions.checkout.setSpendingLimit({
      workspaceId: urlWorkspaceId,
      spendingLimit: spendingLimitNumber,
    });
  };

  return (
    <AnimatedStep>
      <Stack
        direction="vertical"
        gap={6}
        css={{ maxWidth: '400px' }}
        as="form"
        onSubmit={() => {
          track('Checkout - Proceed to checkout', {
            from: flow,
            currentPlan: isPro ? 'pro' : 'free',
          });
          onNextStep();
        }}
      >
        <StepHeader
          onPrevStep={onPrevStep}
          onDismiss={onDismiss}
          currentStep={currentStep}
          numberOfSteps={numberOfSteps}
          title="Set a spending limit"
        />

        <Text color="#a6a6a6">
          Your plan will include {checkout.newSubscription.totalCredits}{' '}
          credits/month. If your usage exceeds that amount, we will
          automatically bill you for on-demand credits at $0.015/credit. You can
          set a monthly spend limit for on-demand credits to control your spend.
          You can change this limit at any time.
        </Text>

        <Stack direction="vertical" gap={2}>
          <InputText
            label="Monthly spending limit for on-demand credits"
            placeholder="100"
            id="spending-limit"
            name="spending-limit"
            required
            max={maxSpendingLimit}
            min={0}
            defaultValue={checkout.spendingLimit}
            type="number"
            autoFocus
            onChange={handleChange}
            onBlur={handleBlur}
            iconLeft={<Text color="#e5e5e5">$</Text>}
          />

          <Text variant="danger">{error}</Text>
        </Stack>
        <Button autoWidth size="large" type="submit">
          Proceed to checkout
        </Button>
      </Stack>
    </AnimatedStep>
  );
};
