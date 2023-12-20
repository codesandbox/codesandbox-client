import React from 'react';
import { Stack, Element, Button, Text } from '@codesandbox/components';
import { InputText } from 'app/components/dashboard/InputText';
import { PRICING_PLANS, PlanType } from 'app/constants';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
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
  const { getQueryParam } = useURLSearchParams();
  const selectedPlan = getQueryParam('plan') as PlanType;

  const plan = PRICING_PLANS[selectedPlan];

  if (!plan) {
    onPrevStep();
    return null;
  }

  const handleSubmit = e => {
    e.preventDefault();
    onNextStep();
  };

  return (
    <AnimatedStep>
      <Stack
        direction="vertical"
        gap={6}
        css={{ maxWidth: '450px' }}
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
          You will have <Text color="#fff">{plan.credits} credits</Text>{' '}
          included in your subscription. Above this, you can purchase on-demand
          credits at ${plan.additionalCreditsCost}/credit (500 credits for $
          {plan.additionalCreditsCost * 500}).
        </Text>
        <Text>
          Set a monthly spending limit for these on-demand credits, so that you
          can stay within your budget. You can change this limit at any time.
        </Text>

        <InputText
          label="Monthly spending limit for on-demand credits"
          description="For the first two billing cycles, the maximum limit is $100. If
              you need a higher limit, contact us."
          placeholder="100"
          id="spending-limit"
          name="spending-limit"
          required
          max={100}
          min={1}
          defaultValue={100}
          type="number"
          autoFocus
          iconLeft={<Text color="#e5e5e5">$</Text>}
        />
        <Button autoWidth size="large" type="submit">
          Proceed to checkout
        </Button>
      </Stack>
    </AnimatedStep>
  );
};
