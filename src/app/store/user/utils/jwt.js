import store from 'store/dist/store.modern';

export default function getJwt() {
  return store.get('jwt');
}

export function resetJwt() {
  return store.set('jwt', null);
}

export function setJwt(jwt: string) {
  return store.set('jwt', jwt);
}
