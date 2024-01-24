export type WorkspaceSetupStep =
  | 'create'
  | 'select-workspace'
  | 'plans'
  | 'addons'
  | 'plan-options'
  | 'finalize';

export interface StepProps {
  currentStep: number;
  numberOfSteps: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onEarlyExit: () => void;
  onDismiss: () => void;
}
