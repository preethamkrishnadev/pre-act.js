import { createElement } from './vdom.js';
import { render } from './rerender.js';

export let isDebugMode = false;

export function createApp(App, selector = '#app', props = {}) {
  const container = document.querySelector(selector);

  function mount() {
    import('./polyfills.js');
    const vnode = createElement(App, props);
    render(vnode, container);
  }

  const app = {
    mount,
    debug: false
  };

  Object.defineProperty(app, 'debug', {
    get: () => isDebugMode,
    set: (value) => {
      isDebugMode = value;
      window.__preact_debug__ = value;
    }
  });

  return app;
}
