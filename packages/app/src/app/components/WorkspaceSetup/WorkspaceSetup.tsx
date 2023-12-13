import React from 'react';
import { StepProps, WorkspaceSetupStep } from './types';
import { Create } from './steps/Create';
import { Members } from './steps/Members';
import { Plans } from './steps/Plans';
import { Extra } from './steps/Extra';
import { Payment } from './steps/Payment';

export interface WorkspaceSetupProps {
  steps: WorkspaceSetupStep[];
  startFrom?: WorkspaceSetupStep; // when this isn't passed, first one from the array is used
  onFinished: () => void;
}

export const WorkspaceSetup: React.FC<WorkspaceSetupProps> = ({
  steps,
  startFrom,
  onFinished,
}) => {
  const startFromIndex = startFrom ? steps.indexOf(startFrom) : 0;
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(
    startFromIndex
  );

  const currentStep = steps[currentStepIndex];
  const Component = STEP_COMPONENTS[currentStep];

  if (currentStepIndex >= steps.length) {
    onFinished();
    return null;
  }

  return (
    <Component
      onCompleted={() => setCurrentStepIndex(crtStepIndex => crtStepIndex + 1)}
    />
  );
};

export const STEP_COMPONENTS: Record<
  WorkspaceSetupStep,
  React.FC<StepProps>
> = {
  create: Create,
  members: Members,
  plans: Plans,
  extra: Extra,
  payment: Payment,
};
