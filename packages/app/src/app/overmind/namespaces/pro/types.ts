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

type PricingOptions = {
  month: {
    [key: string]: number;
  };
  year: {
    [key: string]: number;
  };
};

export type Pricing = {
  individual: PricingOptions;
  team: PricingOptions;
};
