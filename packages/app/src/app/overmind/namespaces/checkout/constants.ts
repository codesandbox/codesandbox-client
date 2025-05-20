import { PricingPlan, CreditAddon } from './types';

// All values below are the base hardcoded values
// They get updated with the results from /api/pricing

export const FREE_PLAN: PricingPlan = {
  id: 'free',
  name: 'Build',
  priceMonthly: 0,
  priceYearly: 0,
  credits: 400,
  storage: 20,
  usage: [
    'Up to 40 hours of monthly VM credits',
    'Unlimited Sandboxes & Devboxes',
    '5 members',
  ],
  features: [
    'CodeSandbox SDK lite',
    'Private Sandboxes, Devboxes & repos',
    'VMs up to 4 vCPUs + 8 GiB RAM',
    'VS Code extension',
  ],
};

export const PRO_PLAN: PricingPlan = {
  id: 'flex',
  name: 'Pro',
  priceMonthly: 12,
  priceYearly: 9,
  credits: 1000,
  storage: 50,
  features: ['All Build features', 'VMs up to 16 vCPUs + 32 GiB RAM'],
  usage: [
    'Start from 100 hours of monthly VM credits',
    'Unlimited Sandboxes & Devboxes',
    '20 members',
    '10 concurrent VMs',
    'Access on-demand VM credits for $0.15 per hour',
  ],
};

export const BUILDER_PLAN: PricingPlan = {
  id: 'builder',
  name: 'Scale',
  priceMonthly: 170,
  priceYearly: 119,
  credits: 1600,
  storage: 50,
  features: ['All Pro features', 'CodeSandbox SDK', 'More VM tiers'],
  usage: [
    'Start from 160 hours of monthly VM credits',
    'Unlimited Sandboxes & Devboxes',
    '20 members',
    '250 concurrent VMs',
    'Access on-demand VM credits for $0.15 per hour',
  ],
};

export const ENTERPRISE_PLAN: PricingPlan = {
  id: 'enterprise',
  name: 'Enterprise',
  priceMonthly: 0,
  priceYearly: 0,
  credits: 0,
  storage: 0,
  usage: [],
  features: [
    'Bulk VM credit packs up to 50% off',
    'Unlimited members',
    'VMs up to 64 vCPUs + 128 GiB RAM',
    'On-premise options',
    'Private managed cloud',
    'Dedicated support',
    'SOC 2 Type II compliant',
    'SSO',
  ],
};

export const ADDON_CREDITS_500: CreditAddon = {
  id: 'credits_500',
  credits: 500,
  priceMonthly: 9,
  priceYearly: 108,
};

export const ADDON_CREDITS_4000: CreditAddon = {
  id: 'credits_4000',
  credits: 4000,
  priceMonthly: 50,
  priceYearly: 600,
  fullPrice: 72,
  discount: 30,
};

export const ADDON_CREDITS_24000: CreditAddon = {
  id: 'credits_24000',
  credits: 24000,
  priceMonthly: 216,
  priceYearly: 2592,
  fullPrice: 432,
  discount: 50,
};

export const DEFAULT_SPENDING_LIMIT = 0;
