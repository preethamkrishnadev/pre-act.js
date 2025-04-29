import { rerender } from './render.js';

const globalStore = {};
let storeListeners = new Set();

function deepSet(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

function deepGet(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function createStoreProxy(state) {
  return new Proxy(state, {
    get(target, key) {
      const value = target[key];
      if (typeof value === 'object' && value !== null) {
        return createStoreProxy(value);
      }
      return value;
    },
    set(target, key, value) {
      target[key] = value;
      storeListeners.forEach(fn => fn(globalStore));
      rerender();
      return true;
    }
  });
}

export const $store = createStoreProxy(globalStore);

export function setStoreValue(path, value) {
  deepSet(globalStore, path, value);
  storeListeners.forEach(fn => fn(globalStore));
  rerender();
}

export function useStoreSubscribe(listener) {
  storeListeners.add(listener);
  return () => storeListeners.delete(listener);
}
