import { Step, Plan, PaymentSummary } from './types';

type State = {
  selectedPlan: Plan | null;
  step: Step;
  seats: number;
  isPaddleInitialised: boolean;
  isBillingAmountLoaded: boolean;
  summary: PaymentSummary | null;
};

export const state: State = {
  selectedPlan: null,
  step: Step.WorkspacePlanSelection,
  seats: 1,
  isPaddleInitialised: false,
  isBillingAmountLoaded: false,
  summary: null,
};
