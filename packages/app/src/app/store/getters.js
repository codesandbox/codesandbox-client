export function isPatron() {
  return Boolean(
    this.user && this.user.subscription && this.user.subscription.since
  );
}

export function isLoggedIn() {
  return Boolean(this.jwt) && Boolean(this.user);
}
