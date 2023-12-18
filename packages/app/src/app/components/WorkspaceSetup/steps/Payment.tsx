import React from 'react';
import { Stack, Button } from '@codesandbox/components';
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
        <Button size="large" onClick={onNextStep}>
          Finish checkout
        </Button>
        <Button size="large" onClick={onDismiss}>
          Cancel checkout
        </Button>
      </Stack>
    </AnimatedStep>
  );
};
