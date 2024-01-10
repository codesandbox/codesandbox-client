import { Context } from 'app/overmind';
import { NotificationStatus } from '@codesandbox/notifications';
import { renameZeitToVercel } from 'app/overmind/utils/vercel';

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
      const currentUser = await effects.api.cancelPatronSubscription();
      state.user = renameZeitToVercel(currentUser);

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
