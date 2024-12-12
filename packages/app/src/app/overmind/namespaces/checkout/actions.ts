import type { Context } from 'app/overmind';
import { SubscriptionInterval } from 'app/graphql/types';
import {
  AddonItem,
  CreditAddonType,
  PlanType,
  PricingPlan,
  SubscriptionPackage,
} from './types';
import { DEFAULT_SPENDING_LIMIT } from './constants';

export const fetchPrices = async ({ state, effects }: Context) => {
  try {
    const result = await effects.api.getPrices('2024-12-09');

    const proPricing = result.base.flex;
    const builderPricing = result.base.builder;

    // Deprecated
    const proAddons = result.addons;

    state.checkout.availableBasePlans.flex = {
      ...state.checkout.availableBasePlans.flex,
      credits: proPricing.credits,
      priceMonthly: proPricing.cost_month / 100,
      priceYearly: proPricing.cost_year / 100,
      storage: proPricing.storage,
    };

    state.checkout.availableBasePlans.builder = {
      ...state.checkout.availableBasePlans.builder,
      credits: builderPricing.credits,
      priceMonthly: builderPricing.cost_month / 100,
      priceYearly: builderPricing.cost_year / 100,
      storage: builderPricing.storage,
    };

    Object.values(state.checkout.availableCreditAddons).forEach(creditAddon => {
      creditAddon.priceMonthly = proAddons[creditAddon.id].cost_month / 100;
      creditAddon.priceYearly = proAddons[creditAddon.id].cost_year / 100;
      creditAddon.credits = proAddons[creditAddon.id].credits;
    });
  } catch {
    // Silent fail as client values can be used as defaults
  }
};

export const selectPlan = (
  { state, actions }: Context,
  {
    plan,
    billingInterval,
  }: { plan: PlanType; billingInterval: SubscriptionInterval }
) => {
  const availableBasePlan = state.checkout.availableBasePlans[plan];

  if (!state.checkout.newSubscription) {
    state.checkout.newSubscription = {
      basePlan: {
        id: plan,
        name: availableBasePlan.name,
        price:
          billingInterval === SubscriptionInterval.Monthly
            ? availableBasePlan.priceMonthly
            : availableBasePlan.priceYearly,
        credits: availableBasePlan.credits,
      },
      billingInterval,
      totalCredits: 0,
      totalPrice: 0,
      addonItems: [],
    };
  } else {
    state.checkout.newSubscription.billingInterval = billingInterval;
    state.checkout.newSubscription.basePlan = {
      id: plan,
      name: availableBasePlan.name,
      price:
        billingInterval === SubscriptionInterval.Monthly
          ? availableBasePlan.priceMonthly
          : availableBasePlan.priceYearly / 12,
      credits: availableBasePlan.credits,
    };

    state.checkout.newSubscription.addonItems.forEach(item => {
      const baseAddon = state.checkout.availableCreditAddons[item.addon.id];
      item.addon.price =
        billingInterval === SubscriptionInterval.Monthly
          ? baseAddon.priceMonthly
          : baseAddon.priceYearly / 12;
    });
  }

  actions.checkout.recomputeTotals();
};

