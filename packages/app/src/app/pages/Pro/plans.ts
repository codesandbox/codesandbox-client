import {
  WorkspaceSubscriptionTypes,
  SubscriptionBillingInterval,
} from 'app/graphql/types';
import { Plan } from 'app/overmind/namespaces/pro/types';

export const PADDLE_VENDOR_ID = 729;

export const plans: { [key: string]: Plan } = {
  PERSONAL_PRO_MONTHLY: {
    id: '7365',
    name: 'Personal Pro',
    type: WorkspaceSubscriptionTypes.Personal,
    unit: 12,
    multiplier: 1,
    billingInterval: SubscriptionBillingInterval.Monthly,
    currency: '$',
  },
  PERSONAL_PRO_ANNUAL: {
    id: '7399',
    name: 'Personal Pro',
    type: WorkspaceSubscriptionTypes.Personal,
    unit: 9,
    multiplier: 12,
    billingInterval: SubscriptionBillingInterval.Yearly,
    currency: '$',
  },
  TEAM_PRO_MONTHLY: {
    id: '7407',
    name: 'Team Pro',
    type: WorkspaceSubscriptionTypes.Team,
    unit: 30,
    multiplier: 1,
    billingInterval: SubscriptionBillingInterval.Monthly,
    currency: '$',
  },
  TEAM_PRO_ANNUAL: {
    id: '7399',
    name: 'Team Pro',
    type: WorkspaceSubscriptionTypes.Team,
    unit: 24,
    multiplier: 12,
    billingInterval: SubscriptionBillingInterval.Yearly,
    currency: '$',
  },
};
