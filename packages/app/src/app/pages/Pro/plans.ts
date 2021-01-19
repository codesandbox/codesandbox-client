import {
  WorkspaceSubscriptionTypes,
  SubscriptionBillingInterval,
} from 'app/graphql/types';

export type Plan = {
  id: string;
  name: string;
  type: WorkspaceSubscriptionTypes;
  billingInterval: SubscriptionBillingInterval;
  unit: number;
  multiplier: number;
  currency: string;
};

export const PADDLE_VENDOR_ID = 729;

export const plans: { [key: string]: Plan } = {
  PERSONAL_PRO_MONTHLY: {
    id: '7365',
    name: 'Personal Pro Workspace',
    type: WorkspaceSubscriptionTypes.Personal,
    unit: 12,
    multiplier: 1,
    billingInterval: SubscriptionBillingInterval.Monthly,
    currency: '$',
  },
  PERSONAL_PRO_ANNUAL: {
    id: '7399',
    name: 'Personal Pro Workspace',
    type: WorkspaceSubscriptionTypes.Personal,
    unit: 9,
    multiplier: 12,
    billingInterval: SubscriptionBillingInterval.Yearly,
    currency: '$',
  },
  TEAM_PRO_MONTHLY: {
    id: '7407',
    name: 'Team Pro Workspace',
    type: WorkspaceSubscriptionTypes.Team,
    unit: 30,
    multiplier: 1,
    billingInterval: SubscriptionBillingInterval.Monthly,
    currency: '$',
  },
  TEAM_PRO_ANNUAL: {
    id: '7399',
    name: 'Team Pro Workspace',
    type: WorkspaceSubscriptionTypes.Team,
    unit: 24,
    multiplier: 12,
    billingInterval: SubscriptionBillingInterval.Yearly,
    currency: '$',
  },
};
