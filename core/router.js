import { rerender } from './render.js';

const globalMiddlewares = [];

export function useGlobalMiddleware(middlewareFn) {
  globalMiddlewares.push(middlewareFn);
}

export function buildPath(template, query = {}, params = {}) {
  let path = template;

  path = path.replace(/{(.*?)}/g, (_, key) => params[key] || '');

  const queryStr = Object.entries(query)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

  return queryStr ? `${path}?${queryStr}` : path;
}

function pathToRegex(path) {
  return new RegExp('^' + path
    .replace(/:([\w]+)\*/g, '(.*)')    // catch all
    .replace(/:([\w]+)/g, '([^/]+)')   // single dynamic
    + '$');
}

function getParams(match, route) {
  const values = match.slice(1);
  const keys = Array.from(route.path.matchAll(/:([\w]+)\*?/g)).map(m => m[1]);

  const params = {};
  keys.forEach((key, index) => {
    const raw = values[index];
    params[key] = raw.includes('/') ? raw.split('/') : raw;
  });

  return params;
}

export function Router({ routes, fallback = () => '404 Not Found' }) {
  let current = {
    path: window.location.pathname,
    params: {},
    component: fallback
  };

  async function onLocationChange() {
    const pathname = window.location.pathname;

    for (const route of routes) {
      const regex = pathToRegex(route.path);
      const match = pathname.match(regex);

      if (match) {
        const params = getParams(match, route);
        const context = { path: pathname, params };

        for (const mw of globalMiddlewares) {
          const result = await mw(context);
          if (result === false) return;
          if (typeof result === 'string') return navigate(result);
        }

        if (route.middleware) {
          const middlewares = Array.isArray(route.middleware) ? route.middleware : [route.middleware];
          for (const mw of middlewares) {
            const result = await mw(context);
            if (result === false) return;
            if (typeof result === 'string') return navigate(result);
          }
        }

        current = { path: pathname, params, component: route.component };
        rerender();
        return;
      }
    }

    current = { path: pathname, params: {}, component: fallback };
    rerender();
  }

  window.addEventListener('popstate', onLocationChange);
  onLocationChange();

  const Page = current.component;
  return Page ? Page({ params: current.params }) : null;
}

export function navigate(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('popstate'));
}
