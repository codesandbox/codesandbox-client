export type WorkspaceSetupStep =
  | 'create'
  | 'members'
  | 'select-workspace'
  | 'plans'
  | 'plan-options'
  | 'payment';

export interface StepProps {
  currentStep: number;
  numberOfSteps: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onEarlyExit: () => void;
  onDismiss: () => void;
}
