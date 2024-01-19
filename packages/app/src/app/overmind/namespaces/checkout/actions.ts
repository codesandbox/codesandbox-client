import { PlanType } from 'app/constants';
import type { Context } from 'app/overmind';
import {
  CreditAddon,
  CreditAddonType,
  SandboxAddon,
  SandboxAddonType,
} from './state';

export const PRO_BASE_PLAN_PRICE = 9;

export const selectPlan = ({ state }: Context, plan: PlanType) => {
  state.checkout.plan = plan;
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

export const decrementCreditsPackageQuantity = (
  { state, actions }: Context,
  addonId: CreditAddonType
) => {
  const addonItem = state.checkout.creditAddons.find(
    item => item.addon.id === addonId
  );

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

export const decrementSandboxPackageQuantity = (
  { state, actions }: Context,
  addonId: SandboxAddonType
) => {
  const addon = state.checkout.sandboxAddons.find(
    item => item.addon.id === addonId
  );

  addon.quantity--;

  if (addon.quantity === 0) {
    state.checkout.sandboxAddons = state.checkout.sandboxAddons.filter(
      item => item.addon.id !== addonId
    );
  }

  actions.checkout.recomputeTotals();
};

export const recomputeTotals = ({ state }: Context) => {
  const totalCreditAddonsPrice = state.checkout.creditAddons.reduce(
    (acc, item) => acc + item.addon.price * item.quantity,
    0
  );

  const totalSandboxAddonsPrice = state.checkout.sandboxAddons.reduce(
    (acc, item) => acc + item.addon.price * item.quantity,
    0
  );

  state.checkout.totalPrice =
    PRO_BASE_PLAN_PRICE + totalCreditAddonsPrice + totalSandboxAddonsPrice;

  state.checkout.totalCredits = state.checkout.creditAddons.reduce(
    (acc, item) => acc + item.addon.credits * item.quantity,
    0
  );

  state.checkout.totalSandboxes = state.checkout.sandboxAddons.reduce(
    (acc, item) => acc + item.addon.sandboxes * item.quantity,
    0
  );
};
