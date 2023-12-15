import React from 'react';
import { Stack } from '@codesandbox/components';
import { StyledButton } from 'app/components/dashboard/Button';
import { StepProps } from '../types';
import { StepHeader } from '../StepHeader';
import { AnimatedStep } from '../elements';

export const Payment: React.FC<StepProps> = ({
  onNextStep,
  onPrevStep,
  onDismiss,
  currentStep,
  numberOfSteps,
}) => {
  return (
    <AnimatedStep>
      <Stack direction="vertical" gap={6}>
        <StepHeader
          onPrevStep={onPrevStep}
          onDismiss={onDismiss}
          currentStep={currentStep}
          numberOfSteps={numberOfSteps}
          title="Redirecting to payment to provider..."
        />
        <StyledButton onClick={onNextStep}>Finish checkout</StyledButton>
        <StyledButton onClick={onDismiss}>Cancel checkout</StyledButton>
      </Stack>
    </AnimatedStep>
  );
};
