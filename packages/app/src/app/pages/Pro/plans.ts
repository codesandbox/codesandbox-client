import { SubscriptionType, SubscriptionInterval } from 'app/graphql/types';
import { Plan } from 'app/overmind/namespaces/pro/types';

export const PADDLE_VENDOR_ID = 35719;

export const plans: { [key: string]: Plan } = {
  PERSONAL_PRO_MONTHLY: {
    id: '643994',
    name: 'Personal Pro',
    type: SubscriptionType.PersonalPro,
    unit: 9,
    multiplier: 1,
    billingInterval: SubscriptionInterval.Monthly,
    currency: '$',
  },
  PERSONAL_PRO_ANNUAL: {
    id: '643996',
    name: 'Personal Pro',
    type: SubscriptionType.PersonalPro,
    unit: 7,
    multiplier: 12,
    billingInterval: SubscriptionInterval.Yearly,
    currency: '$',
  },
  TEAM_PRO_MONTHLY: {
    id: '544191',
    name: 'Team Pro',
    type: SubscriptionType.TeamPro,
    unit: 30,
    multiplier: 1,
    billingInterval: SubscriptionInterval.Monthly,
    currency: '$',
  },
  TEAM_PRO_ANNUAL: {
    id: '544190',
    name: 'Team Pro',
    type: SubscriptionType.TeamPro,
    unit: 24,
    multiplier: 12,
    billingInterval: SubscriptionInterval.Yearly,
    currency: '$',
  },
};
