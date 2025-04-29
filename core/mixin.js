export const Mixin = {
  Providers({ value, children }) {
    window.__preact_context = { ...window.__preact_context, ...value };
    return children;
  }
};
