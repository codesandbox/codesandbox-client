import store from 'store/dist/store.modern';

export function hasAuthToken() {
  return !!store.get('jwt');
}