export const initializeCartFromExistingSubscription = ({
  state,
  actions,
}: Context) => {
  let currentSubscription: SubscriptionPackage | null = null;
  let upcomingSubscription: SubscriptionPackage | null = null;
  const billingInterval =
    state.activeTeamInfo?.subscriptionSchedule?.billingInterval ||
    SubscriptionInterval.Monthly;
  const billingFactor =
    billingInterval === SubscriptionInterval.Monthly ? 1 : 12;

  if (state.activeTeamInfo?.subscriptionSchedule?.current) {
    const { items } = state.activeTeamInfo.subscriptionSchedule.current;

    const basePlanItem = items.find(i => i.name === 'flex');
    if (!basePlanItem) {
      return;
    }

    const standardPlan: PricingPlan =
      state.checkout.availableBasePlans[basePlanItem.name];
    const standardPrice =
      billingInterval === SubscriptionInterval.Yearly
        ? standardPlan.priceYearly
        : standardPlan.priceMonthly;

    const basePlan = {
      id: basePlanItem.name as PlanType,
      // price might be custom even if it's the base plan selected
      price:
        (basePlanItem.unitAmount
          ? basePlanItem.unitAmount / 100
          : standardPrice) / billingFactor,
      name: standardPlan.name,
      credits: standardPlan.credits, // credits are always the same for the base plan
    };

    currentSubscription = {
      totalCredits: basePlan.credits,
      totalPrice: basePlan.price * billingFactor, // total price is re-multiplied by 12 for annual
      addonItems: [],
      basePlan,
      billingInterval,
    };

    items.forEach(item => {
      // Ignore all non-credit prefixed addons or addons with no quantity / unitAmount
      if (
        !item.name.startsWith('credits_') ||
        item.quantity === null ||
        item.unitAmount === null ||
        !currentSubscription
      ) {
        return;
      }

      const standardAddon = state.checkout.availableCreditAddons[item.name];

      currentSubscription.addonItems.push({
        quantity: item.quantity,
        addon: {
          id: item.name as CreditAddonType,
          price: item.unitAmount / billingFactor / 100,
          credits: standardAddon.credits,
        },
      });
      currentSubscription.totalPrice += (item.unitAmount / 100) * item.quantity;
      currentSubscription.totalCredits += standardAddon.credits * item.quantity;
    });
  }

  if (state.activeTeamInfo?.subscriptionSchedule?.upcoming) {
    const { items } = state.activeTeamInfo.subscriptionSchedule.upcoming;
    const basePlanItem = items.find(i => i.name === 'flex');

    if (!basePlanItem) {
      return;
    }

    const standardPlan: PricingPlan =
      state.checkout.availableBasePlans[basePlanItem.name];
    const standardPrice =
      billingInterval === SubscriptionInterval.Yearly
        ? standardPlan.priceYearly
        : standardPlan.priceMonthly;

    const basePlan = {
      id: basePlanItem.name as PlanType,
      // price might be custom even if it's the base plan selected
      price:
        (basePlanItem.unitAmount
          ? basePlanItem.unitAmount / 100
          : standardPrice) / billingFactor,
      name: standardPlan.name,
      credits: standardPlan.credits, // credits are always the same for the base plan
    };

    upcomingSubscription = {
      totalCredits: basePlan.credits,
      totalPrice: basePlan.price * billingFactor,
      addonItems: [],
      basePlan,
      billingInterval,
    };

    items.forEach(item => {
      // Ignore all non-credit prefixed addons or addons with no quantity / unitAmount
      if (
        !item.name.startsWith('credits_') ||
        item.quantity === null ||
        item.unitAmount === null ||
        !upcomingSubscription
      ) {
        return;
      }

      const standardAddon = state.checkout.availableCreditAddons[item.name];

      upcomingSubscription.addonItems.push({
        quantity: item.quantity,
        addon: {
          id: item.name as CreditAddonType,
          price: item.unitAmount / 100,
          credits: standardAddon.credits,
        },
      });
      upcomingSubscription.totalPrice +=
        (item.unitAmount / 100) * item.quantity;
      upcomingSubscription.totalCredits +=
        standardAddon.credits * item.quantity;
    });
  }

  /**
   * If there's an existing subscription update, currentSubscription and newSubscription are both used (manage addons flow)
   * Otherwise, the newSubscription is used as the current checkout "cart"
   */
  if (upcomingSubscription && currentSubscription) {
    state.checkout.currentSubscription = currentSubscription;
    state.checkout.newSubscription = upcomingSubscription;
    state.checkout.hasUpcomingChange = true;
  } else if (currentSubscription) {
    // When no upcoming change is scheduled, initialize both currentSubscription and newSubscription with the same data, as only one is displayed
    state.checkout.currentSubscription = currentSubscription;
    state.checkout.newSubscription = structuredClone(currentSubscription); // ensure no cross reference.
  }

  actions.checkout.recomputeTotals();
  actions.checkout.recomputeAddonChanges();
};

export const addCreditsPackage = (
  { state, actions }: Context,
  addonId: CreditAddonType
) => {
  const addon = state.checkout.availableCreditAddons[addonId];
  if (!state.checkout.newSubscription || !addon) {
    return;
  }

  const addonInCheckoutAlready = state.checkout.newSubscription.addonItems.find(
    item => item.addon.id === addon.id
  );

  if (addonInCheckoutAlready) {
    addonInCheckoutAlready.quantity++;
  } else {
    state.checkout.newSubscription.addonItems.push({
      addon: {
        id: addon.id,
        credits: addon.credits,
        price:
          state.checkout.newSubscription.billingInterval ===
          SubscriptionInterval.Monthly
            ? addon.priceMonthly
            : addon.priceYearly / 12,
      },
      quantity: 1,
    });
  }

  actions.checkout.recomputeTotals();
  actions.checkout.recomputeAddonChanges();
};

