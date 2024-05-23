import { PricingPlan, CreditAddon } from './types';

// All values below are the base hardcoded values
// They get updated with the results from /api/pricing

export const FREE_PLAN: PricingPlan = {
  id: 'free',
  name: 'Free',
  priceMonthly: 0,
  priceYearly: 0,
  credits: 400,
  creditsNote: 'Ideal for hobbyists using Devboxes up to 40 hours a month.',
  storage: 20,
  usage: [
    'Up to 40 hours worth of VM credits per month',
    'VMs up to 4 vCPUs + 8 GiB RAM',
    '5 private Sandboxes',
    'Unlimited public Sandboxes',
    'Unlimited personal drafts',
    'Unlimited Devboxes and repositories',
    '5 members',
  ],
  features: [
    'Private Sandboxes, Devboxes & repos',
    '100 Codeium AI code completions',
    'Live collaboration',
    'VS Code extension',
    'Instant environment resume',
    'Instant environment share',
  ],
};

export const PRO_PLAN: PricingPlan = {
  id: 'flex',
  name: 'Pro',
  priceMonthly: 12,
  priceYearly: 9,
  credits: 1000,
  creditsNote:
    'Ideal to get started with cloud development and understand your usage needs.',
  storage: 50,
  features: ['All free features', 'Unlimited Codeium AI code completions'],
  usage: [
    'Start from 100 hours worth of VM credits per month',
    '50 GB storage per VM',
    'VMs up to 16 vCPUs + 32 GB RAM',
    'Unlimited public Sandboxes',
    'Unlimited private Sandboxes',
    'Unlimited personal drafts',
    'Unlimited Devboxes and repositories',
    '20 members',
    'Access on-demand VM credits for $0.18 per hour',
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
    'Unlimited members',
    'Unlimited API',
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
