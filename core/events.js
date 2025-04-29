const globalListeners = new Map();
let idCounter = 0;

export function triggerEvent(eventName, payload, scope = null) {
  globalListeners.forEach(({ event, callback, componentName }) => {
    if (event === eventName && (!scope || scope.includes(componentName))) {
      callback(payload);
    }
  });
}

export function registerListener(event, callback, componentName) {
  const id = ++idCounter;
  globalListeners.set(id, { event, callback, componentName });
  return () => globalListeners.delete(id);
}
