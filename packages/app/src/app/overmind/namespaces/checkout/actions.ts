import type { Context } from 'app/overmind';
import { CreditAddon, CreditAddonType, PlanType } from './types';
import { DEFAULT_SPENDING_LIMIT } from './constants';

export const fetchPrices = async ({ state, effects }: Context) => {
  try {
    const result = await effects.api.getPrices('2024-02-01');

    const proPricing = result.base.flex;
    const proAddons = result.addons;

    state.checkout.availableBasePlans.flex = {
      ...state.checkout.availableBasePlans.flex,
      credits: proPricing.credits,
      price: proPricing.cost_month / 100,
      storage: proPricing.storage,
    };

    Object.values(state.checkout.availableCreditAddons).forEach(creditAddon => {
      creditAddon.price = proAddons[creditAddon.id].cost_month / 100;
      creditAddon.credits = proAddons[creditAddon.id].credits;
    });
  } catch {
    // Silent fail as client values can be used as defaults
  }
};

export const selectPlan = ({ state, actions }: Context, plan: PlanType) => {
  actions.checkout.clearCheckout();
  state.checkout.selectedPlan = plan;
  actions.checkout.recomputeTotals();
};

export const addCreditsPackage = (
  { state, actions }: Context,
  addon: CreditAddon
) => {
  const addonInCheckoutAlready = state.checkout.creditAddons.find(
    item => item.addon.id === addon.id
  );

  if (addonInCheckoutAlready) {
    addonInCheckoutAlready.quantity++;
  } else {
    state.checkout.creditAddons.push({ addon, quantity: 1 });
  }

  actions.checkout.recomputeTotals();
};

export const removeCreditsPackage = (
  { state, actions }: Context,
  addonId: CreditAddonType
) => {
  const addonItem = state.checkout.creditAddons.find(
    item => item.addon.id === addonId
  );

  if (!addonItem) {
    return;
  }

  addonItem.quantity--;

  if (addonItem.quantity === 0) {
    state.checkout.creditAddons = state.checkout.creditAddons.filter(
      item => item.addon.id !== addonId
    );
  }

  actions.checkout.recomputeTotals();
};

export const recomputeTotals = ({ state }: Context) => {
  if (!state.checkout.selectedPlan) {
    return;
  }

  const { availableBasePlans, selectedPlan, creditAddons } = state.checkout;

  const basePlan = availableBasePlans[selectedPlan];

  const totalCreditAddonsPrice = creditAddons.reduce(
    (acc, item) => acc + item.addon.price * item.quantity,
    0
  );

  state.checkout.totalPrice = basePlan.price + totalCreditAddonsPrice;

  state.checkout.totalCredits =
    basePlan.credits +
    creditAddons.reduce(
      (acc, item) => acc + item.addon.credits * item.quantity,
      0
    );
};

export const clearCheckout = ({ state }: Context) => {
  state.checkout.selectedPlan = null;
  state.checkout.creditAddons = [];
  state.checkout.totalPrice = 0;
  state.checkout.totalCredits = 0;
  state.checkout.spendingLimit = DEFAULT_SPENDING_LIMIT;
  state.checkout.convertProToUBBCharge = null;
};

export const setSpendingLimit = async (
  { state, effects }: Context,
  { workspaceId, spendingLimit }: { workspaceId: string; spendingLimit: number }
) => {
  state.checkout.spendingLimit = spendingLimit;

  try {
    await effects.gql.mutations.setTeamLimits({
      teamId: workspaceId,
      onDemandSpendingLimit: spendingLimit,
    });
  } catch (e) {
    state.checkout.spendingLimit = DEFAULT_SPENDING_LIMIT; // Input value default will be used if mutation fails
  }
};

export const calculateConversionCharge = async (
  { state, effects, actions }: Context,
  { workspaceId }: { workspaceId: string }
) => {
  const { selectedPlan } = state.checkout;

  if (!selectedPlan) {
    return;
  }

  const basePlan = state.checkout.availableBasePlans[selectedPlan];

  try {
    const result = await effects.gql.mutations.previewConvertToUsageBilling({
      teamId: workspaceId,
      plan: basePlan.id,
      addons: actions.checkout.getFlatAddonsList(),
    });

    // Cap the values to a min of 0
    state.checkout.convertProToUBBCharge = {
      total: Math.max(
        (result.previewConvertToUsageBilling?.total ?? 0) / 100,
        0
      ),
      totalExcludingTax: Math.max(
        (result.previewConvertToUsageBilling?.totalExcludingTax ?? 0) / 100,
        0
      ),
    };
  } catch (e) {
    state.checkout.convertProToUBBCharge = null;
  }
};

export const convertToUsageBilling = async (
  { state, effects, actions }: Context,
  { workspaceId }: { workspaceId: string }
): Promise<{ success: boolean; error?: string }> => {
  const { selectedPlan } = state.checkout;

  if (!selectedPlan) {
    return { success: false, error: 'No plan selected' };
  }

  const basePlan = state.checkout.availableBasePlans[selectedPlan];

  try {
    await effects.gql.mutations.convertToUsageBilling({
      teamId: workspaceId,
      plan: basePlan.id,
      addons: actions.checkout.getFlatAddonsList(),
    });

    return { success: true };
  } catch (e) {
    if (e.response && e.response.errors) {
      return { success: false, error: e.response.errors[0].message };
    }
    return {
      success: false,
      error: 'Unexpected error. Please try again later',
    };
  }
};

export const getFlatAddonsList = ({ state }: Context): string[] => {
  const { creditAddons } = state.checkout;
  const addons: string[] = [];
  creditAddons.forEach(item => {
    for (let i = 0; i < item.quantity; i++) {
      addons.push(item.addon.id);
    }
  });

  return addons;
};

export const setRecurringType = (
  { state }: Context,
  recurringType: Context['state']['checkout']['recurringType']
) => {
  state.checkout.recurringType = recurringType;
};
