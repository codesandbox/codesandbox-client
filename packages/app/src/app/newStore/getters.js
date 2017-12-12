export function isPatron() {
  return Boolean(this.user.subscription && this.user.subscription.since);
}

export function isLoggedIn() {
  return Boolean(this.jwt);
}
