import { Action, AsyncAction } from 'app/overmind';

import { Step } from './state';

export const setStep: Action<Step> = ({ state }, step) => {
  state.pro.step = step;
};
