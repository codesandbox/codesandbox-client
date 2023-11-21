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

export const TEAM_PRO_FEATURES: Feature[] = [
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
  {
    key: 'ai',
    label: '✨ Full access to AI tools',
  },
  { key: 'npm', label: 'Private npm packages' },
  { key: 'live_sessions', label: 'Live sessions' },

  { key: 'vm_mem', label: '8GiB RAM' },
  { key: 'vm_cpu', label: '4 vCPUs' },
  { key: 'vm_disk', label: '12GB Disk' },
];

export const TEAM_PRO_FEATURES_WITH_PILLS: Feature[] = [
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
  {
    key: 'ai',
    label: '✨ Full access to AI tools',
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
