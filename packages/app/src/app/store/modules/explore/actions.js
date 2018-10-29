export function mountPopularSandboxes({ path, api, props }) {
  return api
    .get(`/sandboxes/popular?start_date=${props.date}`)
    .then(data => path.success({ popularSandboxes: data }))
    .catch(() => path.error());
}

export function pickSandbox({ path, api, props }) {
  return api
    .post(`/sandboxes/${props.id}/pick`)
    .then(data => console.log(data))
    .catch(() => path.error());
}
