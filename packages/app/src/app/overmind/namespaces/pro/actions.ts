import { Action, AsyncAction } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';
import { Step, Plan, PaymentSummary } from './types';

export const pageMounted: AsyncAction = withLoadApp();

export const setStep: Action<Step> = ({ state }, step) => {
  state.pro.step = step;
};

export const updateSeats: Action<number> = ({ state }, seats) => {
  state.pro.seats = seats;
};

export const paddleInitialised: Action<number> = ({ state }) => {
  state.pro.isPaddleInitialised = true;
};

export const billingAmountLoaded: Action<number> = ({ state }) => {
  state.pro.isBillingAmountLoaded = true;
};

export const updateSelectedPlan: Action<Plan> = ({ state }, plan) => {
  state.pro.selectedPlan = plan;
};

export const getPriceSummary: AsyncAction = async ({ state, effects }) => {
  // const prices = await effects.gql.queries.getPriceSummary();
  // state.pro.summary = prices;
  // state.pro.isBillingAmountLoaded = true;
};

export const updateSummary: Action<PaymentSummary> = ({ state }, summary) => {
  state.pro.summary = summary;
};
