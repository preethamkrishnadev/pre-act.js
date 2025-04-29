export function pushToDataLayer(eventName, params) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}

export function pushToFeLogs(eventName, params) {
  window.felogs = window.felogs || [];
  window.felogs.push({ event: eventName, ...params });
}

export function logEvent(componentName, eventName, params = {}) {
  pushToDataLayer(eventName, params);
  pushToFeLogs(eventName, params);

  if (window.__preact_debug__) {
    console.groupCollapsed(`[Logging] ${componentName}`);
    console.log('Event:', eventName);
    console.log('Params:', params);
    console.groupEnd();
  }
}
