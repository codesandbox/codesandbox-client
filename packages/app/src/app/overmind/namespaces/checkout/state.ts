import { InvoicePreview } from 'app/graphql/types';
import {
  AddonItem,
  CreditAddon,
  CreditAddonType,
  PlanType,
  PricingPlan,
} from './types';
import {
  FREE_PLAN,
  PRO_PLAN,
  PRO_PLAN_ANNUAL,
  ENTERPRISE_PLAN,
  ADDON_CREDITS_500,
  ADDON_CREDITS_4000,
  ADDON_CREDITS_24000,
  DEFAULT_SPENDING_LIMIT,
} from './constants';

export interface State {
  basePlan: { id: PlanType; name: string; price: number; credits: number };
  creditAddons: Array<AddonItem>;
  spendingLimit: number;
  totalCredits: number;
  totalPrice: number;
  currentSubscriptionTotalCredits: number;
  currentSubscriptionTotalPrice: number;
  currentSubscriptionAddons: Array<AddonItem>;
  addonChanges: Array<AddonItem>;
  convertProToUBBCharge: InvoicePreview | null;
  availableBasePlans: Record<PlanType, PricingPlan>;
  availableCreditAddons: Record<CreditAddonType, CreditAddon>;
}

export const state: State = {
  basePlan: {
    id: PRO_PLAN_ANNUAL.id,
    name: PRO_PLAN_ANNUAL.name,
    price: PRO_PLAN_ANNUAL.price,
    credits: PRO_PLAN_ANNUAL.credits,
  },
  creditAddons: [],
  spendingLimit: DEFAULT_SPENDING_LIMIT,
  totalCredits: 0,
  totalPrice: 0,
  currentSubscriptionTotalCredits: 0, // Used only for existing UBB Pro when managing addons
  currentSubscriptionTotalPrice: 0, // Used only for existing UBB Pro when managing addons
  currentSubscriptionAddons: [], // Used only for existing UBB Pro when managing addons, to compare addons
  addonChanges: [], // Recomputed everytime an addon is changed
  convertProToUBBCharge: null,
  availableBasePlans: {
    free: FREE_PLAN,
    flex: PRO_PLAN,
    'flex-annual': PRO_PLAN_ANNUAL,
    enterprise: ENTERPRISE_PLAN,
  },
  availableCreditAddons: {
    credits_500: ADDON_CREDITS_500,
    credits_4000: ADDON_CREDITS_4000,
    credits_24000: ADDON_CREDITS_24000,
  },
};
