const http = require('http');
const url = require('url');

const router = require('./src/middleware/router');
const staticServe = require('./src/middleware/static');
const errorHandler = require('./src/middleware/errorHandler');

const productos = require('./src/routes/productos');
const proveedor = require('./src/routes/proveedor');
const admin = require('./src/routes/admin');

router.get('/api/v1/productos', productos.handleGet);
router.get('/api/v1/proveedor/status', proveedor.handleGet);

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  req.query = parsedUrl.query;

  const handler = router.match(req.method, parsedUrl.pathname);
  if (handler) {
    try {
      handler(req, res);
    } catch (err) {
      errorHandler(err, req, res);
    }
  } else if (req.method === 'GET' && parsedUrl.pathname !== '/') {
    staticServe(parsedUrl.pathname, res);
  } else {
    staticServe('/index.html', res);
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  admin.start();
});
