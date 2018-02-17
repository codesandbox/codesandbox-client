import { Provider } from '@cerebral/fluent';
import store from 'store/dist/store.modern';

export default Provider({
  get() {
    return (
      store.get('jwt') || (document.cookie.match(/[; ]?jwt=([^\s;]*)/) || [])[1]
    );
  },
  set(jwt) {
    return store.set('jwt', jwt);
  },
  reset() {
    document.cookie = `jwt=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;

    return store.set('jwt', null);
  },
});
