export type WorkspaceSetupStep =
  | 'create'
  | 'select-workspace'
  | 'usecases'
  | 'plans'
  | 'addons'
  | 'spending-limit'
  | 'finalize';

export interface StepProps {
  flow: WorkspaceFlow;
  currentStep: number;
  numberOfSteps: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onEarlyExit: (fullReload?: boolean) => void;
  onDismiss: () => void;
}

export type WorkspaceFlow = 'create-workspace' | 'upgrade' | 'manage-addons';
