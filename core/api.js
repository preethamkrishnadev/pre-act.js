import { ENV } from './env.js';

export async function api(path, method = 'GET', body = null, headers = {}) {
  const url = ENV.apiBaseURL + path;
  const options = { method, headers: { 'Content-Type': 'application/json', ...headers } };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  return res.headers.get('content-type')?.includes('application/json') ? res.json() : res.text();
}
