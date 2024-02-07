import { InvoicePreview } from 'app/graphql/types';
import {
  CreditAddon,
  CreditAddonType,
  PlanType,
  PricingPlan,
  SandboxAddon,
  SandboxAddonType,
} from './types';
import {
  FREE_PLAN,
  PRO_PLAN,
  ENTERPRISE_PLAN,
  ADDON_CREDITS_500,
  ADDON_CREDITS_4000,
  ADDON_CREDITS_24000,
  ADDON_SANDBOXES_100,
  ADDON_SANDBOXES_400,
  ADDON_SANDBOXES_1500,
} from './constants';

export interface State {
  selectedPlan: PlanType | null;
  creditAddons: Array<{ addon: CreditAddon; quantity: number }>;
  sandboxAddons: Array<{ addon: SandboxAddon; quantity: number }>;
  spendingLimit: number;
  totalCredits: number;
  totalSandboxes: number;
  totalPrice: number;
  convertProToUBBCharge: InvoicePreview | null;
  availableBasePlans: Record<PlanType, PricingPlan>;
  availableCreditAddons: Record<CreditAddonType, CreditAddon>;
  availableSandboxAddons: Record<SandboxAddonType, SandboxAddon>;
}

export const state: State = {
  selectedPlan: null,
  creditAddons: [],
  sandboxAddons: [],
  spendingLimit: 100,
  totalCredits: 0,
  totalSandboxes: 0,
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
  availableSandboxAddons: {
    sandboxes_100: ADDON_SANDBOXES_100,
    sandboxes_400: ADDON_SANDBOXES_400,
    sandboxes_1500: ADDON_SANDBOXES_1500,
  },
};
