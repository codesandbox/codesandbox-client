export function toggleBadgeVisibility({ state, props }) {
  const { id } = props;
  const badges = state.get('user.badges');

  badges.forEach((badge, index) => {
    const currentVis = badge.visible;
    if (badge.id === id) {
      state.set(`user.badges.${index}.visible`, !currentVis);
    }
  });
}

export function updateBadgeInfo({ api, props }) {
  const { id, visible } = props;
  const body = {
    badge: {
      visible,
    },
  };
  return api
    .patch(`/users/current_user/badges/${id}`, body)
    .then(data => ({ data }));
}

export function getPaymentDetails({ api }) {
  return api
    .get(`/users/current_user/payment_details`, {})
    .then(data => ({ data }))
    .catch(error => ({ error }));
}

export function updatePaymentDetails({ api, props }) {
  const { token } = props;
  const body = {
    paymentDetails: {
      token,
    },
  };
  return api.patch('/users/current_user/payment_details', body).then(data => ({data}));
}

export function toggleDevtools({ state, props }) {
  state.set('editor.preferences.showDevtools', props.isOpen);
}
