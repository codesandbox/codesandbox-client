import { Derive } from 'app/overmind';

type State = {
  price: number;
  isUpdatingSubscription: boolean;
  tier: Derive<State, number>;
  error: string;
};

export const state: State = {
  price: 10,
  error: null,
  isUpdatingSubscription: false,
  tier: state => {
    const price = state.price;

    if (price >= 20) return 4;
    if (price >= 15) return 3;
    if (price >= 10) return 2;

    return 1;
  },
};
