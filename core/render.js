import { isDebugMode } from './createApp.js';
import { logEvent } from './logger.js';
import { triggerEvent, registerListener } from './events.js';
import { $store, setStoreValue } from './store.js';
import { navigate, buildPath } from './router.js';

export function render(vnode, container) {
  container.innerHTML = '';
  container.appendChild(createDomElement(vnode));
}

export function rerender() {
  // Add rerender logic if needed for future diff optimization
}

function createDomElement(vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(vnode);
  }
  
  if (typeof vnode.type === 'function') {
    const node = createNode(vnode);
    const componentVNode = vnode.type({ ...vnode.props }, node);
    const el = createDomElement(componentVNode);
    
    setTimeout(() => {
      if (isDebugMode) node.log('mounted');
    }, 0);
    
    return el;
  }
  
  const el = document.createElement(vnode.type);
  
  for (const [name, value] of Object.entries(vnode.props || {})) {
    if (name.startsWith('@')) {
      el.addEventListener(name.slice(1), value);
    } else {
      el.setAttribute(name, value);
    }
  }
  
  for (const child of vnode.children) {
    el.appendChild(createDomElement(child));
  }
  
  return el;
}

function createNode(vnode) {
  const url = new URL(window.location.href);

  const node = {
    path: url.pathname,
    host: url.host,
    queryParams: Object.fromEntries(url.searchParams.entries()),
    hash: url.hash,
    urlParams: vnode.props?.params || {},
    forceRender: false,
    $store: $store,
    store: (keyPath, value) => setStoreValue(keyPath, value),
    storeSlice: (slice) => ({
      store: (keyPath, value) => setStoreValue(`${slice}.${keyPath}`, value)
    }),
    log: (eventName, ...params) => {
      logEvent(vnode.type.name || 'UnknownComponent', eventName, params[0] || {});
    },
    navigate: (pathTemplate, queryParams = {}, params = {}) => {
      navigate(buildPath(pathTemplate, queryParams, params));
    },
    trigger(eventName, payload) {
      triggerEvent(eventName, payload);
    },
    onTrigger(eventName, callback) {
      const componentName = vnode.type.name || 'UnknownComponent';
      return registerListener(eventName, callback, componentName);
    }
  };

  if (isDebugMode) {
    node.log('created');
  }
  
  return node;
}
