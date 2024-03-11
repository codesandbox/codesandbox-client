import { InvoicePreview } from 'app/graphql/types';
import { CreditAddon, CreditAddonType, PlanType, PricingPlan } from './types';
import {
  FREE_PLAN,
  PRO_PLAN,
  ENTERPRISE_PLAN,
  ADDON_CREDITS_500,
  ADDON_CREDITS_4000,
  ADDON_CREDITS_24000,
  DEFAULT_SPENDING_LIMIT,
} from './constants';

export interface State {
  selectedPlan: PlanType | null;
  creditAddons: Array<{ addon: CreditAddon; quantity: number }>;
  spendingLimit: number;
  totalCredits: number;
  totalPrice: number;
  convertProToUBBCharge: InvoicePreview | null;
  availableBasePlans: Record<PlanType, PricingPlan>;
  availableCreditAddons: Record<CreditAddonType, CreditAddon>;
}

export const state: State = {
  selectedPlan: null,
  creditAddons: [],
  spendingLimit: DEFAULT_SPENDING_LIMIT,
  totalCredits: 0,
  totalPrice: 0,
  convertProToUBBCharge: null,
  availableBasePlans: {
    free: FREE_PLAN,
    flex: PRO_PLAN,
    enterprise: ENTERPRISE_PLAN,
  },
  availableCreditAddons: {
    credits_500: ADDON_CREDITS_500,
    credits_4000: ADDON_CREDITS_4000,
    credits_24000: ADDON_CREDITS_24000,
  },
};