export const removeCreditsPackage = (
  { state, actions }: Context,
  addonId: CreditAddonType
) => {
  if (!state.checkout.newSubscription) {
    return;
  }

  const addonItem = state.checkout.newSubscription.addonItems.find(
    item => item.addon.id === addonId
  );

  if (!addonItem) {
    return;
  }

  addonItem.quantity--;

  if (addonItem.quantity === 0) {
    state.checkout.newSubscription.addonItems = state.checkout.newSubscription.addonItems.filter(
      item => item.addon.id !== addonId
    );
  }

  actions.checkout.recomputeTotals();
  actions.checkout.recomputeAddonChanges();
};

export const recomputeTotals = ({ state }: Context) => {
  const { newSubscription } = state.checkout;

  if (!newSubscription) {
    return;
  }

  const billingInterval =
    newSubscription.billingInterval === SubscriptionInterval.Monthly ? 1 : 12;

  const totalCreditAddonsPrice = newSubscription.addonItems.reduce(
    (acc, item) => acc + item.addon.price * item.quantity * billingInterval,
    0
  );

  const totalAddonCredits = newSubscription.addonItems.reduce(
    (acc, item) => acc + item.addon.credits * item.quantity,
    0
  );

  newSubscription.totalPrice =
    newSubscription.basePlan.price * billingInterval + totalCreditAddonsPrice;

  newSubscription.totalCredits =
    newSubscription.basePlan.credits + totalAddonCredits;
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

export const calculateLegacyToUBBConversionCharge = async (
  { state, effects, actions }: Context,
  { workspaceId }: { workspaceId: string }
) => {
  const { newSubscription } = state.checkout;

  if (!newSubscription) {
    return;
  }

  try {
    const result = await effects.gql.mutations.previewConvertToUsageBilling({
      teamId: workspaceId,
      plan: newSubscription.basePlan.id,
      addons: actions.checkout.getFlatAddonsList(),
      billingInterval: newSubscription.billingInterval,
    });

    // Cap the values to a min of 0
    state.checkout.convertLegacyPlanToUBBCharge = {
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
    state.checkout.convertLegacyPlanToUBBCharge = null;
  }
};

export const convertToUsageBilling = async (
  { state, effects, actions }: Context,
  { workspaceId }: { workspaceId: string }
): Promise<{ success: boolean; error?: string }> => {
  const { newSubscription } = state.checkout;

  if (!newSubscription) {
    return {
      success: false,
      error: 'Unexpected error. Please try again later',
    };
  }

  try {
    await effects.gql.mutations.convertToUsageBilling({
      teamId: workspaceId,
      plan: newSubscription.basePlan.id,
      addons: actions.checkout.getFlatAddonsList(),
      billingInterval: newSubscription.billingInterval,
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

export const calculateSubscriptionUpdateCharge = async (
  { state, effects }: Context,
  { workspaceId }: { workspaceId: string }
) => {
  const { newSubscription } = state.checkout;

  if (!newSubscription) {
    return;
  }

  try {
    const result = await effects.gql.mutations.previewUpdateSubscriptionPlan({
      teamId: workspaceId,
      plan: newSubscription.basePlan.id,
      billingInterval: newSubscription.billingInterval,
    });

    // Cap the values to a min of 0
    state.checkout.convertPlanCharge = {
      total: Math.max(
        (result.previewUpdateUsageSubscriptionPlan?.total ?? 0) / 100,
        0
      ),
      totalExcludingTax: Math.max(
        (result.previewUpdateUsageSubscriptionPlan?.totalExcludingTax ?? 0) /
          100,
        0
      ),
      updateMoment: result.previewUpdateUsageSubscriptionPlan?.updateMoment,
    };
  } catch (e) {
    state.checkout.convertPlanCharge = null;
  }
};

export const updateSubscriptionPlan = async (
  { state, effects }: Context,
  { workspaceId }: { workspaceId: string }
): Promise<{ success: boolean; error?: string }> => {
  const { newSubscription } = state.checkout;

  if (!newSubscription) {
    return {
      success: false,
      error: 'Unexpected error. Please try again later',
    };
  }

  try {
    await effects.gql.mutations.updateSubscriptionPlan({
      teamId: workspaceId,
      plan: newSubscription.basePlan.id,
      billingInterval: newSubscription.billingInterval,
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
  if (!state.checkout.newSubscription) {
    return [];
  }

  const addonItems = state.checkout.newSubscription.addonItems;
  const addons: string[] = [];
  addonItems.forEach(item => {
    for (let i = 0; i < item.quantity; i++) {
      addons.push(item.addon.id);
    }
  });

  return addons;
};

export const recomputeAddonChanges = ({ state }: Context): void => {
  const changes: Array<AddonItem> = [];

  const currentAddons = state.checkout.currentSubscription?.addonItems || [];
  const newAddons = state.checkout.newSubscription?.addonItems || [];

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
