import React from 'react';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceFeatureFlags } from 'app/hooks/useWorkspaceFeatureFlags';

import { StepProps } from '../types';
import { Payment } from './Payment';
import { ChangePlan } from './ChangePlan';
import { ChangeLegacyPlan } from './ChangeLegacyPlan';

export const Finalize: React.FC<StepProps> = props => {
  const { isPro } = useWorkspaceSubscription();
  const { ubbBeta } = useWorkspaceFeatureFlags();

  if (isPro) {
    if (ubbBeta) {
      // Convert between existing usage based plans
      return <ChangePlan {...props} />;
    }

    // Convert to usage based plans
    return <ChangeLegacyPlan {...props} />;
  }

  // New pro subscription, redirect to stripe
  return <Payment {...props} />;
};
