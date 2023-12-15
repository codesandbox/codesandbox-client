import React from 'react';
import { Icon, Stack, Text, Button } from '@codesandbox/components';

export interface StepHeaderProps {
  numberOfSteps: number;
  currentStep: number;
  title: string;
  onPrevStep: () => void;
  onDismiss: () => void;
}

export const StepHeader = ({
  currentStep,
  numberOfSteps,
  title,
  onDismiss,
  onPrevStep,
}) => (
  <Stack direction="vertical" gap={4}>
    {currentStep === 0 ? (
      <Button autoWidth variant="secondary" onClick={onDismiss}>
        <Stack gap={2}>
          <Icon name="cross" size={16} />
          <Text>Cancel</Text>
        </Stack>
      </Button>
    ) : (
      <Button autoWidth variant="secondary" onClick={onPrevStep}>
        <Stack gap={2}>
          <Icon name="backArrow" size={16} />
          <Text>Back</Text>
        </Stack>
      </Button>
    )}
    <Text size={4} weight="medium" color="white">
      STEP {currentStep + 1} OF {numberOfSteps}
    </Text>

    <Text margin={0} as="h1" size={24} color="white">
      {title}
    </Text>
  </Stack>
);
