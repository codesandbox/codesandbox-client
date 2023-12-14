export const DIALOG_TRANSITION_DURATION = 0.25;
export const DIALOG_WIDTH = 420;
export const REPLY_TRANSITION_DELAY = 0.5;
export const SUBSCRIPTION_DOCS_URLS = {
  teams: {
    trial: '/docs/learn/plans/trials',
    non_trial: '/docs/learn/plans/workspace#managing-teams-and-subscriptions',
  },
};
export const ORGANIZATION_CONTACT_LINK =
  'https://webforms.pipedrive.com/f/ckvSiEQynHckLBoq0wghZhoy9cQGYZrzaCwP7suEln3tMu5zgFKxY6sSZjTYLRC16X';

export interface Feature {
  key: string;
  label: string;
  pill?: string;
  highlighted?: boolean;
}

export const FREE_FEATURES: Feature[] = [
  {
    key: 'editor',
    label: 'Up to 5 editors',
  },
  {
    key: 'public_limit',
    label: 'Public repositories',
  },
  {
    key: 'public_boxes',
    label: 'Public devboxes and sandboxes',
  },
  { key: 'npm', label: 'Public npm packages' },
  { key: 'permissions', label: 'Limited permissions' },
  { key: 'vm_mem', label: '2GiB RAM' },
  { key: 'vm_cpu', label: '2 vCPUs' },
  { key: 'vm_disk', label: '6GB Disk' },
];

export const PRO_FEATURES: Feature[] = [
  {
    key: 'editors',
    label: 'Unlimited editors',
  },
  {
    key: 'repos',
    label: 'Unlimited private repositories',
  },
  {
    key: 'boxes',
    label: 'Unlimited private devboxes and sandboxes',
  },
  { key: 'npm', label: 'Private npm packages' },
  { key: 'live_sessions', label: 'Live sessions' },

  { key: 'vm_mem', label: '8GiB RAM' },
  { key: 'vm_cpu', label: '4 vCPUs' },
  { key: 'vm_disk', label: '12GB Disk' },
];

export const PRO_FEATURES_WITH_PILLS: Feature[] = [
  {
    key: 'editors',
    label: 'Unlimited editors',
  },
  {
    key: 'repos',
    label: 'Unlimited private repositories',
  },
  {
    key: 'boxes',
    label: 'Unlimited private devboxes and sandboxes',
  },
  { key: 'npm', label: 'Private npm packages' },
  { key: 'live_sessions', label: 'Live sessions' },

  { key: 'vm_mem', label: '8GiB RAM', pill: '4x capacity' },
  { key: 'vm_cpu', label: '4 vCPUs', pill: '2x faster' },
  { key: 'vm_disk', label: '12GB Disk', pill: '2x storage' },
];

export const ORG_FEATURES: Feature[] = [
  {
    key: 'intro',
    label: 'All Pro features, plus:',
  },
  { key: 'specs', label: 'Custom VM Specs' },
  { key: 'support', label: 'Custom support and Slack channel' },
  { key: 'customer', label: 'Customer success manager' },
];

// Soft limit of maximum amount of pro
// editor a team can have. Above this,
// we should prompt CTAs to enable
// custom pricing.
export const MAX_PRO_EDITORS = 20;

export const MAX_TEAM_FREE_EDITORS = 5;

export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  credits: number;
  additionalCreditsCost: number | null;
  users: number;
  sandboxes: { base: number; extra50SandboxesCost: number | null };
  devboxes: number;
  privateDevboxes: boolean;
  privateRepositories: boolean;
  highestVM: VMType;
  storage: { base: number; extra20GbCost: number };
  api: string;
};

export type PlanType = 'free' | 'flex' | 'standard' | 'growth';

export type VMType = 'nano' | 'micro' | 'small' | 'medium';

export const FEATURE_LABELS: Record<
  keyof Omit<PricingPlan, 'id' | 'name'>,
  string
> = {
  price: 'Monthly subscription cost',
  credits: 'Monthly credits included in subscription cost',
  additionalCreditsCost: 'Additional credits',
  users: 'Users',
  sandboxes: 'Sandboxes',
  devboxes: 'Devboxes',
  privateDevboxes: 'Private Devboxes',
  privateRepositories: 'Private repositories',
  highestVM: 'Virtual machines',
  storage: 'Storage space',
  api: 'API',
};

export const UBB_FREE_PLAN: PricingPlan = {
  id: 'free',
  name: 'Free',
  price: 0,
  credits: 400,
  additionalCreditsCost: null,
  users: 5,
  sandboxes: { base: 20, extra50SandboxesCost: null },
  devboxes: Number.MAX_SAFE_INTEGER,
  privateDevboxes: true,
  privateRepositories: true,
  highestVM: 'micro',
  storage: { base: 30, extra20GbCost: null },
  api: 'Free API',
};

export const UBB_FLEX_PLAN: PricingPlan = {
  id: 'flex',
  name: 'Flex',
  price: 9,
  credits: 500,
  additionalCreditsCost: 0.018,
  users: 20,
  sandboxes: { base: 50, extra50SandboxesCost: 9 },
  devboxes: Number.MAX_SAFE_INTEGER,
  privateDevboxes: true,
  privateRepositories: true,
  highestVM: 'medium',
  storage: { base: 30, extra20GbCost: 12 },
  api: 'Devbox API',
};

export const UBB_PRO_PLAN: PricingPlan = {
  id: 'pro',
  name: 'Pro',
  price: 18,
  credits: 1500,
  additionalCreditsCost: 0.018,
  users: 20,
  sandboxes: { base: 50, extra50SandboxesCost: 9 },
  devboxes: Number.MAX_SAFE_INTEGER,
  privateDevboxes: true,
  privateRepositories: true,
  highestVM: 'medium',
  storage: { base: 50, extra20GbCost: 12 },
  api: 'Devbox API',
};

export const UBB_GROWTH_PLAN: PricingPlan = {
  id: 'growth',
  name: 'Growth',
  price: 38,
  credits: 3000,
  additionalCreditsCost: 0.018,
  users: 20,
  sandboxes: { base: 100, extra50SandboxesCost: 9 },
  devboxes: Number.MAX_SAFE_INTEGER,
  privateDevboxes: true,
  privateRepositories: true,
  highestVM: 'medium',
  storage: { base: 50, extra20GbCost: 12 },
  api: 'Devbox API',
};

export const PRICING_PLANS = {
  free: UBB_FREE_PLAN,
  flex: UBB_FLEX_PLAN,
  standard: UBB_PRO_PLAN,
  growth: UBB_GROWTH_PLAN,
};
