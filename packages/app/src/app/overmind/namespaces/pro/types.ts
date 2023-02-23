export enum Step {
  WorkspacePlanSelection = 'WorkspacePlanSelection',
  ConfirmBillingInterval = 'ConfirmBillingInterval',
}

export type LegacyPricing = Record<
  'pro' | 'teamPro',
  Record<'month' | 'year', { currency: string; unitAmount: number }>
>;

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
