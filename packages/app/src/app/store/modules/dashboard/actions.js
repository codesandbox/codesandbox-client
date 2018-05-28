export function getUserSandboxes({ api }) {
  return api
    .get(`/users/current_user/sandboxes`)
    .then(data => ({ sandboxes: data }));
}
