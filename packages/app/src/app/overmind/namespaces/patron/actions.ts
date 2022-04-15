import { Context } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';
import { StripeErrorCode } from '@codesandbox/common/lib/types';
import { NotificationStatus } from '@codesandbox/notifications';

export const patronMounted = withLoadApp();

export const priceChanged = (
  { state }: Context,
  { price }: { price: number }
) => {
  state.patron.price = price;
};

export const createSubscriptionClicked = async (
  { state, effects, actions }: Context,
  {
    token,
    coupon,
    duration,
  }: {
    token: string;
    coupon: string;
    duration: 'yearly' | 'monthly';
  }
) => {
  effects.analytics.track('Create Patron Subscription', { duration });
  state.patron.error = null;
  state.patron.isUpdatingSubscription = true;
  try {
    state.user = await effects.api.createPatronSubscription(
      token,
      state.patron.price,
      duration,
      coupon
    );
    effects.notificationToast.success('Thank you very much for your support!');
  } catch (error) {
    if (
      error.error_code &&
      error.error_code === StripeErrorCode.REQUIRES_ACTION
    ) {
      try {
        await effects.stripe.handleCardPayment(error.data.client_secret);
        state.user = await effects.api.getCurrentUser();
        state.patron.error = null;
      } catch (e) {
        actions.internal.handleError({
          message: 'Could not create subscription',
          error: e,
        });

        state.patron.error = e.message;

        effects.analytics.track('Create Subscription Error', {
          error: e.message,
        });
      }
    } else {
      actions.internal.handleError({
        message: 'Could not create subscription',
        error,
      });

      state.patron.error = error.message;

      effects.analytics.track('Create Subscription Error', {
        error: error.message,
      });
    }
  }
  state.patron.isUpdatingSubscription = false;
};

export const updateSubscriptionClicked = async (
  { state, effects }: Context,
  {
    coupon,
  }: {
    coupon: string;
  }
) => {
  effects.analytics.track('Update Patron Subscription');
  state.patron.error = null;
  state.patron.isUpdatingSubscription = true;
  try {
    state.user = await effects.api.updatePatronSubscription(
      state.patron.price,
      coupon
    );
    effects.notificationToast.success('Subscription updated!');
  } catch (error) {
    state.patron.error = error.message;
  }
  state.patron.isUpdatingSubscription = false;
};

export const cancelSubscriptionClicked = async ({
  state,
  effects,
}: Context) => {
  effects.analytics.track('Cancel Subscription');
  if (
    effects.browser.confirm(
      'Are you sure you want to cancel your subscription?'
    )
  ) {
    state.patron.error = null;
    state.patron.isUpdatingSubscription = true;

    try {
      state.user = await effects.api.cancelPatronSubscription();
      effects.notificationToast.add({
        status: NotificationStatus.SUCCESS,
        title: 'Successfully Cancelled',
        message:
          'Sorry to see you go, but thanks for using CodeSandbox! It would help us tremendously if you could answer this one quick question.',
        actions: {
          primary: {
            label: 'Open Question',
            run: () => {
              effects.browser.openPopup(
                'https://codesandbox.typeform.com/to/SsMUYr6y#email=' +
                  state.user!.email,
                'cancel survey'
              );
            },
          },
        },
      });
    } catch (error) {
      /* ignore */
    }

    state.patron.isUpdatingSubscription = false;
  }
};

export const tryAgainClicked = ({ state }: Context) => {
  state.patron.error = null;
};
