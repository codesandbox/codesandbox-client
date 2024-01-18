import { Context } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';
import { SubscriptionInterval } from 'app/graphql/types';
import { Step, PaymentSummary, PaymentPreview } from './types';

export const pageMounted = withLoadApp(async ({ effects, state, actions }) => {
  // We have to call the api effect directly rather than using an action because
  // for some reason an action doesn't work.
  const prices = await effects.api.getPrices();

  if (prices) {
    state.pro.prices = prices;
  }

  // This action does work.
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

// TODO: Refactor since billingInterval is always Yearly.
export const previewUpdateSubscriptionBillingInterval = async (
  { state, effects }: Context,
  {
    billingInterval,
  }: {
    billingInterval: SubscriptionInterval;
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
    billingInterval: SubscriptionInterval;
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
