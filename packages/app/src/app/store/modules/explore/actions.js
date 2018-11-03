export function mountPopularSandboxes({ path, api, props }) {
  return api
    .get(`/sandboxes/popular?start_date=${props.date}`)
    .then(data => path.success({ popularSandboxes: data }))
    .catch(() => path.error());
}

export function mountPickedSandboxes({ path, api, state }) {
  return api
    .get(`/sandboxes/picked`)
    .then(data => {
      const indexes = data.sandboxes.map(a => a.id);

      state.set(`explore.pickedSandboxesIndexes`, indexes);

      return path.success({ pickedSandboxes: data });
    })
    .catch(() => path.error());
}

export function pickSandbox({ path, api, props, state }) {
  return api
    .post(`/sandboxes/${props.id}/pick`)
    .then(data => {
      const index = state
        .get(`explore.popularSandboxes.sandboxes`)
        .findIndex(module => module.id === props.id);

      state.set(`explore.popularSandboxes.sandboxes.${index}.picks`, [
        {
          ...data,
          id: Math.random().toString(),
        },
      ]);
      return path.success();
    })
    .catch(() => path.error());
}
