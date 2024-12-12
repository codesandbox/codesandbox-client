import React from 'react';
import { Icon, Stack, Text, Button } from '@codesandbox/components';

interface StepHeaderProps {
  numberOfSteps: number;
  currentStep: number;
  title: string;
  headerNote?: React.ReactNode;
  onPrevStep: () => void;
  onDismiss: () => void;
}

export const StepHeader = ({
  currentStep,
  numberOfSteps,
  title,
  headerNote,
  onDismiss,
  onPrevStep,
}: StepHeaderProps) => {
  return (
    <Stack direction="vertical" gap={8}>
      {currentStep === 0 ? (
        <Button autoWidth variant="secondary" onClick={onDismiss}>
          <Stack gap={2}>
            <Icon
              name="arrowDown"
              css={{ transform: 'rotate(90deg)' }}
              size={16}
            />
            <Text>Cancel</Text>
          </Stack>
        </Button>
      ) : (
        <Button autoWidth variant="secondary" onClick={onPrevStep}>
          <Stack gap={2}>
            <Icon
              name="arrowDown"
              css={{ transform: 'rotate(90deg)' }}
              size={16}
            />
            <Text>Back</Text>
          </Stack>
        </Button>
      )}
      <Stack direction="vertical" gap={1}>
        {numberOfSteps > 1 && (
          <Text size={4} weight="medium" color="#fff">
            STEP {currentStep + 1} OF {numberOfSteps}
          </Text>
        )}

        <Text
          margin={0}
          as="h1"
          color="#fff"
          weight="medium"
          fontFamily="everett"
          size={32}
        >
          {title}
        </Text>

        {headerNote && <Text>{headerNote}</Text>}
      </Stack>
    </Stack>
  );
};
