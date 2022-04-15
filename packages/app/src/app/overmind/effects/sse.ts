import store from 'store/dist/store.modern';

export default {
  get() {
    return store.get('sse');
  },
  set(sse) {
    return store.set('sse', sse);
  },
  reset() {
    return store.set('sse', null);
  },
};
