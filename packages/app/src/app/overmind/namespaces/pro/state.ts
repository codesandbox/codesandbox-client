import { Pricing } from './types';

type State = {
  prices: Pricing | null;
};

export const state: State = {
  prices: null,
};
