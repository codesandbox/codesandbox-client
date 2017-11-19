import store from 'store/dist/store.modern';

export default function getJwt() {
  // TODO remove cookie
  return (
    store.get('jwt') || (document.cookie.match(/[; ]?jwt=([^\s;]*)/) || [])[1]
  );
}

export function resetJwt() {
  document.cookie = `jwt=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  return store.set('jwt', null);
}

export function setJwt(jwt: string) {
  return store.set('jwt', jwt);
}
