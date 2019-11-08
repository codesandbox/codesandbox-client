import { identify, resetUserId } from '@codesandbox/common/lib/utils/analytics';
import store from 'store/dist/store.modern';

export default {
  get() {
    return (
      store.get('jwt') || (document.cookie.match(/[; ]?jwt=([^\s;]*)/) || [])[1]
    );
  },
  set(jwt) {
    document.cookie = `signedIn=true; Path=/;`;

    return store.set('jwt', jwt);
  },
  reset() {
    document.cookie = `signedIn=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    document.cookie = `jwt=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;

    identify('signed_in', false);
    resetUserId();

    return store.set('jwt', null);
  },
};
