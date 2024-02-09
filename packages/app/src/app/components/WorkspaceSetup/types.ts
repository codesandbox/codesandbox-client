export type WorkspaceSetupStep =
  | 'create'
  | 'select-workspace'
  | 'plans'
  | 'addons'
  | 'spending-limit'
  | 'finalize';

export interface StepProps {
  currentStep: number;
  numberOfSteps: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onEarlyExit: (fullReload?: boolean) => void;
  onDismiss: () => void;
}
