export function loadPages() {
  const pages = import.meta.glob('/resources/js/pages/**/page.jsx', { eager: true });

  const routes = [];

  for (const path in pages) {
    const page = pages[path];

    let routePath = path
      .replace('/resources/js/pages', '')
      .replace('/page.jsx', '')
      .replace(/\*as\[(.*?)\]/g, ':$1*')
      .replace(/\[(.*?)\]/g, ':$1')
      .replace(/\/index$/, '/');

    routes.push({
      path: routePath === '' ? '/' : routePath,
      component: page.default,
      middleware: page.middleware || []
    });
  }

  return routes;
}
