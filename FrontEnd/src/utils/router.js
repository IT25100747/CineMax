// filepath: src/utils/router.js
/**
 * Router utilities for hash-based client-side routing
 */

// Get the current route from the URL hash
export function route() {
  return location.hash.replace(/^#/, '') || '/';
}

// Set a new route by updating the URL hash
export function setRoute(route) {
  location.hash = route;
}

// Parse the current route into path and query string
export function parseRoute() {
  const [path, query = ''] = route().split('?');
  const parts = path.split('/').filter(Boolean);
  return { path, query, parts };
}

// Initialize hashchange listener for routing
export function initRouter(onRouteChange) {
  window.addEventListener('hashchange', onRouteChange);
}