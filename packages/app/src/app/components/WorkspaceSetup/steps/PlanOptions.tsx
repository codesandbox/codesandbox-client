import React from 'react';
import { Stack, Button, Text } from '@codesandbox/components';
import { InputText } from 'app/components/dashboard/InputText';
import { PRICING_PLANS, PlanType } from 'app/constants';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { useEffects } from 'app/overmind';
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
  const effects = useEffects();
  const { getQueryParam } = useURLSearchParams();
  const selectedPlan = getQueryParam('plan') as PlanType;
  const urlWorkspaceId = getQueryParam('workspace');
  const [error, setError] = React.useState<React.ReactNode>('');

  const plan = PRICING_PLANS[selectedPlan];

  if (!plan) {
    onPrevStep();
    return null;
  }

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const spendingLimit = formData.get('spending-limit').toString();
    const spendingLimitNumber = parseInt(spendingLimit, 10);

    if (Number.isNaN(spendingLimitNumber)) {
      return;
    }

    await effects.gql.mutations.setTeamLimits({
      teamId: urlWorkspaceId,
      onDemandSpendingLimit: parseInt(spendingLimit, 10),
    });
    onNextStep();
  };

  return (
    <AnimatedStep>
      <Stack
        direction="vertical"
        gap={6}
        css={{ maxWidth: '400px' }}
        as="form"
        onSubmit={handleSubmit}
      >
        <StepHeader
          onPrevStep={onPrevStep}
          onDismiss={onDismiss}
          currentStep={currentStep}
          numberOfSteps={numberOfSteps}
          title="Set a spending limit"
        />
        <Text>
          Your subscription includes {plan.credits} credits. Over this limit, we
          will automatically charge you for on-demand credits at{' '}
          {plan.additionalCreditsCost}/credit (500 credits for $
          {plan.additionalCreditsCost * 500}).
        </Text>
        <Text>
          You can set a monthly spending limit for these on-demand credits to
          control your spend. You can change it anytime.
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
            defaultValue={100}
            type="number"
            autoFocus
            onChange={handleChange}
            iconLeft={<Text color="#e5e5e5">$</Text>}
          />

          <Text variant="danger">{error}</Text>
        </Stack>
        <Button size="large" type="submit">
          Proceed to checkout
        </Button>
      </Stack>
    </AnimatedStep>
  );
};
