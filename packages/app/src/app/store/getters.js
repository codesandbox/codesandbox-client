import store from 'store/dist/store.modern';

export function isPatron() {
  return Boolean(
    this.user && this.user.subscription && this.user.subscription.since
  );
}

export function isLoggedIn() {
  return Boolean(this.jwt) && Boolean(this.user);
}

export function hasLogIn() {
  return !!this.jwt || !!store.get('jwt');
}
