import { AsyncAction, Action } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';
import { User, CurrentUser } from '@codesandbox/common/lib/types';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';

export const patronMounted: AsyncAction = withLoadApp();

export const priceChanged: Action<number> = ({ state }, price) => {
  state.patron.price = price;
};

export const createSubscriptionClicked: AsyncAction<string> = async (
  { state, effects },
  token
) => {
  effects.analytics.track('Create Patron Subscription');
  state.patron.error = null;
  state.patron.isUpdatingSubscription = true;
  try {
    state.user = await effects.api.post<CurrentUser>(
      '/users/current_user/subscription',
      {
        subscription: {
          amount: state.patron.price,
          token,
        },
      }
    );
    effects.notificationToast.add({
      message: 'Thank you very much for your support!',
      status: NotificationStatus.SUCCESS,
    });
  } catch (error) {
    state.patron.error = error.message;
  }
  state.patron.isUpdatingSubscription = false;
};

export const updateSubscriptionClicked: AsyncAction<CurrentUser> = async (
  { state, effects },
  user
) => {
  effects.analytics.track('Update Patron Subscription');
  state.patron.error = null;
  state.patron.isUpdatingSubscription = true;
  try {
    state.user = await effects.api.patch<CurrentUser>(
      '/users/current_user/subscription',
      {
        subscription: {
          amount: state.patron.price,
        },
      }
    );
    effects.notificationToast.add({
      message: 'Subscription updated, thanks for helping out!',
      status: NotificationStatus.SUCCESS,
    });
  } catch (error) {
    state.patron.error = error.message;
  }
  state.patron.isUpdatingSubscription = false;
};

export const cancelSubscriptionClicked: AsyncAction = async ({
  state,
  effects,
}) => {
  effects.analytics.track('Cancel Subscription');
  if (
    effects.browser.confirm(
      'Are you sure you want to cancel your subscription?'
    )
  ) {
    state.patron.error = null;
    state.patron.isUpdatingSubscription = true;
    try {
      state.user = await effects.api.delete<CurrentUser>(
        '/users/current_user/subscription'
      );
      effects.notificationToast.add({
        message:
          'Sorry to see you go, but thanks a bunch for the support this far!',
        status: NotificationStatus.SUCCESS,
      });
    } catch (error) {}

    state.patron.isUpdatingSubscription = false;
  }
};

export const tryAgainClicked: Action = ({ state }) => {
  state.patron.error = null;
};
