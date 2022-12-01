import { Context } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';
import { Step, Plan, PaymentSummary, PaymentPreview } from './types';

export const getPrices = async ({ state, effects }: Context) => {
  try {
    state.pro.prices = await effects.api.prices();
  } catch (err) {
    // Fail silently.
  }
};

export const pageMounted = withLoadApp(async ({ effects, state, actions }) => {
  state.pro.prices = await effects.api.prices();

  actions.getActiveTeamInfo();
});

export const setStep = ({ state }: Context, step: Step) => {
  state.pro.step = step;
};

export const updateSeats = ({ state }: Context, seats: number) => {
  state.pro.seats = seats;
};

export const paddleInitialised = ({ state }: Context) => {
  state.pro.isPaddleInitialised = true;
};

export const billingAmountLoaded = ({ state }: Context) => {
  state.pro.isBillingAmountLoaded = true;
};

export const updateSelectedPlan = ({ state }: Context, plan: Plan) => {
  state.pro.selectedPlan = plan;
};

export const previewUpdateSubscriptionBillingInterval = async (
  { state, effects }: Context,
  {
    billingInterval,
  }: {
    billingInterval: Plan['billingInterval'];
  }
) => {
  try {
    const previewSummary = await effects.gql.mutations.previewUpdateSubscriptionBillingInterval(
      {
        teamId: state.activeTeam,
        subscriptionId: state.activeTeamInfo!.subscription!.id,
        billingInterval,
      }
    );

    state.pro.paymentPreview = previewSummary.previewUpdateSubscriptionBillingInterval as PaymentPreview;
    state.pro.isBillingAmountLoaded = true;
  } catch {
    effects.notificationToast.error(
      'There was a problem getting your billing summary. Please email us at support@codesandbox.io'
    );
  }
};

export const updateSummary = ({ state }: Context, summary: PaymentSummary) => {
  state.pro.summary = summary;
};

export const updateSubscriptionBillingInterval = async (
  { state, effects }: Context,
  {
    billingInterval,
  }: {
    billingInterval: Plan['billingInterval'];
  }
) => {
  state.pro.updatingSubscription = true;

  try {
    await effects.gql.mutations.updateSubscriptionBillingInterval({
      teamId: state.activeTeam,
      subscriptionId: state.activeTeamInfo!.subscription!.id,
      billingInterval,
    });
    state.pro.updatingSubscription = false;
    location.href = '/pro/success';
  } catch {
    state.pro.updatingSubscription = false;
    effects.notificationToast.error(
      'There was a problem updating your billing interval. Please email us at support@codesandbox.io'
    );
  }
};

export const cancelWorkspaceSubscription = async ({
  state,
  effects,
  actions,
}: Context) => {
  try {
    const response = await effects.gql.mutations.softCancelSubscription({
      teamId: state.activeTeam,
      subscriptionId: state.activeTeamInfo!.subscription!.id,
    });

    // update state pessimistically
    state.activeTeamInfo!.subscription!.cancelAt =
      response.softCancelSubscription.cancelAt;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem cancelling your subscription. Please email us at support@codesandbox.io'
    );
  } finally {
    actions.modalClosed();
  }
};

export const reactivateWorkspaceSubscription = async ({
  state,
  effects,
}: Context) => {
  try {
    await effects.gql.mutations.reactivateSubscription({
      teamId: state.activeTeam,
      subscriptionId: state.activeTeamInfo!.subscription!.id,
    });

    // update state pessimistically
    state.activeTeamInfo!.subscription!.cancelAt = null;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem reactivating your subscription. Please email us at support@codesandbox.io'
    );
  }
};
