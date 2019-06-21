import { SubscriptionError } from './errors';

export function subscribe({ props, api, state }) {
  return api
    .post('/users/current_user/subscription', {
      subscription: {
        amount: state.get('patron.price'),
        token: props.token,
        coupon: props.coupon,
      },
    })
    .then(data => ({ user: data }))
    .catch(error => {
      throw new SubscriptionError(error.response.result);
    });
}

export function updateSubscription({ api, state, props }) {
  return api
    .patch('/users/current_user/subscription', {
      subscription: {
        amount: state.get('patron.price'),
        coupon: props.coupon,
      },
    })
    .then(data => ({ user: data }))
    .catch(error => {
      throw new SubscriptionError(error.response.result);
    });
}

export function cancelSubscription({ api }) {
  return api
    .delete('/users/current_user/subscription')
    .then(data => ({ user: data }))
    .catch(error => {
      throw new SubscriptionError(error.response.result);
    });
}

export function whenConfirmedCancelSubscription({ browser, path }) {
  const confirmed = browser.confirm(
    'Are you sure you want to cancel your subscription?'
  );

  return confirmed ? path.true() : path.false();
}
