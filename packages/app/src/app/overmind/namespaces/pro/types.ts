import {
  WorkspaceSubscriptionTypes,
  SubscriptionBillingInterval,
} from 'app/graphql/types';

export enum Step {
  WorkspacePlanSelection = 'WorkspacePlanSelection',
  InlineCheckout = 'InlineCheckout',
  ConfirmBillingInterval = 'ConfirmBillingInterval',
}

export type Plan = {
  id: string;
  name: string;
  type: WorkspaceSubscriptionTypes;
  billingInterval: SubscriptionBillingInterval;
  unit: number;
  multiplier: number;
  currency: string;
};

export type PaymentSummary = {
  unitPrice: string;
  unit: number;
  unitTax: number;
  totalTax: number;
  currency: number;
  total: number;
};
