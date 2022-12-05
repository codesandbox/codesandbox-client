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
