import { Step, Plan } from './types';

type State = {
  selectedPlan: Plan | null;
  step: Step;
  seats: number;
  isPaddleInitialised: boolean;
  isBillingAmountLoaded: boolean;
};

export const state: State = {
  selectedPlan: null,
  step: Step.WorkspacePlanSelection,
  seats: 1,
  isPaddleInitialised: false,
  isBillingAmountLoaded: false,
};
