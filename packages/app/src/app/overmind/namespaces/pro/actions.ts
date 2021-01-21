import { Action, AsyncAction } from 'app/overmind';

import { Step } from './state';

export const setStep: Action<Step> = ({ state }, step) => {
  state.pro.step = step;
};

export const updateSeats: Action<number> = ({ state }, seats) => {
  state.pro.seats = seats;
};

export const paddleInitialised: Action<number> = ({ state }, seats) => {
  state.pro.isPaddleInitialised = true;
};

export const billingAmountLoaded: Action<number> = ({ state }, seats) => {
  state.pro.isBillingAmountLoaded = true;
};
