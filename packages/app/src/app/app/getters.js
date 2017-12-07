export function subscribed() {
  return Boolean(this.user.subscription);
}

export function isLoggedIn() {
  return Boolean(this.jwt);
}
