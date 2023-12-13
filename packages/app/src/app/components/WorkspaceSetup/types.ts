export type WorkspaceSetupStep =
  | 'create'
  | 'members'
  | 'plans'
  | 'extra'
  | 'payment';

export interface StepProps {
  onCompleted: () => void;
  onSkipped?: () => void;
}
