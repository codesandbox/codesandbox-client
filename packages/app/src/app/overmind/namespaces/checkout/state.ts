import { InvoicePreview } from 'app/graphql/types';
import {
  AddonItem,
  CreditAddon,
  CreditAddonType,
  PlanType,
  PricingPlan,
  SubscriptionPackage,
} from './types';
import {
  FREE_PLAN,
  PRO_PLAN,
  BUILDER_PLAN,
  ENTERPRISE_PLAN,
  ADDON_CREDITS_500,
  ADDON_CREDITS_4000,
  ADDON_CREDITS_24000,
  DEFAULT_SPENDING_LIMIT,
} from './constants';

export interface State {
  spendingLimit: number;
  newSubscription: SubscriptionPackage | null;
  currentSubscription: SubscriptionPackage | null;
  hasUpcomingChange: boolean;
  addonChanges: Array<AddonItem>;
  convertLegacyPlanToUBBCharge: Omit<InvoicePreview, 'updateMoment'> | null;
  convertPlanCharge: InvoicePreview | null;
  availableBasePlans: Record<PlanType, PricingPlan>;
  availableCreditAddons: Record<CreditAddonType, CreditAddon>;
}

export const state: State = {
  spendingLimit: DEFAULT_SPENDING_LIMIT,

  newSubscription: null,
  currentSubscription: null,
  hasUpcomingChange: false,

  addonChanges: [], // Recomputed everytime an addon is changed

  convertLegacyPlanToUBBCharge: null,
  convertPlanCharge: null,
  availableBasePlans: {
    free: FREE_PLAN,
    flex: PRO_PLAN,
    builder: BUILDER_PLAN,
    enterprise: ENTERPRISE_PLAN,
  },
  availableCreditAddons: {
    credits_500: ADDON_CREDITS_500,
    credits_4000: ADDON_CREDITS_4000,
    credits_24000: ADDON_CREDITS_24000,
  },
};
