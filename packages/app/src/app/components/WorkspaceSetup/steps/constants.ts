import { PlanType } from 'app/overmind/namespaces/checkout/types';

export type PricingPlanFeatures = {
  id: PlanType;
  name: string;
  members: number;
  sandboxes: number;
  devboxes: number;
  concurrentDevboxes: number | 'Custom';
  sessionLength: number;
  repositories: number;
  vmType: string;
  sdk: boolean;
  privateProject: boolean;
  shareableLinks: boolean;
  privateNPM: boolean;
  liveSessions: boolean;
  apiAccess: boolean;
  protectedPreviews: boolean;
  sso: boolean;
  soc2: boolean;
  privateCloud: boolean;
  onPremise: boolean;
  instantEnvironmentResume: boolean;
  instantEnvironmentShare: boolean;
};

export const FREE_FEATURES: PricingPlanFeatures = {
  id: 'free',
  name: 'Build',
  members: 5,
  sandboxes: Number.MAX_SAFE_INTEGER,
  devboxes: Number.MAX_SAFE_INTEGER,
  concurrentDevboxes: 10,
  sessionLength: Number.MAX_SAFE_INTEGER,
  repositories: Number.MAX_SAFE_INTEGER,
  vmType: `4 vCPUs<br/>8 GB RAM`,
  sdk: true,
  privateProject: true,
  shareableLinks: true,
  privateNPM: true,
  liveSessions: true,
  apiAccess: true,
  protectedPreviews: false,
  sso: false,
  soc2: true,
  privateCloud: false,
  onPremise: false,
  instantEnvironmentResume: true,
  instantEnvironmentShare: true,
};

export const PRO_FEATURES: PricingPlanFeatures = {
  id: 'flex',
  name: 'Pro',
  members: 20,
  sandboxes: Number.MAX_SAFE_INTEGER,
  devboxes: Number.MAX_SAFE_INTEGER,
  concurrentDevboxes: 10,
  sessionLength: Number.MAX_SAFE_INTEGER,
  repositories: Number.MAX_SAFE_INTEGER,
  vmType: `16 vCPUs<br />32 GB RAM`,
  sdk: true,
  privateProject: true,
  shareableLinks: true,
  privateNPM: true,
  liveSessions: true,
  apiAccess: true,
  protectedPreviews: false,
  sso: false,
  soc2: true,
  privateCloud: false,
  onPremise: false,
  instantEnvironmentResume: true,
  instantEnvironmentShare: true,
};

export const BUILDER_FEATURES: PricingPlanFeatures = {
  id: 'builder',
  name: 'Scale',
  members: 20,
  sandboxes: Number.MAX_SAFE_INTEGER,
  devboxes: Number.MAX_SAFE_INTEGER,
  concurrentDevboxes: 250,
  sessionLength: Number.MAX_SAFE_INTEGER,
  repositories: Number.MAX_SAFE_INTEGER,
  vmType: `16 vCPUs<br />32 GB RAM`,
  sdk: true,
  privateProject: true,
  shareableLinks: true,
  privateNPM: true,
  liveSessions: true,
  apiAccess: true,
  protectedPreviews: false,
  sso: false,
  soc2: true,
  privateCloud: false,
  onPremise: false,
  instantEnvironmentResume: true,
  instantEnvironmentShare: true,
};

export const ENTERPRISE_FEATURES: PricingPlanFeatures = {
  id: 'enterprise',
  name: 'Enterprise',
  members: Number.MAX_SAFE_INTEGER,
  sandboxes: Number.MAX_SAFE_INTEGER,
  devboxes: Number.MAX_SAFE_INTEGER,
  concurrentDevboxes: 'Custom',
  sessionLength: Number.MAX_SAFE_INTEGER,
  repositories: Number.MAX_SAFE_INTEGER,
  vmType: `64 vCPUs<br/>128 GB RAM`,
  sdk: true,
  privateProject: true,
  shareableLinks: true,
  privateNPM: true,
  liveSessions: true,
  apiAccess: true,
  protectedPreviews: true,
  sso: true,
  soc2: true,
  privateCloud: true,
  onPremise: true,
  instantEnvironmentResume: true,
  instantEnvironmentShare: true,
};
