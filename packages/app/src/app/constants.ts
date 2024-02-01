export const DIALOG_TRANSITION_DURATION = 0.25;
export const DIALOG_WIDTH = 420;
export const REPLY_TRANSITION_DELAY = 0.5;
export const ORGANIZATION_CONTACT_LINK =
  'https://webforms.pipedrive.com/f/ckvSiEQynHckLBoq0wghZhoy9cQGYZrzaCwP7suEln3tMu5zgFKxY6sSZjTYLRC16X';

export const CSB_FRIENDS_LINK = 'https://codesandbox.typeform.com/friends';

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

export type PricingPlan = {
  id: PlanType;
  name: string;
  price: number;
  priceDiscountNote?: string;
  credits: number;
  creditsNote?: string;
  sandboxes: number;
  storage?: number;
  highestVM: VMType;
  features: string[];
  usage: string[];
};
export type ExplainedFeature = {
  text: string;
  tooltip: string;
};

export type PricingPlanFeatures = {
  id: PlanType;
  name: string;
  members: number;
  storage: string;
  sandboxes: string | number;
  devboxes: number;
  repositories: number;
  drafts: number;
  vmType: string;
  privateProject: boolean;
  shareableLinks: boolean;
  privateNPM: boolean;
  liveSessions: boolean;
  apiAccess: boolean;
  protectedPreviews: boolean;
  sso: boolean;
  privateCloud: boolean;
  onPremise: boolean;
  instantEnvironmentResume: boolean;
  instantEnvironmentShare: boolean;
};

export type PlanType = 'free' | 'flex' | 'enterprise';

export type VMType = 'vm-1' | 'vm-2' | 'vm-3' | 'vm-4' | 'vm-5' | 'vm-6';

export const EXPLAINED_FEATURES: Record<string, string> = {
  'VM credits':
    'Credits measure VM runtime and apply to Devboxes and Repositories.',
  Devboxes:
    'Devboxes are our Cloud Development Environment, which runs in virtual machines and requires VM credits.',
  Sandboxes:
    "Sandboxes are powered by your browser and don't require credits to run.",
  'personal drafts':
    'Personal drafts are Sandbox drafts that are not shareable or embeddable.',
};

export const UBB_FREE_PLAN: PricingPlan = {
  id: 'free',
  name: 'Free',
  price: 0,
  credits: 400,
  creditsNote: 'Ideal for hobbyists using Devboxes up to 40 hours a month.',
  sandboxes: 20,
  storage: 20,
  highestVM: 'vm-2',
  usage: [
    'Up to 40 hours worth of VM credits per month',
    '20 GB storage per VM',
    'VMs up to 4 vCPUs + 8 GB RAM',
    'Unlimited Devboxes and repositories',
    '20 Sandboxes',
    '10 personal drafts',
    '5 members',
  ],
  features: [
    'Private Sandboxes, Devboxes & repos',
    'Codeium AI code-completion',
    'Live collaboration',
    'VS Code extension',
    'Instant environment resume',
    'Instant environment share',
  ],
};

export const UBB_PRO_PLAN: PricingPlan = {
  id: 'flex',
  name: 'Pro',
  price: 9,
  priceDiscountNote: 'Early access discount',
  credits: 1000,
  creditsNote:
    'Ideal to get started with cloud development and understand your usage needs.',
  sandboxes: 100,
  storage: 50,
  highestVM: 'vm-4',
  features: ['All free features'],
  usage: [
    'Start from 100 hours worth of VM credits per month',
    '50 GB storage per VM',
    'VMs up to 16 vCPUs + 32 GB RAM',
    'Unlimited Devboxes and repositories',
    '100 Sandboxes',
    'Unlimited personal drafts',
    '20 members',
    'Access on-demand VM credits for $0.18 per hour',
  ],
};

export const UBB_ENTERPRISE_PLAN: PricingPlan = {
  id: 'enterprise',
  name: 'Enterprise',
  price: 0,
  credits: 0,
  sandboxes: 0,
  storage: 0,
  highestVM: 'vm-6',
  usage: [],
  features: [
    'Unlimited members',
    'Unlimited API',
    'VMs up to 64 vCPUs + 128 GB RAM',
    'On-premise options',
    'Private managed cloud',
    'Dedicated support',
    'SSO',
  ],
};

export const UBB_FREE_FEATURES: PricingPlanFeatures = {
  id: 'free',
  name: 'Free',
  members: 5,
  storage: '20 GB',
  sandboxes: 20,
  devboxes: Number.MAX_SAFE_INTEGER,
  repositories: Number.MAX_SAFE_INTEGER,
  drafts: 10,
  vmType: `4 vCPUs<br/>8 GB RAM`,
  privateProject: true,
  shareableLinks: true,
  privateNPM: false,
  liveSessions: true,
  apiAccess: true,
  protectedPreviews: false,
  sso: false,
  privateCloud: false,
  onPremise: false,
  instantEnvironmentResume: true,
  instantEnvironmentShare: true,
};

export const UBB_PRO_FEATURES: PricingPlanFeatures = {
  id: 'flex',
  name: 'Pro',
  members: 20,
  storage: `50 GB<br/>
  <small>more with add-ons</small>`,
  sandboxes: `100<br/>
  <small>more with add-ons</small>`,
  devboxes: Number.MAX_SAFE_INTEGER,
  repositories: Number.MAX_SAFE_INTEGER,
  drafts: Number.MAX_SAFE_INTEGER,
  vmType: `16 vCPUs<br />32 GB RAM`,
  privateProject: true,
  shareableLinks: true,
  privateNPM: false,
  liveSessions: true,
  apiAccess: true,
  protectedPreviews: false,
  sso: false,
  privateCloud: false,
  onPremise: false,
  instantEnvironmentResume: true,
  instantEnvironmentShare: true,
};

export const UBB_ENTERPRISE_FEATURES: PricingPlanFeatures = {
  id: 'enterprise',
  name: 'Enterprise',
  members: Number.MAX_SAFE_INTEGER,
  storage: 'Custom',
  sandboxes: 'Custom',
  devboxes: Number.MAX_SAFE_INTEGER,
  repositories: Number.MAX_SAFE_INTEGER,
  drafts: Number.MAX_SAFE_INTEGER,
  vmType: `64 vCPUs<br/>128 GB RAM`,
  privateProject: true,
  shareableLinks: true,
  privateNPM: true,
  liveSessions: true,
  apiAccess: true,
  protectedPreviews: true,
  sso: true,
  privateCloud: true,
  onPremise: true,
  instantEnvironmentResume: true,
  instantEnvironmentShare: true,
};

export const PRICING_PLANS: Record<PlanType, PricingPlan> = {
  free: UBB_FREE_PLAN,
  flex: UBB_PRO_PLAN,
  enterprise: UBB_ENTERPRISE_PLAN,
};
