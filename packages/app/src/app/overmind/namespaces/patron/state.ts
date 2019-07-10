type State = {
  price: number;
  isUpdatingSubscription: boolean;
  tier: number;
  error: string;
};

export const state: State = {
  price: 10,
  error: null,
  isUpdatingSubscription: false,
  get tier(this: State) {
    const price = this.price;

    if (price >= 20) return 4;
    if (price >= 15) return 3;
    if (price >= 10) return 2;

    return 1;
  },
};
