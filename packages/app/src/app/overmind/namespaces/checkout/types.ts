export type VMType = 'vm-1' | 'vm-2' | 'vm-3' | 'vm-4' | 'vm-5' | 'vm-6';

export type PlanType = 'free' | 'flex' | 'flex-annual' | 'enterprise';
export type CreditAddonType = 'credits_500' | 'credits_4000' | 'credits_24000';

export type PricingPlan = {
  id: PlanType;
  name: string;
  price: number;
  credits: number;
  recurringTypeDescription?: string;
  creditsNote?: string;
  storage?: number;
  features: string[];
  usage: string[];
};

export type SubscriptionPackage = {
  basePlan: { id: PlanType; name: string; price: number; credits: number };
  totalCredits: number;
  totalPrice: number;
  addonItems: AddonItem[];
};

export type CreditAddon = {
  id: CreditAddonType;
  credits: number;
  price: number;
  fullPrice?: number;
  discount?: number;
};

export type AddonItem = { addon: CreditAddon; quantity: number };
