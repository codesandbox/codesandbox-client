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

export const FREE_FEATURES: Feature[] = [
  {
    key: 'public_limit',
    label: 'Public repositories and sandboxes',
  },
  { key: 'vm_mem', label: '2GiB RAM' },
  { key: 'vm_cpu', label: '2 vCPUs' },
  { key: 'vm_disk', label: '6GB Disk' },
];

export const PERSONAL_PRO_FEATURES: Feature[] = [
  {
    key: 'limit_sandboxes',
    label: 'Private repositories and sandboxes',
  },
  { key: 'npm', label: 'Public NPM packages' },
  {
    key: 'ai',
    label: '✨ Full access to AI tools',
  },
  {
    key: 'editor',
    label: 'Single editor',
  },
  { key: 'live_sessions', label: 'Live sessions' },
  { key: 'vm_mem', label: '8GiB RAM' },
  { key: 'vm_cpu', label: '4vCPUs' },
  { key: 'vm_disk', label: '12GB Disk' },
];

export const TEAM_PRO_FEATURES: Feature[] = [
  {
    key: 'private',
    label: 'Private repositories and sandboxes',
  },
  { key: 'npm', label: 'Private npm packages' },
  {
    key: 'ai',
    label: '✨ Full access to AI tools',
  },
  {
    key: 'editors',
    label: 'Unlimited editors',
  },
  { key: 'live_sessions', label: 'Live sessions' },

  { key: 'vm_mem', label: '8GiB RAM' },
  { key: 'vm_cpu', label: '4vCPUs' },
  { key: 'vm_disk', label: '12GB Disk' },
];

export const TEAM_PRO_FEATURES_WITH_PILLS: Feature[] = [
  {
    key: 'private',
    label: 'Private repositories and sandboxes',
  },
  { key: 'npm', label: 'Private npm packages' },
  {
    key: 'ai',
    label: '✨ Full access to AI tools',
  },
  {
    key: 'editors',
    label: 'Unlimited editors',
  },
  { key: 'live_sessions', label: 'Live sessions' },

  { key: 'vm_mem', label: '8GiB RAM', pill: '4x capacity' },
  { key: 'vm_cpu', label: '4vCPUs', pill: '2x faster' },
  { key: 'vm_disk', label: '12GB Disk', pill: '2x storage' },
];

export const ORG_FEATURES: Feature[] = [
  {
    key: 'private',
    label: 'Private repositories and sandboxes',
  },
  { key: 'npm', label: 'Private npm packages' },
  {
    key: 'ai',
    label: '✨ Full access to AI tools',
  },
  {
    key: 'editors',
    label: 'Unlimited editors',
  },
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

export const MAX_TEAM_FREE_EDITORS = 5;
