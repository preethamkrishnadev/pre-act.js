const ENVIRONMENTS = {
  development: { apiBaseURL: 'http://localhost:3000/api' },
  staging: { apiBaseURL: 'https://staging.api.dreamtree.in.net/api' },
  production: { apiBaseURL: 'https://api.dreamtree.in.net/api' }
};

export const ENV = (() => {
  const hostname = window.location.hostname;
  if (hostname.includes('localhost')) return ENVIRONMENTS.development;
  if (hostname.includes('staging')) return ENVIRONMENTS.staging;
  return ENVIRONMENTS.production;
})();
