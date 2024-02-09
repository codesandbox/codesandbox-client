export type VMType = 'vm-1' | 'vm-2' | 'vm-3' | 'vm-4' | 'vm-5' | 'vm-6';

export type PlanType = 'free' | 'flex' | 'enterprise';
export type CreditAddonType = 'credits_500' | 'credits_4000' | 'credits_24000';
export type SandboxAddonType =
  | 'sandboxes_100'
  | 'sandboxes_400'
  | 'sandboxes_1500';

export type PricingPlan = {
  id: PlanType;
  name: string;
  price: number;
  priceDiscountNote?: string;
  credits: number;
  creditsNote?: string;
  sandboxes: number;
  storage?: number;
  features: string[];
  usage: string[];
};

export type CreditAddon = {
  type: 'credits';
  id: CreditAddonType;
  credits: number;
  price: number;
  fullPrice?: number;
  discount?: number;
};

export type SandboxAddon = {
  type: 'sandboxes';
  id: SandboxAddonType;
  sandboxes: number;
  price: number;
  fullPrice?: number;
  discount?: number;
};
