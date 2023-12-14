import React from 'react';
import { Stack, Element, Text } from '@codesandbox/components';
import { StyledButton } from 'app/components/dashboard/Button';
import { InputText } from 'app/components/dashboard/InputText';
import { useLocation } from 'react-router-dom';
import { PRICING_PLANS, PlanType } from 'app/constants';
import { StepProps } from '../types';

export const PlanOptions: React.FC<StepProps> = ({
  onNextStep,
  onPrevStep,
}) => {
  const location = useLocation();
  const selectedPlan = new URLSearchParams(location.search).get(
    'plan'
  ) as PlanType;

  const plan = PRICING_PLANS[selectedPlan];

  if (!plan) {
    onPrevStep();
  }

  const handleSubmit = () => {
    // TODO: API Call to save the limit
    onNextStep();
  };

  return (
    <Stack
      align="flex-start"
      direction="vertical"
      gap={6}
      css={{ maxWidth: '450px' }}
    >
      <Text color="#fff" as="h1" size={32}>
        Set a spending limit
      </Text>
      <Text>
        You will have <Text color="#fff">{plan.credits} credits</Text> included
        in your subscription. Above this, you can purchase on-demand credits at
        ${plan.additionalCreditsCost}/credit (500 credits for $
        {plan.additionalCreditsCost * 500}).
      </Text>
      <Text>
        Set a monthly spending limit for these on-demand credits, so that you
        can stay within your budget.
      </Text>
      <Text>You can change this limit at any time.</Text>
      <Stack gap={2} direction="vertical">
        <Text as="label" htmlFor="spending-limit" color="#fff">
          Monthly spending limit for on-demand credits
        </Text>
        <Text id="spending-limit-description">
          For the first two billing cycles, the maximum limit is $100. If you
          need a higher limit, contact us.
        </Text>
        <Element
          css={{
            position: 'relative',
          }}
        >
          <InputText
            label="Spending limit"
            aria-describedby="spending-limit-description"
            placeholder="100"
            id="spending-limit"
            name="spending-limit"
            required
            max={100}
            defaultValue={100}
            type="number"
            autoFocus
            hideLabel
            onChange={() => {}}
          />
          <Text
            size={4}
            color="#fff"
            css={{ position: 'absolute', left: 4, top: 14 }}
          >
            $
          </Text>
        </Element>
      </Stack>
      <StyledButton onClick={handleSubmit}>Proceed to checkout</StyledButton>
    </Stack>
  );
};
