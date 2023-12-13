import React from 'react';
import { Stack } from '@codesandbox/components';
import { StyledButton } from 'app/components/dashboard/Button';
import { StepProps } from '../types';

export const Plans: React.FC<StepProps> = ({ onCompleted }) => {
  return (
    <Stack align="center" direction="vertical" gap={6}>
      <h1>Choose a plan</h1>
      <StyledButton onClick={onCompleted}>Next</StyledButton>
    </Stack>
  );
};
