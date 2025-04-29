function safeStorage(storage) {
  try {
    storage.setItem('__test', '1');
    storage.removeItem('__test');
    return storage;
  } catch {
    let memory = {};
    return {
      getItem: (k) => memory[k],
      setItem: (k, v) => memory[k] = v,
      removeItem: (k) => delete memory[k],
      clear: () => { memory = {}; }
    };
  }
}

export const SafeLocalStorage = safeStorage(window.localStorage);
export const SafeSessionStorage = safeStorage(window.sessionStorage);
