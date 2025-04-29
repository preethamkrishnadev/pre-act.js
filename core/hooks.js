import { rerender } from './render.js';

export function useState(initialState = {}) {
  let listeners = new Set();
  let changeWatchers = new Map();
  let currentState = initialState;

  function notifyChange(newState, oldState) {
    for (const [key, callback] of changeWatchers) {
      if (key === '*') {
        callback(newState, oldState);
      } else {
        const keys = key.split('.');
        const newVal = keys.reduce((acc, k) => acc?.[k], newState);
        const oldVal = keys.reduce((acc, k) => acc?.[k], oldState);
        if (newVal !== oldVal) {
          callback(newVal, oldVal);
        }
      }
    }
  }

  function createProxy(state, rootPath = '') {
    return new Proxy(state, {
      get(target, prop) {
        const value = target[prop];
        if (typeof value === 'object' && value !== null) {
          return createProxy(value, `${rootPath}${prop}.`);
        }
        return value;
      },
      set(target, prop, value) {
        const oldState = JSON.parse(JSON.stringify(currentState));
        target[prop] = value;
        notifyChange(currentState, oldState);
        listeners.forEach(fn => fn(currentState));
        rerender();
        return true;
      }
    });
  }

  const proxyState = createProxy(currentState);

  function onLocalStateChange(watchers) {
    if (typeof watchers === 'function') {
      changeWatchers.set('*', watchers);
    } else {
      Object.entries(watchers).forEach(([path, callback]) => {
        changeWatchers.set(path, callback);
      });
    }
  }

  function setLocalState(updater) {
    const oldState = JSON.parse(JSON.stringify(currentState));
    if (typeof updater === 'function') {
      currentState = updater(currentState);
    } else {
      currentState = { ...currentState, ...updater };
    }
    notifyChange(currentState, oldState);
    listeners.forEach(fn => fn(currentState));
    rerender();
  }

  return [proxyState, onLocalStateChange, setLocalState];
}
