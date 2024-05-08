import { PlanType } from 'app/overmind/namespaces/checkout/types';

export type PricingPlanFeatures = {
  id: PlanType;
  name: string;
  members: number;
  storage: string;
  publicSandboxes: string | number;
  privateSandboxes: string | number;
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

export const FREE_FEATURES: PricingPlanFeatures = {
  id: 'free',
  name: 'Free',
  members: 5,
  storage: '20 GB',
  publicSandboxes: 'Unlimited',
  privateSandboxes: 5,
  devboxes: Number.MAX_SAFE_INTEGER,
  repositories: Number.MAX_SAFE_INTEGER,
  drafts: Number.MAX_SAFE_INTEGER,
  vmType: `4 vCPUs<br/>8 GB RAM`,
  privateProject: true,
  shareableLinks: true,
  privateNPM: true,
  liveSessions: true,
  apiAccess: true,
  protectedPreviews: false,
  sso: false,
  privateCloud: false,
  onPremise: false,
  instantEnvironmentResume: true,
  instantEnvironmentShare: true,
};

export const PRO_FEATURES: PricingPlanFeatures = {
  id: 'flex',
  name: 'Pro',
  members: 20,
  storage: `50 GB<br/>
    <small>more with add-ons</small>`,
  publicSandboxes: Number.MAX_SAFE_INTEGER,
  privateSandboxes: Number.MAX_SAFE_INTEGER,
  devboxes: Number.MAX_SAFE_INTEGER,
  repositories: Number.MAX_SAFE_INTEGER,
  drafts: Number.MAX_SAFE_INTEGER,
  vmType: `16 vCPUs<br />32 GB RAM`,
  privateProject: true,
  shareableLinks: true,
  privateNPM: true,
  liveSessions: true,
  apiAccess: true,
  protectedPreviews: false,
  sso: false,
  privateCloud: false,
  onPremise: false,
  instantEnvironmentResume: true,
  instantEnvironmentShare: true,
};

export const ENTERPRISE_FEATURES: PricingPlanFeatures = {
  id: 'enterprise',
  name: 'Enterprise',
  members: Number.MAX_SAFE_INTEGER,
  storage: 'Custom',
  publicSandboxes: Number.MAX_SAFE_INTEGER,
  privateSandboxes: Number.MAX_SAFE_INTEGER,
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
