const routes = [];

function get(path, handler) {
  routes.push({ method: 'GET', path, handler });
}

function match(method, pathname) {
  for (const route of routes) {
    if (route.method === method && route.path === pathname) {
      return route.handler;
    }
  }
  return null;
}

module.exports = { get, match };
