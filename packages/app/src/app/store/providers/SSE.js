import { Provider } from 'cerebral';
import store from 'store/dist/store.modern';

export default Provider({
  get() {
    return store.get('sse');
  },
  set(sse) {
    return store.set('sse', sse);
  },
  reset() {
    return store.set('sse', null);
  },
});
