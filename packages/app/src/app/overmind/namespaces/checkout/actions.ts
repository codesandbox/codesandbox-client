import { PricingPlan } from 'app/constants';
import type { Context } from 'app/overmind';
import {
  CreditAddon,
  CreditAddonType,
  SandboxAddon,
  SandboxAddonType,
} from './state';

export const selectPlan = ({ state, actions }: Context, plan: PricingPlan) => {
  actions.checkout.clearCheckout();
  state.checkout.basePlan = plan;
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

export const addSandboxPackage = (
  { state, actions }: Context,
  addon: SandboxAddon
) => {
  const addonInCheckoutAlready = state.checkout.sandboxAddons.find(
    item => item.addon.id === addon.id
  );

  if (addonInCheckoutAlready) {
    addonInCheckoutAlready.quantity++;
  } else {
    state.checkout.sandboxAddons.push({ addon, quantity: 1 });
  }

  actions.checkout.recomputeTotals();
};

export const removeSandboxPackage = (
  { state, actions }: Context,
  addonId: SandboxAddonType
) => {
  const addonItem = state.checkout.sandboxAddons.find(
    item => item.addon.id === addonId
  );

  if (!addonItem) {
    return;
  }

  addonItem.quantity--;

  if (addonItem.quantity === 0) {
    state.checkout.sandboxAddons = state.checkout.sandboxAddons.filter(
      item => item.addon.id !== addonId
    );
  }

  actions.checkout.recomputeTotals();
};

export const recomputeTotals = ({ state }: Context) => {
  if (!state.checkout.basePlan) {
    return;
  }

  const totalCreditAddonsPrice = state.checkout.creditAddons.reduce(
    (acc, item) => acc + item.addon.price * item.quantity,
    0
  );

  const totalSandboxAddonsPrice = state.checkout.sandboxAddons.reduce(
    (acc, item) => acc + item.addon.price * item.quantity,
    0
  );

  state.checkout.totalPrice =
    state.checkout.basePlan.price +
    totalCreditAddonsPrice +
    totalSandboxAddonsPrice;

  state.checkout.totalCredits =
    state.checkout.basePlan.credits +
    state.checkout.creditAddons.reduce(
      (acc, item) => acc + item.addon.credits * item.quantity,
      0
    );

  state.checkout.totalSandboxes =
    state.checkout.basePlan.sandboxes +
    state.checkout.sandboxAddons.reduce(
      (acc, item) => acc + item.addon.sandboxes * item.quantity,
      0
    );
};

export const clearCheckout = ({ state }: Context) => {
  state.checkout = {
    basePlan: null,
    creditAddons: [],
    sandboxAddons: [],
    totalPrice: 0,
    totalCredits: 0,
    totalSandboxes: 0,
    spendingLimit: 100,
    convertProToUBBCharge: null,
  };
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
    state.checkout.spendingLimit = 100; // Input value default will be used if mutation fails
  }
};

export const calculateConversionCharge = async (
  { state, effects, actions }: Context,
  { workspaceId }: { workspaceId: string }
) => {
  const { basePlan } = state.checkout;

  if (!basePlan) {
    return;
  }

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
  const { basePlan } = state.checkout;

  if (!basePlan) {
    return { success: false, error: 'No plan selected' };
  }

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
  const { creditAddons, sandboxAddons } = state.checkout;
  const addons: string[] = [];
  creditAddons.forEach(item => {
    for (let i = 0; i < item.quantity; i++) {
      addons.push(item.addon.id);
    }
  });
  sandboxAddons.forEach(item => {
    for (let i = 0; i < item.quantity; i++) {
      addons.push(item.addon.id);
    }
  });

  return addons;
};
