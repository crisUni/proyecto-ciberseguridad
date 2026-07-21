const http = require('http');
const url = require('url');
const db = require('../db/database');

// TODO: implement product deletion (only accessible via SSRF on 127.0.0.1)
// REMINDER: add inline comments explaining why each line is insecure

function handleDelete(req, res) {
  const productId = req.query.id || '';

  const query = `DELETE FROM productos WHERE id = ${productId}`;

  db.run(query, function (err) {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ deleted: this.changes }));
  });
}

function start() {
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    req.query = parsedUrl.query;

    if (req.method === 'GET' && parsedUrl.pathname === '/admin/delete') {
      handleDelete(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  });

  const PORT = 9090;
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`Admin server (internal) on http://127.0.0.1:${PORT}`);
  });
}

module.exports = { start };
