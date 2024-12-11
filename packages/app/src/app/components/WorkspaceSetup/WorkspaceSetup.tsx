import React from 'react';
import { WorkspaceFlowLayout } from './Layout';
import { StepProps, WorkspaceSetupStep, WorkspaceFlow } from './types';
import { Create } from './steps/Create';
import { Plans } from './steps/Plans';
import { SpendingLimit } from './steps/SpendingLimit';
import { SelectWorkspace } from './steps/SelectWorkspace';
import { Addons } from './steps/Addons';
import { Finalize } from './steps/Finalize';
import { SelectUsecases } from './steps/SelectUsecases';

export type WorkspaceSetupProps = {
  flow: WorkspaceFlow;
  steps: WorkspaceSetupStep[];
  startFrom?: WorkspaceSetupStep; // when this isn't passed, first one from the array is used
  onComplete: (fullReload?: boolean) => void;
  onDismiss: () => void;
};

export const WorkspaceSetup: React.FC<WorkspaceSetupProps> = ({
  flow,
  steps,
  startFrom,
  onComplete,
  onDismiss,
}) => {
  const startFromIndex = startFrom ? steps.indexOf(startFrom) : 0;
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(
    startFromIndex
  );

  const currentStep = steps[currentStepIndex];
  const Component = STEP_COMPONENTS[currentStep];

  if (currentStepIndex >= steps.length) {
    onComplete();
    return null;
  }

  return (
    <WorkspaceFlowLayout
      showSummary={STEPS_WITH_CHECKOUT.includes(currentStep)}
      allowSummaryChanges={currentStep === 'addons'}
      flow={flow}
    >
      <Component
        flow={flow}
        currentStep={currentStepIndex}
        numberOfSteps={steps.length}
        onPrevStep={() => setCurrentStepIndex(crtStepIndex => crtStepIndex - 1)}
        onNextStep={() => setCurrentStepIndex(crtStepIndex => crtStepIndex + 1)}
        onEarlyExit={onComplete}
        onDismiss={onDismiss}
      />
    </WorkspaceFlowLayout>
  );
};

const STEP_COMPONENTS: Record<WorkspaceSetupStep, React.FC<StepProps>> = {
  create: Create,
  'select-workspace': SelectWorkspace,
  usecases: SelectUsecases,
  plans: Plans,
  'spending-limit': SpendingLimit,
  addons: Addons, // Deprecated
  finalize: Finalize,
};

const STEPS_WITH_CHECKOUT: WorkspaceSetupStep[] = ['spending-limit', 'addons'];
