export type WorkspaceSetupStep =
  | 'create'
  | 'members'
  | 'plans'
  | 'plan-options'
  | 'payment';

export interface StepProps {
  onNextStep: () => void;
  onPrevStep: () => void;
  onEarlyExit: () => void;
}
