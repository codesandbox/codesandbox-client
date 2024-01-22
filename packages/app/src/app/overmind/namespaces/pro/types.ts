export type Pricing = {
  individual: PricingOptions;
  team: PricingOptions;
};

type PricingOptions = {
  month: {
    [currency: string]: [PricingTierValue];
  };
  year: {
    [currency: string]: [PricingTierValue];
  };
};

type PricingTierValue = {
  unitAmount: number; // Raw value
  upTo: number | null; // Seats
};
