import { SubscriptionInterval } from 'app/graphql/types';

export type VMType = 'vm-1' | 'vm-2' | 'vm-3' | 'vm-4' | 'vm-5' | 'vm-6';

export type PlanType = 'free' | 'flex' | 'builder' | 'enterprise';
export type CreditAddonType = 'credits_500' | 'credits_4000' | 'credits_24000';

export type PricingPlan = {
  id: PlanType;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  credits: number;
  storage?: number;
  features: string[];
  usage: string[];
};

export type CreditAddon = {
  id: CreditAddonType;
  credits: number;
  priceMonthly: number;
  priceYearly: number;
  fullPrice?: number;
  discount?: number;
};

export type SubscriptionPackage = {
  basePlan: { id: PlanType; name: string; price: number; credits: number };
  totalCredits: number;
  totalPrice: number;
  addonItems: AddonItem[];
  billingInterval: SubscriptionInterval;
};

export type AddonItem = {
  addon: { id: CreditAddonType; price: number; credits: number };
  quantity: number;
};
