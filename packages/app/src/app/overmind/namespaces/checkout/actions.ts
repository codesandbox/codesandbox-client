import type { Context } from 'app/overmind';
import { AddonItem, CreditAddon, CreditAddonType, PlanType } from './types';
import { DEFAULT_SPENDING_LIMIT, PRO_PLAN_ANNUAL } from './constants';

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
  state.checkout.basePlan = {
    id: plan,
    name: state.checkout.availableBasePlans[plan].name,
    price: state.checkout.availableBasePlans[plan].price,
    credits: state.checkout.availableBasePlans[plan].credits,
  };

  actions.checkout.recomputeTotals();
};

export const initializeCartFromExistingSubscription = ({
  state,
  actions,
}: Context) => {
  if (!state.activeTeamInfo?.subscriptionSchedule?.current) {
    return;
  }

  const { items } = state.activeTeamInfo.subscriptionSchedule.current;
  const basePlanItem = items.find(i => i.name === 'flex');

  if (!basePlanItem) {
    return;
  }

  actions.checkout.clearCheckout();

  const standardPlan = state.checkout.availableBasePlans[basePlanItem.name];

  state.checkout.basePlan = {
    id: basePlanItem.name as PlanType,
    // price might be custom even if it's the base plan selected
    price: basePlanItem.unitAmount
      ? basePlanItem.unitAmount / 100
      : standardPlan.price,
    name: standardPlan.name,
    credits: standardPlan.credits, // credits are always the same for the base plan
  };

  items.forEach(item => {
    // Ignore all non-credit prefixed addons or addons with no quantity / unitAmount
    if (
      !item.name.startsWith('credits_') ||
      item.quantity === null ||
      item.unitAmount === null
    ) {
      return;
    }

    const standardAddon = state.checkout.availableCreditAddons[item.name];

    state.checkout.creditAddons.push({
      quantity: item.quantity,
      addon: {
        id: item.name as CreditAddonType,
        price: item.unitAmount / 100,
        credits: standardAddon.credits,
      },
    });

    // Duplicate the current subscription addons to compare them later
    state.checkout.currentSubscriptionAddons.push({
      quantity: item.quantity,
      addon: {
        id: item.name as CreditAddonType,
        price: item.unitAmount / 100,
        credits: standardAddon.credits,
      },
    });
  });

  actions.checkout.recomputeTotals();
  actions.checkout.recomputeAddonChanges();

  // Use the subscription limit for the total credits
  state.checkout.currentSubscriptionTotalCredits =
    state.activeTeamInfo.limits.includedCredits;

  // Use the current checkout data asa reference to compare changes at the end
  state.checkout.currentSubscriptionTotalPrice = state.checkout.totalPrice;
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
  actions.checkout.recomputeAddonChanges();
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
  actions.checkout.recomputeAddonChanges();
};

export const recomputeTotals = ({ state }: Context) => {
  const { basePlan, creditAddons } = state.checkout;

  const recurring = basePlan.id === 'flex-annual' ? 12 : 1;

  const totalCreditAddonsPrice = creditAddons.reduce(
    (acc, item) => acc + item.addon.price * item.quantity,
    0
  );

  state.checkout.totalPrice =
    (basePlan.price + totalCreditAddonsPrice) * recurring;

  state.checkout.totalCredits =
    basePlan.credits +
    creditAddons.reduce(
      (acc, item) => acc + item.addon.credits * item.quantity,
      0
    );
};

export const clearCheckout = ({ state, actions }: Context) => {
  // Reset to default (flex-anual)
  state.checkout.basePlan = {
    id: PRO_PLAN_ANNUAL.id,
    name: PRO_PLAN_ANNUAL.name,
    price: PRO_PLAN_ANNUAL.price,
    credits: PRO_PLAN_ANNUAL.credits,
  };
  state.checkout.creditAddons = [];
  state.checkout.totalPrice = 0;
  state.checkout.totalCredits = 0;
  state.checkout.spendingLimit = DEFAULT_SPENDING_LIMIT;
  state.checkout.convertProToUBBCharge = null;

  state.checkout.currentSubscriptionAddons = [];
  state.checkout.currentSubscriptionTotalCredits = 0;
  state.checkout.currentSubscriptionTotalPrice = 0;

  actions.checkout.recomputeTotals();
  actions.checkout.recomputeAddonChanges();
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
  const { basePlan } = state.checkout;

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

export const recomputeAddonChanges = ({ state }: Context): void => {
  const changes: Array<AddonItem> = [];

  const {
    creditAddons: newAddons,
    currentSubscriptionAddons: currentAddons,
  } = state.checkout;

  currentAddons.forEach(current => {
    const newAddon = newAddons.find(item => item.addon.id === current.addon.id);

    if (!newAddon) {
      changes.push({
        addon: current.addon,
        quantity: -current.quantity,
      });
    } else if (newAddon.quantity !== current.quantity) {
      changes.push({
        addon: current.addon,
        quantity: newAddon.quantity - current.quantity,
      });
    }
  });

  newAddons.forEach(newAddon => {
    if (!currentAddons.find(item => item.addon.id === newAddon.addon.id)) {
      changes.push({
        addon: newAddon.addon,
        quantity: newAddon.quantity,
      });
    }
  });

  state.checkout.addonChanges = changes;
};

export const updateSubscriptionAddons = async (
  { effects, actions }: Context,
  { workspaceId }: { workspaceId: string }
): Promise<{ success: boolean; error?: string }> => {
  try {
    await effects.gql.mutations.updateSubscriptionAddons({
      teamId: workspaceId,
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
