const http = require('http');
const https = require('https');
const url = require('url');

function handleGet(req, res) {
  const targetUrl = req.query.url || '';

  // Vulnerabilidad: la URL proporcionada por el usuario se usa sin validación
  // No hay verificación de IPs internas/privadas, ni lista blanca de dominios
  // Esto permite SSRF — el servidor actúa como proxy para el atacante
  // Se deberia utilizar la funcion encontrada en validateUrl.js
  // (no implementada en la version vulnerable)

  if (!targetUrl) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'url parameter is required' }));
    return;
  }

  const parsed = url.parse(targetUrl);

  // Vulnerabilidad: no se valida el protocolo (podría ser file://, gopher://, etc.)
  // Vulnerabilidad: no se valida el hostname (podría ser 127.0.0.1, 10.0.0.1, etc.)
  // Vulnerabilidad: no se valida el puerto (podría ser un servicio interno)

  const client = parsed.protocol === 'https:' ? https : http;

  client.get(targetUrl, (proxyRes) => {
    let data = '';
    proxyRes.on('data', (chunk) => { data += chunk; });
    proxyRes.on('end', () => {
      res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  }).on('error', (err) => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  });
}

module.exports = { handleGet };
