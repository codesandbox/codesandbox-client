import React from 'react';
import { Stack, Button, Text } from '@codesandbox/components';
import { InputText } from 'app/components/dashboard/InputText';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { useActions, useAppState } from 'app/overmind';
import { StepProps } from '../types';
import { StepHeader } from '../StepHeader';
import { AnimatedStep } from '../elements';

export const PlanOptions: React.FC<StepProps> = ({
  onNextStep,
  onPrevStep,
  onDismiss,
  currentStep,
  numberOfSteps,
}) => {
  const actions = useActions();
  const { checkout } = useAppState();
  const { getQueryParam } = useURLSearchParams();
  const urlWorkspaceId = getQueryParam('workspace');
  const [error, setError] = React.useState<React.ReactNode>('');

  const handleChange = e => {
    setError('');
    const value = Number(e.target.value);
    if (Number.isNaN(value) || value < 1) {
      setError('Please enter a valid amount between 1 and 100');
    } else if (value > 100) {
      setError(
        <>
          For the first two billing cycles, the maximum limit is $100. If you
          need a higher limit,{' '}
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

        <Text>
          Set a monthly spending limit for your on-demand credits, so that you
          can stay within your budget. You can change this limit later at any
          time.
        </Text>

        <Stack direction="vertical" gap={2}>
          <InputText
            label="Monthly spending limit for on-demand credits"
            placeholder="100"
            id="spending-limit"
            name="spending-limit"
            required
            max={100}
            min={1}
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
