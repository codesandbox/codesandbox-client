export enum Step {
  WorkspacePlanSelection = 'WorkspacePlanSelection',
  InlineCheckout = 'InlineCheckout',
  ConfirmBillingInterval = 'ConfirmBillingInterval',
}

type State = {
  step: Step;
  seats: number;
  isPaddleInitialised: boolean;
  isBillingAmountLoaded: boolean;
};

export const state: State = {
  step: Step.WorkspacePlanSelection,
  seats: 1,
  isPaddleInitialised: false,
  isBillingAmountLoaded: false,
};
