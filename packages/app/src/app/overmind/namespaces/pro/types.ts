export enum Step {
  WorkspacePlanSelection = 'WorkspacePlanSelection',
  ConfirmBillingInterval = 'ConfirmBillingInterval',
}

export type PaymentSummary = {
  unitPrice: number;
  unit: number;
  unitTax: number;
  totalTax: number;
  total: number;
  currency: string;
};

export type PaymentPreview = {
  immediatePayment: {
    amount: number;
    currency: string;
  };
  nextPayment: {
    amount: number;
    currency: string;
  };
};

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
