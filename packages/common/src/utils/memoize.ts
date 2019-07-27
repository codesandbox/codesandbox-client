const defaultStore = new Map();

export const cache = (key: string, value: any, store = defaultStore) =>
  store.get(key) ||
  store.set(key, typeof value === `function` ? value() : value).get(key);

export const memoize = (fn: Function, store = new Map()) => (...args: any[]) =>
  cache(JSON.stringify(args), () => fn(...args), store);
