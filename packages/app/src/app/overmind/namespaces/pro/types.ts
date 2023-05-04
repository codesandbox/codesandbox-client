import { SubscriptionType, SubscriptionInterval } from 'app/graphql/types';

export enum Step {
  WorkspacePlanSelection = 'WorkspacePlanSelection',
  InlineCheckout = 'InlineCheckout',
  ConfirmBillingInterval = 'ConfirmBillingInterval',
}

export type Pricing = Record<
  'pro' | 'teamPro',
  Record<'month' | 'year', { currency: string; unitAmount: number }>
>;

export type Plan = {
  id: string;
  name: string;
  type: SubscriptionType;
  billingInterval: SubscriptionInterval;
  unit: number;
  multiplier: number;
  currency: string;
};

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
