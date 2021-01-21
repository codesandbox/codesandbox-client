import { Action, AsyncAction } from 'app/overmind';
import { Step, Plan } from './types';

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
