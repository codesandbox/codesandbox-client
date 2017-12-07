// @flow
import store from 'store/dist/store.modern';

export function setOption(key: string, val: any) {
  try {
    store.set(key, val);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function getKey<D: any>(key: string, defaultVal: D): ?D {
  try {
    const result = store.get(key);
    return result === undefined ? defaultVal : result;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
