import React from 'react';
import { WorkspaceFlowLayout } from 'app/pages/WorkspaceFlows/WorkspaceFlowLayout';
import { StepProps, WorkspaceSetupStep } from './types';
import { Create } from './steps/Create';
import { Members } from './steps/Members';
import { Plans } from './steps/Plans';
import { PlanOptions } from './steps/PlanOptions';
import { Payment } from './steps/Payment';

export type WorkspaceSetupProps = {
  steps: WorkspaceSetupStep[];
  startFrom?: WorkspaceSetupStep; // when this isn't passed, first one from the array is used
  onFinished: () => void;
  onDismiss: () => void;
};

export const WorkspaceSetup: React.FC<WorkspaceSetupProps> = ({
  steps,
  startFrom,
  onFinished,
  onDismiss,
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
    <WorkspaceFlowLayout
      currentStep={currentStepIndex}
      onPrevStep={() => setCurrentStepIndex(crtStepIndex => crtStepIndex - 1)}
      onDismiss={onDismiss}
    >
      <Component
        onPrevStep={() => setCurrentStepIndex(crtStepIndex => crtStepIndex - 1)}
        onNextStep={() => setCurrentStepIndex(crtStepIndex => crtStepIndex + 1)}
        onEarlyExit={() => onFinished()}
      />
    </WorkspaceFlowLayout>
  );
};

export const STEP_COMPONENTS: Record<
  WorkspaceSetupStep,
  React.FC<StepProps>
> = {
  create: Create,
  members: Members,
  plans: Plans,
  'plan-options': PlanOptions,
  payment: Payment,
};
