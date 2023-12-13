import React from 'react';
import { Stack } from '@codesandbox/components';
import { StyledButton } from 'app/components/dashboard/Button';
import { StepProps } from '../types';

export const Extra: React.FC<StepProps> = ({ onCompleted }) => {
  return (
    <Stack align="center" direction="vertical" gap={6}>
      <h1>Choose extras</h1>
      <StyledButton onClick={onCompleted}>Proceed to checkout</StyledButton>
    </Stack>
  );
};
