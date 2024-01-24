import React from 'react';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { StepProps } from '../types';
import { Payment } from './Payment';
import { ChangePlan } from './ChangePlan';

export const Finalize: React.FC<StepProps> = props => {
  const { isPro } = useWorkspaceSubscription();
  if (isPro) {
    return <ChangePlan {...props} />;
  }
  return <Payment {...props} />;
};
