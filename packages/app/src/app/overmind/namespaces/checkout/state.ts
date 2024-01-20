import { PricingPlan, UBB_PRO_PLAN } from 'app/constants';

export interface State {
  basePlan: PricingPlan | null;
  creditAddons: Array<{ addon: CreditAddon; quantity: number }>;
  sandboxAddons: Array<{ addon: SandboxAddon; quantity: number }>;
  spendingLimit: number;
  totalCredits: number;
  totalSandboxes: number;
  totalPrice: number;
}

export type Addon = CreditAddon | SandboxAddon;

export type CreditAddonType = 'credits_500' | 'credits_4000' | 'credits_24000';

export type CreditAddon = {
  type: 'credits';
  id: CreditAddonType;
  credits: number;
  price: number;
  fullPrice?: number;
  discount?: number;
};

export type SandboxAddonType =
  | 'sandboxes_100'
  | 'sandboxes_400'
  | 'sandboxes_1500';

export type SandboxAddon = {
  type: 'sandboxes';
  id: SandboxAddonType;
  sandboxes: number;
  price: number;
  fullPrice?: number;
  discount?: number;
};

export const state: State = {
  basePlan: null,
  creditAddons: [],
  sandboxAddons: [],
  spendingLimit: 100,
  totalCredits: 0,
  totalSandboxes: 0,
  totalPrice: 0,
};
