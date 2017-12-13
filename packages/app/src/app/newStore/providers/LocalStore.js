import store from 'store/dist/store.modern';
import { Provider } from 'cerebral';

export default Provider({
  get(key) {
    try {
      return store.get(key);
    } catch (e) {
      console.error(e);
      return undefined;
    }
  },
  set(key, value) {
    try {
      store.set(key, value);
    } catch (e) {
      console.error(e);
    }
  },
});
