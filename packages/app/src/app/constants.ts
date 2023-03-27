export const DIALOG_TRANSITION_DURATION = 0.25;
export const DIALOG_WIDTH = 420;
export const REPLY_TRANSITION_DELAY = 0.5;
export const SUBSCRIPTION_DOCS_URLS = {
  teams: {
    trial: '/docs/learn/plan-billing/trials',
    non_trial:
      '/docs/learn/introduction/workspace#managing-teams-and-subscriptions',
  },
};

export interface Feature {
  key: string;
  label: string;
  pill?: string;
  highlighted?: boolean;
}

export const PERSONAL_FREE_FEATURES: Feature[] = [
  {
    key: 'limit_sandboxes',
    label: 'Unlimited public sandboxes',
  },
  {
    key: 'limit_repositories',
    label: 'Unlimited public repositories',
  },
  { key: 'vm_mem', label: '2GB RAM' },
  { key: 'vm_cpu', label: '2 vCPUs' },
  { key: 'vm_disk', label: '6GB Disk' },
];

export const PERSONAL_FEATURES: Feature[] = [
  {
    key: 'limit_sandboxes',
    label: 'Unlimited private sandboxes',
  },
  {
    key: 'limit_repositories',
    label: 'Unlimited private repositories',
  },
  { key: 'npm', label: 'Public NPM packages' },
  { key: 'live_sessions', label: 'Live sessions' },
  { key: 'vm_mem', label: '6GB RAM' },
  { key: 'vm_cpu', label: '4vCPUs' },
  { key: 'vm_disk', label: '12GB Disk' },
];

export const PERSONAL_FEATURES_WITH_PILLS: Feature[] = [
  {
    key: 'limit_sandboxes',
    label: 'Unlimited private sandboxes',
  },
  {
    key: 'limit_repositories',
    label: 'Unlimited private repositories',
  },
  { key: 'npm', label: 'Public NPM packages' },
  { key: 'live_sessions', label: 'Live sessions' },
  // { key: 'vm_mem', label: '6GB RAM', pill: '3x capacity' },
  // { key: 'vm_cpu', label: '4vCPUs', pill: '2x faster' },
  // { key: 'vm_disk', label: '12GB Disk', pill: '2x storage' },
];

export const TEAM_FREE_FEATURES: Feature[] = [
  {
    key: 'limit_sandboxes',
    label: '20 public sandboxes',
  },
  {
    key: 'limit_repositories',
    label: '3 public repositories',
  },
  { key: 'npm', label: 'Public NPM packages' },
  { key: 'vm_mem', label: '2GB RAM' },
  { key: 'vm_cpu', label: '2vCPUs' },
  { key: 'vm_disk', label: '6GB Disk' },
];

export const TEAM_PRO_FEATURES: Feature[] = [
  {
    key: 'limit_sandboxes',
    label: 'Unlimited private sandboxes',
  },
  {
    key: 'limit_repositories',
    label: 'Unlimited private repositories',
  },
  { key: 'npm', label: 'Private NPM packages' },
  { key: 'live_sessions', label: 'Live sessions' },
  { key: 'vm_mem', label: '2GB RAM' },
  { key: 'vm_cpu', label: '2vCPUs' },
  { key: 'vm_disk', label: '6GB Disk' },
  // { key: 'vm_mem', label: '6GB RAM' },
  // { key: 'vm_cpu', label: '4vCPUs' },
  // { key: 'vm_disk', label: '12GB Disk' },
];

export const TEAM_PRO_FEATURES_WITH_PILLS: Feature[] = [
  {
    key: 'limit_sandboxes',
    label: 'Unlimited private sandboxes',
  },
  {
    key: 'limit_repositories',
    label: 'Unlimited private repositories',
  },
  { key: 'npm', label: 'Private NPM packages' },
  { key: 'live_sessions', label: 'Live sessions' },
  // { key: 'vm_mem', label: '6GB RAM', pill: '3x capacity' },
  // { key: 'vm_cpu', label: '4vCPUs', pill: '2x faster' },
  // { key: 'vm_disk', label: '12GB Disk', pill: '2x storage' },
];

export const ORG_FEATURES: Feature[] = [
  {
    key: 'limit_sandboxes',
    label: 'Unlimited private sandboxes',
  },
  {
    key: 'limit_repositories',
    label: 'Unlimited private repositories',
  },
  { key: 'npm', label: 'Private NPM packages' },
  { key: 'live_sessions', label: 'Live sessions' },
  { key: 'vm_mem', label: 'Custom VM Specs' },
  { key: 'vm_cpu', label: '+ Custom support and Slack channel' },
  { key: 'vm_disk', label: '+ Customer success manager' },
];

// Soft limit of maximum amount of pro
// editor a team can have. Above this,
// we should prompt CTAs to enable
// custom pricing.
export const MAX_PRO_EDITORS = 20;

export const TEAM_FREE_LIMITS = {
  editors: 5,
  public_sandboxes: 20,
  private_sandboxes: 0,
  public_repos: 3,
  private_repos: 0,
};
