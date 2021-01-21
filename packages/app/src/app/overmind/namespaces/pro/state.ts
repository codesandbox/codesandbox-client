export enum Step {
  WorkspacePlanSelection = 'WorkspacePlanSelection',
  InlineCheckout = 'InlineCheckout',
  ConfirmBillingInterval = 'ConfirmBillingInterval',
}

type State = {
  step: Step;
};

export const state: State = {
  step: Step.WorkspacePlanSelection,
};
