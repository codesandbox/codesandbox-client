import React from 'react';
import { Stack } from '@codesandbox/components';
import { StyledButton } from 'app/components/dashboard/Button';
import { StepProps } from '../types';

export const Payment: React.FC<StepProps> = ({ onNextStep }) => {
  return (
    <Stack align="center" direction="vertical" gap={6}>
      <h1>Redirecting to our payment provider...</h1>
      <StyledButton onClick={onNextStep}>Next</StyledButton>
    </Stack>
  );
};
